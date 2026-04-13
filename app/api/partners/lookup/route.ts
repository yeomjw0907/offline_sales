import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const code = req.nextUrl.searchParams.get("code")
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 })

  const supabase = createClient("service")
  const { data } = await supabase
    .from("partner_profiles")
    .select("id, users(name)")
    .eq("referral_code", code.toUpperCase())
    .eq("status", "active")
    .maybeSingle()

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const user = Array.isArray(data.users) ? data.users[0] : data.users
  return NextResponse.json({ id: data.id, name: (user as { name?: string } | null)?.name ?? null })
}
