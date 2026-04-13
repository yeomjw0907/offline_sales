import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { activity_region, activity_type, intro } = body

  const supabase = createClient("service")

  const { data, error } = await supabase
    .from("partner_profiles")
    .update({ activity_region, activity_type, intro, updated_at: new Date().toISOString() })
    .eq("user_id", session.user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
