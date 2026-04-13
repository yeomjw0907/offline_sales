import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, phone, email, activity_region, acquisition_channel, activity_type, intro } = body

  if (!name || !phone || !email || !activity_region || !acquisition_channel || !activity_type) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 })
  }

  const supabase = createClient("service")

  // Update user info
  await supabase
    .from("users")
    .update({ name, phone, email, updated_at: new Date().toISOString() })
    .eq("id", session.user.id)

  // Check if profile already exists
  const { data: existing } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "이미 신청 내역이 있습니다." }, { status: 409 })
  }

  const { data, error } = await supabase
    .from("partner_profiles")
    .insert({
      user_id: session.user.id,
      status: "pending",
      activity_region,
      acquisition_channel,
      activity_type,
      intro: intro || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
