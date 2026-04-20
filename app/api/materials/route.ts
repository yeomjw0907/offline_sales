import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { logAdminAction } from "@/lib/db/log"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const supabase = createClient("service")
  const { data, error } = await supabase
    .from("partner_materials")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { title, type, url, description, sort_order, is_published } = body

  if (!title || !type) {
    return NextResponse.json({ error: "title and type are required" }, { status: 400 })
  }

  const supabase = createClient("service")
  const { data, error } = await supabase
    .from("partner_materials")
    .insert({
      title,
      type,
      url: url ?? null,
      description: description ?? null,
      sort_order: sort_order ?? 0,
      is_published: is_published ?? false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAdminAction({
    adminUserId: session.user.id,
    actionType: "create_material",
    targetType: "partner_material",
    targetId: data.id,
    afterData: { title, type },
  })

  return NextResponse.json(data, { status: 201 })
}
