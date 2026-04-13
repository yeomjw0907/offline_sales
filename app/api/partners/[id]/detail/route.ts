import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const supabase = createClient("service")

  const { data: profile, error } = await supabase
    .from("partner_profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !profile) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const [{ data: user }, { data: leads }, { data: settlements }] = await Promise.all([
    supabase
      .from("users")
      .select("name, email, phone")
      .eq("id", profile.user_id)
      .maybeSingle(),
    supabase
      .from("merchant_leads")
      .select("id, store_name, region, pilot_started_at, status")
      .eq("partner_profile_id", profile.id)
      .order("pilot_started_at", { ascending: false }),
    supabase
      .from("settlements")
      .select("id, settlement_month, total_cases, net_amount, status")
      .eq("partner_profile_id", profile.id)
      .order("settlement_month", { ascending: false }),
  ])

  return NextResponse.json({
    ...profile,
    users: user ?? null,
    merchant_leads: leads ?? [],
    settlements: settlements ?? [],
  })
}
