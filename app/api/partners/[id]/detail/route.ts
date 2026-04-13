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

  const { data, error } = await supabase
    .from("partner_profiles")
    .select(`
      *,
      users(name, email, phone),
      merchant_leads(id, store_name, region, pilot_started_at, status),
      settlements(id, settlement_month, total_cases, net_amount, status)
    `)
    .eq("id", id)
    .single()

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(data)
}
