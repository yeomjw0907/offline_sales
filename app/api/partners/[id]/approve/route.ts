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
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
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

  if (partner.status !== "pending") {
    return NextResponse.json({ error: "Partner is not pending" }, { status: 400 })
  }

  const referralCode = await generateUniqueReferralCode()

  const { data: updated, error: updateErr } = await supabase
    .from("partner_profiles")
    .update({
      status: "active",
      referral_code: referralCode,
      approved_by: session.user.id,
      approved_at: new Date().toISOString(),
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
    actionType: "approve_partner",
    targetType: "partner_profile",
    targetId: id,
    beforeData: { status: partner.status, referral_code: partner.referral_code },
    afterData: { status: "active", referral_code: referralCode },
  })

  return NextResponse.json(updated, { status: 200 })
}
