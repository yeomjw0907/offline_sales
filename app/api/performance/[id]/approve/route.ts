import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
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

  const { data: existing, error: fetchErr } = await supabase
    .from("merchant_leads")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (existing.status !== "pending_verification") {
    return NextResponse.json(
      { error: "Lead is not in pending_verification state.", currentStatus: existing.status },
      { status: 409 }
    )
  }

  const { data: updated, error: updateErr } = await supabase
    .from("merchant_leads")
    .update({
      status: "pilot_started",
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "approve_merchant_lead",
    targetType: "merchant_lead",
    targetId: id,
    beforeData: { status: existing.status },
    afterData: { status: "pilot_started" },
  })

  return NextResponse.json(updated, { status: 200 })
}
