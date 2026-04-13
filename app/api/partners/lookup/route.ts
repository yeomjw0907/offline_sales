import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const code = req.nextUrl.searchParams.get("code")
  const list = req.nextUrl.searchParams.get("list")

  const supabase = createClient("service")
  if (list === "1") {
    const { data: partners } = await supabase
      .from("partner_profiles")
      .select("id, user_id, referral_code")
      .eq("status", "active")
      .not("referral_code", "is", null)
      .order("created_at", { ascending: false })
      .limit(200)

    const userIds = Array.from(new Set((partners ?? []).map((p) => p.user_id).filter(Boolean)))
    const { data: users } = userIds.length
      ? await supabase.from("users").select("id, name, email").in("id", userIds)
      : { data: [] as Array<{ id: string; name: string | null; email: string | null }> }
    const userMap = new Map((users ?? []).map((u) => [u.id, u]))

    const items = (partners ?? [])
      .filter((p) => p.referral_code)
      .map((p) => {
        const user = userMap.get(p.user_id)
        return {
          id: p.id,
          referral_code: p.referral_code,
          name: user?.name ?? null,
          email: user?.email ?? null,
        }
      })

    return NextResponse.json({ data: items })
  }

  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 })

  const { data } = await supabase
    .from("partner_profiles")
    .select("id, user_id, referral_code")
    .eq("referral_code", code.toUpperCase())
    .eq("status", "active")
    .maybeSingle()

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data: user } = await supabase
    .from("users")
    .select("name")
    .eq("id", data.user_id)
    .maybeSingle()

  return NextResponse.json({ id: data.id, name: user?.name ?? null })
}
