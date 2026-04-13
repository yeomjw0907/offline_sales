import { requireAdmin } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartnerStatusBadge } from "@/components/shared/StatusBadge"
import { formatKRW } from "@/lib/settlements/calculate"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const supabase = createClient("service")

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const [
    { count: totalPartners },
    { count: pendingPartners },
    { count: monthLeads },
    { data: scheduledSettlements },
    { data: pendingList },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("partner_profiles").select("*", { count: "exact", head: true }),
    supabase.from("partner_profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("merchant_leads").select("*", { count: "exact", head: true }).gte("pilot_started_at", `${month}-01`),
    supabase.from("settlements").select("net_amount").eq("status", "scheduled"),
    supabase
      .from("partner_profiles")
      .select("id, status, activity_region, created_at, users(name, email)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("merchant_leads")
      .select("id, store_name, referral_code, pilot_started_at, region")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const scheduledTotal = scheduledSettlements?.reduce((s, r) => s + r.net_amount, 0) ?? 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#191917]">대시보드</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "전체 파트너", value: totalPartners ?? 0, unit: "명" },
          { label: "승인 대기", value: pendingPartners ?? 0, unit: "명" },
          { label: "이번 달 실적", value: monthLeads ?? 0, unit: "건" },
          { label: "정산 예정액", value: formatKRW(scheduledTotal), unit: "" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-[#5F5B53]">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#191917]">
                {stat.value}{stat.unit && <span className="text-base font-normal text-[#8A867D] ml-1">{stat.unit}</span>}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>승인 대기 파트너</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/partners?status=pending">전체 보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingList?.length === 0 ? (
              <p className="text-sm text-[#8A867D]">대기 중인 파트너가 없습니다.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#E9E7E1]">
                  {pendingList?.map((p) => {
                    const user = Array.isArray(p.users) ? p.users[0] : p.users
                    return (
                      <tr key={p.id} className="hover:bg-[#F7F7F5]">
                        <td className="py-2.5">
                          <p className="font-medium text-[#191917]">{(user as { name?: string })?.name ?? "-"}</p>
                          <p className="text-[#8A867D] text-xs">{(user as { email?: string })?.email ?? "-"}</p>
                        </td>
                        <td className="py-2.5 text-right">
                          <PartnerStatusBadge status={p.status} />
                        </td>
                        <td className="py-2.5 pl-3 text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/partners/${p.id}`}>검토</Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 실적</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/performance">전체 보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLeads?.length === 0 ? (
              <p className="text-sm text-[#8A867D]">최근 실적이 없습니다.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#E9E7E1]">
                  {recentLeads?.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F7F7F5]">
                      <td className="py-2.5">
                        <p className="font-medium text-[#191917]">{lead.store_name}</p>
                        <p className="text-[#8A867D] text-xs">{lead.region}</p>
                      </td>
                      <td className="py-2.5 text-right font-mono text-xs text-[#5F5B53]">
                        {lead.referral_code}
                      </td>
                      <td className="py-2.5 pl-3 text-right text-[#8A867D] text-xs">
                        {lead.pilot_started_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
