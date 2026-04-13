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
    .from("partner_materials")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 })
  }

  const body = await req.json()
  const typedUpdates: {
    updated_at: string
    title?: string
    url?: string | null
    description?: string | null
    is_published?: boolean
    sort_order?: number
    type?: "link" | "file" | "note"
  } = { updated_at: new Date().toISOString() }

  if ("title" in body) typedUpdates.title = body.title
  if ("url" in body) typedUpdates.url = body.url
  if ("description" in body) typedUpdates.description = body.description
  if ("is_published" in body) typedUpdates.is_published = body.is_published
  if ("sort_order" in body) typedUpdates.sort_order = body.sort_order
  if ("type" in body) typedUpdates.type = body.type

  const { data: updated, error: updateErr } = await supabase
    .from("partner_materials")
    .update(typedUpdates)
    .eq("id", id)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "update_material",
    targetType: "partner_material",
    targetId: id,
    beforeData: existing as Record<string, unknown>,
    afterData: typedUpdates as Record<string, unknown>,
  })

  return NextResponse.json(updated, { status: 200 })
}

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

  const { data: existing, error: fetchErr } = await supabase
    .from("partner_materials")
    .select("id, title")
    .eq("id", id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 })
  }

  const { error: deleteErr } = await supabase
    .from("partner_materials")
    .delete()
    .eq("id", id)

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "delete_material",
    targetType: "partner_material",
    targetId: id,
    beforeData: existing as Record<string, unknown>,
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
