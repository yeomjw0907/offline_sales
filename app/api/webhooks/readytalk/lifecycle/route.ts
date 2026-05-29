import { NextRequest } from "next/server"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"
import { createRequestTraceId, logTraceError, tracedJson } from "@/lib/db/request-trace"
import {
  authenticateReadyTalkRequest,
  findActivePartnerByReferralCode,
  getReadyTalkSystemUserId,
  READYTALK_PROVIDER,
} from "@/lib/integrations/readytalk"
import type { Database, Json, Tables, TablesInsert } from "@/lib/db/types"

type LeadUpdate = Database["public"]["Tables"]["merchant_leads"]["Update"]
import {
  validateReadyTalkLifecycleInput,
  type ReadyTalkLifecycleEventType,
} from "@/lib/validation/readytalk"

function isUniqueViolation(error: unknown) {
  if (!error || typeof error !== "object") return false
  const maybeCode = "code" in error ? error.code : null
  return maybeCode === "23505"
}

async function getExistingEventRecord(eventType: string, eventId: string) {
  const supabase = createClient("service")
  const { data, error } = await supabase
    .from("integration_events")
    .select("*")
    .eq("provider", READYTALK_PROVIDER)
    .eq("event_type", eventType)
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

async function markEventProcessed(
  eventRecordId: string,
  payload: Json,
  merchantLeadId: string
) {
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

async function ensureEventRecord(input: {
  eventType: string
  eventId: string
  merchantExternalId: string
  body: Json
}) {
  const existing = await getExistingEventRecord(input.eventType, input.eventId)
  if (existing) return existing

  const supabase = createClient("service")
  const now = new Date().toISOString()
  const row: TablesInsert<"integration_events"> = {
    provider: READYTALK_PROVIDER,
    event_type: input.eventType,
    event_id: input.eventId,
    merchant_external_id: input.merchantExternalId,
    payload: input.body,
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
    const duplicate = await getExistingEventRecord(input.eventType, input.eventId)
    if (duplicate) return duplicate
  }
  throw new Error(error.message)
}

function lifecycleColumnFor(
  eventType: ReadyTalkLifecycleEventType
): "signup_at" | "trial_requested_at" | "channel_linked_at" | "activated_at" {
  switch (eventType) {
    case "signup_completed":
      return "signup_at"
    case "trial_requested":
      return "trial_requested_at"
    case "channel_linked":
      return "channel_linked_at"
    case "activated":
      return "activated_at"
  }
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
  const validated = validateReadyTalkLifecycleInput(body)
  if (!validated.ok) {
    return tracedJson(
      requestId,
      { code: "invalidInput", error: "Invalid lifecycle payload.", field: validated.field },
      { status: 400 }
    )
  }

  const payload = validated.value
  const eventPayload = body as Json
  let eventRecord: Tables<"integration_events"> | null = null

  try {
    eventRecord = await ensureEventRecord({
      eventType: payload.eventType,
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
            eventType: payload.eventType,
            leadId: eventRecord.linked_merchant_lead_id,
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
    const lifecycleColumn = lifecycleColumnFor(payload.eventType)

    // Find existing lead by merchant_external_id
    const { data: existingLead } = await supabase
      .from("merchant_leads")
      .select("*")
      .eq("merchant_external_id", payload.merchantExternalId)
      .maybeSingle()

    let leadId: string

    if (existingLead) {
      const updates: LeadUpdate = {
        [lifecycleColumn]: payload.occurredAt,
        updated_at: new Date().toISOString(),
        updated_by: systemUserIdResult.value,
      }

      // Backfill store_name / region if they arrived empty on signup_completed
      // but are now provided by a later lifecycle event.
      if (payload.storeName && !existingLead.store_name) {
        updates.store_name = payload.storeName
      }
      if (payload.region && !existingLead.region) {
        updates.region = payload.region
      }

      // channel_linked event also fills pilot_started_at (settlement anchor)
      // and appends to linked_channels array.
      if (payload.eventType === "channel_linked") {
        if (!existingLead.pilot_started_at) {
          updates.pilot_started_at = payload.occurredAt.slice(0, 10)
        }
        if (payload.channel && !existingLead.linked_channels.includes(payload.channel)) {
          updates.linked_channels = [...existingLead.linked_channels, payload.channel]
        }
      }

      const { error: updateErr } = await supabase
        .from("merchant_leads")
        .update(updates)
        .eq("id", existingLead.id)
      if (updateErr) throw new Error(updateErr.message)

      leadId = existingLead.id
    } else {
      const insertRow: TablesInsert<"merchant_leads"> = {
        store_name: payload.storeName ?? null,
        contact_phone: payload.contactPhone,
        region: payload.region ?? null,
        referral_code: partner.referralCode,
        partner_profile_id: partner.partnerProfileId,
        merchant_external_id: payload.merchantExternalId,
        // pilot_started_at is the settlement anchor; populate it only when
        // we know the channel-link moment. Earlier events leave it null and
        // settlement skips the row until it arrives.
        pilot_started_at:
          payload.eventType === "channel_linked"
            ? payload.occurredAt.slice(0, 10)
            : null,
        [lifecycleColumn]: payload.occurredAt,
        linked_channels:
          payload.eventType === "channel_linked" && payload.channel
            ? [payload.channel]
            : [],
        created_by: systemUserIdResult.value,
        updated_by: systemUserIdResult.value,
        // Lead stays pending_verification until admin approval, regardless of
        // which lifecycle event created it.
        status: "pending_verification",
      }

      const { data: created, error: insertErr } = await supabase
        .from("merchant_leads")
        .insert(insertRow)
        .select()
        .single()
      if (insertErr || !created) throw new Error(insertErr?.message ?? "insert failed")
      leadId = created.id
    }

    await logAdminAction({
      adminUserId: systemUserIdResult.value,
      actionType: `readytalk_${payload.eventType}_webhook`,
      targetType: "merchant_lead",
      targetId: leadId,
      afterData: {
        eventId: payload.eventId,
        merchantExternalId: payload.merchantExternalId,
        referralCode: partner.referralCode,
        channel: payload.channel ?? null,
        requestId,
      },
      requestId,
    })

    await markEventProcessed(eventRecord.id, eventPayload, leadId)

    return tracedJson(
      requestId,
      {
        data: {
          accepted: true,
          duplicate: false,
          eventType: payload.eventType,
          leadId,
          partnerId: partner.partnerProfileId,
          merchantExternalId: payload.merchantExternalId,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    if (eventRecord?.id) {
      try {
        await markEventFailed(
          eventRecord.id,
          eventPayload,
          error instanceof Error ? error.message : "Unknown lifecycle processing error."
        )
      } catch (eventUpdateError) {
        logTraceError(requestId, "readytalk.lifecycle.event-update", eventUpdateError, {
          eventId: payload.eventId,
        })
      }
    }
    logTraceError(requestId, "readytalk.lifecycle", error, {
      eventId: payload.eventId,
      eventType: payload.eventType,
      merchantExternalId: payload.merchantExternalId,
    })
    return tracedJson(
      requestId,
      { code: "unknown", error: "Failed to process lifecycle event." },
      { status: 500 }
    )
  }
}
