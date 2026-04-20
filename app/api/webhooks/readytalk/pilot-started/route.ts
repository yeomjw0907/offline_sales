import { NextRequest } from "next/server"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"
import { createRequestTraceId, logTraceError, tracedJson } from "@/lib/db/request-trace"
import {
  authenticateReadyTalkRequest,
  findActivePartnerByReferralCode,
  getReadyTalkSystemUserId,
  READYTALK_PILOT_STARTED_EVENT,
  READYTALK_PROVIDER,
} from "@/lib/integrations/readytalk"
import type { Json, Tables, TablesInsert } from "@/lib/db/types"
import { validateReadyTalkPilotStartedInput } from "@/lib/validation/readytalk"

function normalizePilotStartedDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return value.slice(0, 10)
  return value
}

function isUniqueViolation(error: unknown) {
  if (!error || typeof error !== "object") return false
  const maybeCode = "code" in error ? error.code : null
  return maybeCode === "23505"
}

async function getExistingEventRecord(eventId: string) {
  const supabase = createClient("service")
  const { data, error } = await supabase
    .from("integration_events")
    .select("*")
    .eq("provider", READYTALK_PROVIDER)
    .eq("event_type", READYTALK_PILOT_STARTED_EVENT)
    .eq("event_id", eventId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

async function markEventFailed(eventRecordId: string, payload: Json, errorMessage: string) {
  const supabase = createClient("service")
  const { error } = await supabase
    .from("integration_events")
    .update({
      payload,
      status: "failed",
      error_message: errorMessage,
      failed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventRecordId)

  if (error) throw new Error(error.message)
}

async function markEventProcessed(eventRecordId: string, payload: Json, merchantLeadId: string) {
  const supabase = createClient("service")
  const now = new Date().toISOString()
  const { error } = await supabase
    .from("integration_events")
    .update({
      payload,
      status: "processed",
      error_message: null,
      failed_at: null,
      processed_at: now,
      linked_merchant_lead_id: merchantLeadId,
      updated_at: now,
    })
    .eq("id", eventRecordId)

  if (error) throw new Error(error.message)
}

async function ensureEventRecord(payload: {
  eventId: string
  merchantExternalId: string
  body: Json
}) {
  const existing = await getExistingEventRecord(payload.eventId)
  if (existing) return existing

  const supabase = createClient("service")
  const now = new Date().toISOString()
  const row: TablesInsert<"integration_events"> = {
    provider: READYTALK_PROVIDER,
    event_type: READYTALK_PILOT_STARTED_EVENT,
    event_id: payload.eventId,
    merchant_external_id: payload.merchantExternalId,
    payload: payload.body,
    status: "received",
    error_message: null,
    linked_merchant_lead_id: null,
    processed_at: null,
    failed_at: null,
    updated_at: now,
  }

  const { data, error } = await supabase
    .from("integration_events")
    .insert(row)
    .select("*")
    .single()

  if (!error) return data
  if (isUniqueViolation(error)) {
    const duplicate = await getExistingEventRecord(payload.eventId)
    if (duplicate) return duplicate
  }

  throw new Error(error.message)
}

export async function POST(req: NextRequest) {
  const requestId = createRequestTraceId()
  const authResult = authenticateReadyTalkRequest(req)
  if (!authResult.ok) {
    return tracedJson(
      requestId,
      { code: authResult.code, error: authResult.error },
      { status: authResult.status }
    )
  }

  const systemUserIdResult = getReadyTalkSystemUserId()
  if (!systemUserIdResult.ok) {
    return tracedJson(
      requestId,
      { code: systemUserIdResult.code, error: systemUserIdResult.error },
      { status: systemUserIdResult.status }
    )
  }

  const body = await req.json().catch(() => null)
  const validated = validateReadyTalkPilotStartedInput(body)
  if (!validated.ok) {
    return tracedJson(
      requestId,
      { code: "invalidInput", error: "Invalid pilot-started payload.", field: validated.field },
      { status: 400 }
    )
  }

  const payload = validated.value
  const pilotStartedDate = normalizePilotStartedDate(payload.pilotStartedAt)
  const eventPayload = body as Json
  let eventRecord: Tables<"integration_events"> | null = null

  try {
    eventRecord = await ensureEventRecord({
      eventId: payload.eventId,
      merchantExternalId: payload.merchantExternalId,
      body: eventPayload,
    })

    if (eventRecord.status === "processed" && eventRecord.linked_merchant_lead_id) {
      return tracedJson(
        requestId,
        {
          data: {
            accepted: true,
            duplicate: true,
            leadId: eventRecord.linked_merchant_lead_id,
            eventId: payload.eventId,
            merchantExternalId: payload.merchantExternalId,
          },
        },
        { status: 200 }
      )
    }

    const partner = await findActivePartnerByReferralCode(payload.referralCode)
    if (!partner) {
      await markEventFailed(eventRecord.id, eventPayload, "Referral code is invalid or inactive.")
      return tracedJson(
        requestId,
        { code: "invalidReferralCode", error: "Referral code is invalid or inactive." },
        { status: 422 }
      )
    }

    const supabase = createClient("service")
    const { data: matchingLeads, error: matchingLeadsError } = await supabase
      .from("merchant_leads")
      .select("id, referral_code, partner_profile_id, pilot_started_at")
      .eq("store_name", payload.storeName)
      .eq("contact_phone", payload.contactPhone)
      .order("created_at", { ascending: false })
      .limit(5)

    if (matchingLeadsError) {
      throw new Error(matchingLeadsError.message)
    }

    const exactMatch = (matchingLeads ?? []).find(
      (lead) =>
        lead.referral_code === partner.referralCode &&
        lead.partner_profile_id === partner.partnerProfileId &&
        lead.pilot_started_at === pilotStartedDate
    )

    if (exactMatch) {
      await markEventProcessed(eventRecord.id, eventPayload, exactMatch.id)
      return tracedJson(
        requestId,
        {
          data: {
            accepted: true,
            duplicate: true,
            leadId: exactMatch.id,
            eventId: payload.eventId,
            merchantExternalId: payload.merchantExternalId,
          },
        },
        { status: 200 }
      )
    }

    const conflictingLead = (matchingLeads ?? [])[0]
    if (conflictingLead) {
      await markEventFailed(
        eventRecord.id,
        eventPayload,
        "A lead with the same store and contact already exists."
      )
      return tracedJson(
        requestId,
        {
          code: "duplicateConflict",
          error: "A lead with the same store and contact already exists.",
          existingLeadId: conflictingLead.id,
        },
        { status: 409 }
      )
    }

    const { data: createdLead, error: insertError } = await supabase
      .from("merchant_leads")
      .insert({
        store_name: payload.storeName,
        contact_phone: payload.contactPhone,
        region: payload.region,
        referral_code: partner.referralCode,
        partner_profile_id: partner.partnerProfileId,
        pilot_started_at: pilotStartedDate,
        created_by: systemUserIdResult.value,
        updated_by: systemUserIdResult.value,
        status: "pilot_started",
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(insertError.message)
    }

    await logAdminAction({
      adminUserId: systemUserIdResult.value,
      actionType: "readytalk_pilot_started_webhook",
      targetType: "merchant_lead",
      targetId: createdLead.id,
      afterData: {
        eventId: payload.eventId,
        merchantExternalId: payload.merchantExternalId,
        referralCode: partner.referralCode,
        requestId,
      },
      requestId,
    })

    await markEventProcessed(eventRecord.id, eventPayload, createdLead.id)

    return tracedJson(
      requestId,
      {
        data: {
          accepted: true,
          duplicate: false,
          leadId: createdLead.id,
          partnerId: partner.partnerProfileId,
          eventId: payload.eventId,
          merchantExternalId: payload.merchantExternalId,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (eventRecord?.id) {
      try {
        await markEventFailed(
          eventRecord.id,
          eventPayload,
          error instanceof Error ? error.message : "Unknown webhook processing error."
        )
      } catch (eventUpdateError) {
        logTraceError(requestId, "readytalk.pilot-started.event-update", eventUpdateError, {
          eventId: payload.eventId,
        })
      }
    }
    logTraceError(requestId, "readytalk.pilot-started", error, {
      eventId: payload.eventId,
      merchantExternalId: payload.merchantExternalId,
    })
    return tracedJson(
      requestId,
      { code: "unknown", error: "Failed to process pilot-started webhook." },
      { status: 500 }
    )
  }
}
