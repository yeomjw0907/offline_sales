import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { generateUniqueReferralCode } from "@/lib/referral-code"
import { logAdminAction } from "@/lib/db/log"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const supabase = createClient("service")

  const { data: partner, error: fetchErr } = await supabase
    .from("partner_profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !partner) {
    return NextResponse.json({ error: "Partner not found" }, { status: 404 })
  }

  const newCode = await generateUniqueReferralCode()
  const oldCode = partner.referral_code

  const { data: updated, error: updateErr } = await supabase
    .from("partner_profiles")
    .update({
      referral_code: newCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "regenerate_referral_code",
    targetType: "partner_profile",
    targetId: id,
    beforeData: { referral_code: oldCode },
    afterData: { referral_code: newCode },
  })

  return NextResponse.json(updated, { status: 200 })
}
