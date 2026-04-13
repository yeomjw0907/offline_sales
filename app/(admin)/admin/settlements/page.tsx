import { requireAdmin } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { Card, CardContent } from "@/components/ui/card"
import { SettlementStatusBadge } from "@/components/shared/StatusBadge"
import { formatKRW, getCurrentSettlementMonth } from "@/lib/settlements/calculate"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ month?: string; status?: string }>
}

export default async function SettlementsPage({ searchParams }: Props) {
  await requireAdmin()
  const { month, status } = await searchParams
  const supabase = createClient("service")

  let query = supabase
    .from("settlements")
    .select("*, partner_profiles(referral_code, users(name))")
    .order("settlement_month", { ascending: false })
    .order("created_at", { ascending: false })

  if (month) query = query.eq("settlement_month", month)
  if (status) query = query.eq("status", status as "scheduled" | "paid")

  const { data: settlements } = await query
  const currentMonth = getCurrentSettlementMonth()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[#191917]">정산 관리</h1>
        <form action="/api/settlements/generate" method="POST" className="flex gap-2">
          <input type="hidden" name="month" value={currentMonth} />
          <Button type="submit" variant="outline">
            {currentMonth} 정산 생성
          </Button>
        </form>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="month"
          defaultValue={month}
          placeholder="월 (예: 2026-04)"
          className="h-9 px-3 rounded-[8px] border border-[#E9E7E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8A867D]/40"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 px-3 rounded-[8px] border border-[#E9E7E1] text-sm bg-white"
        >
          <option value="">전체</option>
          <option value="scheduled">정산 예정</option>
          <option value="paid">지급 완료</option>
        </select>
        <Button type="submit" size="sm" variant="outline">검색</Button>
      </form>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                  {["파트너", "정산 월", "건수", "총액(세전)", "실지급액", "상태", "지급일", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E1]">
                {settlements?.map((s) => {
                  const profile = Array.isArray(s.partner_profiles) ? s.partner_profiles[0] : s.partner_profiles
                  const user = profile && (Array.isArray((profile as { users?: unknown }).users) ? (profile as { users: { name?: string }[] }).users[0] : (profile as { users?: { name?: string } }).users)
                  return (
                    <tr key={s.id} className="hover:bg-[#F7F7F5]">
                      <td className="px-4 py-3 font-medium text-[#191917]">{(user as { name?: string } | null | undefined)?.name ?? "-"}</td>
                      <td className="px-4 py-3 font-mono text-[#191917]">{s.settlement_month}</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{s.total_cases}건</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{formatKRW(s.gross_amount)}</td>
                      <td className="px-4 py-3 font-medium text-[#191917]">{formatKRW(s.net_amount)}</td>
                      <td className="px-4 py-3"><SettlementStatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-[#8A867D]">
                        {s.paid_at ? new Date(s.paid_at).toLocaleDateString("ko-KR") : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/settlements/${s.id}`}>상세</Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
