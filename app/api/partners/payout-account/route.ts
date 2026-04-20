import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { createRequestTraceId, logTraceError, tracedJson } from "@/lib/db/request-trace"
import { validatePayoutAccountInput } from "@/lib/validation/partner"
import { ERROR_MESSAGES } from "@/lib/ui/error-messages"

export async function POST(req: NextRequest) {
  const requestId = createRequestTraceId()
  const session = await auth()
  if (!session) return tracedJson(requestId, { code: "unauthorized", error: ERROR_MESSAGES.unauthorized }, { status: 401 })

  const body = await req.json().catch(() => null)
  const validated = validatePayoutAccountInput(body)
  if (!validated.ok) {
    return tracedJson(
      requestId,
      { code: "invalidInput", error: ERROR_MESSAGES.invalidInput, field: validated.field },
      { status: 400 }
    )
  }
  const { bank_name, account_holder_name, account_number } = validated.value

  const supabase = createClient("service")

  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  if (!profile) return tracedJson(requestId, { code: "notFound", error: "파트너 프로필이 없습니다." }, { status: 404 })

  // Deactivate existing account
  await supabase
    .from("partner_payout_accounts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("partner_profile_id", profile.id)
    .eq("is_active", true)

  // Simple base64 encoding (production: use proper encryption)
  const encrypted = Buffer.from(account_number).toString("base64")

  const { data, error } = await supabase
    .from("partner_payout_accounts")
    .insert({
      partner_profile_id: profile.id,
      bank_name,
      account_number_encrypted: encrypted,
      account_holder_name,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    logTraceError(requestId, "partners.payout-account", error)
    return tracedJson(requestId, { code: "saveFailed", error: error.message }, { status: 500 })
  }

  return tracedJson(requestId, { data }, { status: 201 })
}
