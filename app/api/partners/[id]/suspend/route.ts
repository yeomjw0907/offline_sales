import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"

const ALLOWED_DAYS = new Set([1, 3, 7, 30])

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { days } = await req.json().catch(() => ({ days: 0 }))
  const suspendDays = Number(days)
  if (!ALLOWED_DAYS.has(suspendDays)) {
    return NextResponse.json({ error: "Invalid suspend period" }, { status: 400 })
  }

  const now = new Date()
  const suspendedUntil = new Date(now.getTime() + suspendDays * 24 * 60 * 60 * 1000).toISOString()

  const supabase = createClient("service")
  const { data: partner, error: fetchErr } = await supabase
    .from("partner_profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !partner) {
    return NextResponse.json({ error: "Partner not found" }, { status: 404 })
  }

  const { data: updated, error: updateErr } = await supabase
    .from("partner_profiles")
    .update({
      status: "inactive",
      deactivated_at: suspendedUntil,
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
    actionType: "suspend_partner",
    targetType: "partner_profile",
    targetId: id,
    beforeData: { status: partner.status, deactivated_at: partner.deactivated_at },
    afterData: { status: "inactive", deactivated_at: suspendedUntil, days: suspendDays },
  })

  return NextResponse.json(updated, { status: 200 })
}
