import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"

export async function DELETE(
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

  const { error: deleteErr } = await supabase
    .from("partner_profiles")
    .delete()
    .eq("id", id)

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "delete_partner_account",
    targetType: "partner_profile",
    targetId: id,
    beforeData: partner as Record<string, unknown>,
    afterData: { deleted: true },
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
