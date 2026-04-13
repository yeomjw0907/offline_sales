import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { userId, role } = body as { userId: string; role: string }

  if (!userId || !role) {
    return NextResponse.json({ error: "userId and role are required" }, { status: 400 })
  }

  // Only allow promoting to admin, not super_admin
  if (role !== "admin") {
    return NextResponse.json({ error: "Can only assign 'admin' role via this endpoint" }, { status: 400 })
  }

  const supabase = createClient("service")

  const { data: existing, error: fetchErr } = await supabase
    .from("users")
    .select("id, role, name, email")
    .eq("id", userId)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { data: updated, error: updateErr } = await supabase
    .from("users")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "change_user_role",
    targetType: "user",
    targetId: userId,
    beforeData: { role: existing.role },
    afterData: { role },
  })

  return NextResponse.json(updated, { status: 200 })
}
