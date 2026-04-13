import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"

export async function PATCH(
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

  const { data: settlement, error: fetchErr } = await supabase
    .from("settlements")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !settlement) {
    return NextResponse.json({ error: "Settlement not found" }, { status: 404 })
  }

  if (settlement.status === "paid") {
    return NextResponse.json({ error: "Settlement already paid" }, { status: 400 })
  }

  const now = new Date().toISOString()

  const { data: updated, error: updateErr } = await supabase
    .from("settlements")
    .update({
      status: "paid",
      paid_at: now,
      processed_by: session.user.id,
      updated_at: now,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Update all related merchant_leads to paid
  const { data: items } = await supabase
    .from("settlement_items")
    .select("merchant_lead_id")
    .eq("settlement_id", id)

  if (items && items.length > 0) {
    await supabase
      .from("merchant_leads")
      .update({ status: "paid", updated_at: now, updated_by: session.user.id })
      .in("id", items.map((i) => i.merchant_lead_id))
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "mark_settlement_paid",
    targetType: "settlement",
    targetId: id,
    beforeData: { status: settlement.status },
    afterData: { status: "paid", paid_at: now },
  })

  return NextResponse.json(updated, { status: 200 })
}
