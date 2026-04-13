import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import { calculateSettlement } from "@/lib/settlements/calculate"
import { logAdminAction } from "@/lib/db/log"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const contentType = req.headers.get("content-type") ?? ""
  let month = ""
  let partnerProfileId: string | undefined

  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { month?: string; partnerProfileId?: string }
    month = String(body.month ?? "")
    partnerProfileId = body.partnerProfileId
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text()
    const params = new URLSearchParams(text)
    month = String(params.get("month") ?? "")
    const pid = params.get("partnerProfileId")
    partnerProfileId = pid ?? undefined
  } else {
    const form = await req.formData()
    month = String(form.get("month") ?? "")
    const pid = form.get("partnerProfileId")
    partnerProfileId = pid ? String(pid) : undefined
  }

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Invalid month format. Use YYYY-MM" }, { status: 400 })
  }

  const supabase = createClient("service")
  const monthStart = `${month}-01`
  const [year, mon] = month.split("-").map(Number)
  const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, "0")}-01`

  // Find active partners with unprocessed leads in the given month
  let partnersQuery = supabase
    .from("partner_profiles")
    .select("id")
    .eq("status", "active")

  if (partnerProfileId) {
    partnersQuery = partnersQuery.eq("id", partnerProfileId)
  }

  const { data: partners, error: partnersErr } = await partnersQuery
  if (partnersErr) {
    return NextResponse.json({ error: partnersErr.message }, { status: 500 })
  }

  let created = 0

  for (const partner of partners ?? []) {
    // Skip if settlement already exists for this partner + month
    const { data: existingSettlement } = await supabase
      .from("settlements")
      .select("id")
      .eq("partner_profile_id", partner.id)
      .eq("settlement_month", month)
      .maybeSingle()

    if (existingSettlement) continue

    // Find pilot_started leads for this partner in this month
    const { data: leads, error: leadsErr } = await supabase
      .from("merchant_leads")
      .select("id")
      .eq("partner_profile_id", partner.id)
      .eq("status", "pilot_started")
      .gte("pilot_started_at", monthStart)
      .lt("pilot_started_at", nextMonth)

    if (leadsErr || !leads || leads.length === 0) continue

    const calc = calculateSettlement(leads.length)

    const { data: settlement, error: settlementErr } = await supabase
      .from("settlements")
      .insert({
        partner_profile_id: partner.id,
        settlement_month: month,
        total_cases: calc.totalCases,
        gross_amount: calc.grossAmount,
        withholding_tax_amount: calc.withholdingTaxAmount,
        net_amount: calc.netAmount,
        status: "scheduled",
      })
      .select()
      .single()

    if (settlementErr || !settlement) continue

    // Insert settlement items
    const items = leads.map((lead) => ({
      settlement_id: settlement.id,
      merchant_lead_id: lead.id,
      case_amount: 20000,
    }))

    await supabase.from("settlement_items").insert(items)

    // Update merchant_leads status to settlement_ready
    await supabase
      .from("merchant_leads")
      .update({ status: "settlement_ready", updated_at: new Date().toISOString(), updated_by: session.user.id })
      .in("id", leads.map((l) => l.id))

    await logAdminAction({
      adminUserId: session.user.id,
      actionType: "generate_settlement",
      targetType: "settlement",
      targetId: settlement.id,
      afterData: { partner_profile_id: partner.id, month, total_cases: calc.totalCases },
    })

    created++
  }

  return NextResponse.json({ created }, { status: 200 })
}
