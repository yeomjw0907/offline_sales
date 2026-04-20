import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"
import { createRequestTraceId, logTraceError, tracedJson } from "@/lib/db/request-trace"
import { validatePerformanceInput } from "@/lib/validation/performance"
import { ERROR_MESSAGES } from "@/lib/ui/error-messages"

export async function GET(req: NextRequest) {
  const requestId = createRequestTraceId()
  const session = await auth()
  if (!session) return tracedJson(requestId, { code: "unauthorized", error: ERROR_MESSAGES.unauthorized }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return tracedJson(requestId, { code: "forbidden", error: ERROR_MESSAGES.forbidden }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const referralCode = searchParams.get("referral_code")
  const dateFrom = searchParams.get("date_from")
  const dateTo = searchParams.get("date_to")
  const page = parseInt(searchParams.get("page") ?? "1")
  const pageSize = 20

  const supabase = createClient("service")
  let query = supabase
    .from("merchant_leads")
    .select("*, partner_profiles(id, referral_code, user_id, users(name, email))", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (status) query = query.eq("status", status as "pilot_started" | "settlement_ready" | "paid")
  if (referralCode) query = query.eq("referral_code", referralCode)
  if (dateFrom) query = query.gte("pilot_started_at", dateFrom)
  if (dateTo) query = query.lte("pilot_started_at", dateTo)

  const { data, error, count } = await query

  if (error) {
    logTraceError(requestId, "performance.get", error)
    return tracedJson(requestId, { code: "unknown", error: error.message }, { status: 500 })
  }

  return tracedJson(requestId, { data, count, page, pageSize }, { status: 200 })
}

export async function POST(req: NextRequest) {
  const requestId = createRequestTraceId()
  const session = await auth()
  if (!session) return tracedJson(requestId, { code: "unauthorized", error: ERROR_MESSAGES.unauthorized }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return tracedJson(requestId, { code: "forbidden", error: ERROR_MESSAGES.forbidden }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const validated = validatePerformanceInput(body)
  if (!validated.ok) {
    return tracedJson(
      requestId,
      { code: "invalidInput", error: ERROR_MESSAGES.invalidInput, field: validated.field },
      { status: 400 }
    )
  }
  const { store_name, contact_phone, region, referral_code, pilot_started_at } = validated.value

  const supabase = createClient("service")

  // Duplicate check
  const { data: existing } = await supabase
    .from("merchant_leads")
    .select("id, store_name, contact_phone")
    .eq("store_name", store_name)
    .eq("contact_phone", contact_phone)
    .maybeSingle()

  if (existing) {
    return tracedJson(
      requestId,
      { code: "duplicate", error: ERROR_MESSAGES.duplicate, existing },
      { status: 409 }
    )
  }

  // Resolve partner_profile_id from referral_code
  const { data: partnerProfile } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("referral_code", referral_code)
    .maybeSingle()

  const { data: created, error: insertErr } = await supabase
    .from("merchant_leads")
    .insert({
      store_name,
      contact_phone,
      region,
      referral_code,
      pilot_started_at,
      partner_profile_id: partnerProfile?.id ?? null,
      created_by: session.user.id,
      status: "pilot_started",
    })
    .select()
    .single()

  if (insertErr) {
    logTraceError(requestId, "performance.create", insertErr)
    return tracedJson(requestId, { code: "saveFailed", error: insertErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "create_merchant_lead",
    targetType: "merchant_lead",
    targetId: created.id,
    afterData: { store_name, contact_phone, region, referral_code, pilot_started_at, requestId },
  })

  return tracedJson(requestId, { data: created }, { status: 201 })
}
