import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { bank_name, account_holder_name } = body
  const account_number = String(body.account_number ?? "").replace(/\D/g, "")

  if (!bank_name || !account_number || !account_holder_name) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 })
  }

  const supabase = createClient("service")

  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  if (!profile) return NextResponse.json({ error: "파트너 프로필이 없습니다." }, { status: 404 })

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
