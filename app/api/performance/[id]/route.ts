import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const supabase = createClient("service")

  const { data: existing, error: fetchErr } = await supabase
    .from("merchant_leads")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const typedUpdates: {
    updated_at: string
    updated_by: string
    store_name?: string
    contact_phone?: string
    region?: string
    referral_code?: string
    pilot_started_at?: string
    status?: "pilot_started" | "settlement_ready" | "paid"
  } = { updated_at: new Date().toISOString(), updated_by: session.user.id }

  if ("store_name" in body) typedUpdates.store_name = body.store_name
  if ("contact_phone" in body) typedUpdates.contact_phone = body.contact_phone
  if ("region" in body) typedUpdates.region = body.region
  if ("referral_code" in body) typedUpdates.referral_code = body.referral_code
  if ("pilot_started_at" in body) typedUpdates.pilot_started_at = body.pilot_started_at
  if ("status" in body) typedUpdates.status = body.status

  const { data: updated, error: updateErr } = await supabase
    .from("merchant_leads")
    .update(typedUpdates)
    .eq("id", id)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "update_merchant_lead",
    targetType: "merchant_lead",
    targetId: id,
    beforeData: existing as Record<string, unknown>,
    afterData: typedUpdates as Record<string, unknown>,
  })

  return NextResponse.json(updated, { status: 200 })
}
