import { requireAdmin } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { Card, CardContent } from "@/components/ui/card"
import { LeadStatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ status?: string; code?: string; page?: string }>
}

export default async function PerformancePage({ searchParams }: Props) {
  await requireAdmin()
  const { status, code, page } = await searchParams
  const supabase = createClient("service")

  const pageNum = Math.max(1, parseInt(page ?? "1"))
  const pageSize = 30
  const from = (pageNum - 1) * pageSize

  let query = supabase
    .from("merchant_leads")
    .select("*, partner_profiles(referral_code, users(name))", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1)

  if (status) query = query.eq("status", status as "pilot_started" | "settlement_ready" | "paid")
  if (code) query = query.eq("referral_code", code.toUpperCase())

  const { data: leads, count } = await query
  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#191917]">실적 관리</h1>
        <Button asChild>
          <Link href="/admin/performance/new">+ 새 실적 입력</Link>
        </Button>
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="code"
          defaultValue={code}
          placeholder="추천인 코드"
          className="h-9 px-3 rounded-[8px] border border-[#E9E7E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8A867D]/40"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 px-3 rounded-[8px] border border-[#E9E7E1] text-sm bg-white focus:outline-none"
        >
          <option value="">전체 상태</option>
          <option value="pilot_started">파일럿 시작</option>
          <option value="settlement_ready">정산 예정</option>
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
                  {["상호명", "연락처", "지역", "추천인 코드", "파트너", "파일럿 시작일", "상태", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E1]">
                {leads?.map((lead) => {
                  const profile = Array.isArray(lead.partner_profiles) ? lead.partner_profiles[0] : lead.partner_profiles
                  const user = profile && (Array.isArray((profile as { users?: unknown }).users) ? (profile as { users: { name?: string }[] }).users[0] : (profile as { users?: { name?: string } }).users)
                  return (
                    <tr key={lead.id} className="hover:bg-[#F7F7F5]">
                      <td className="px-4 py-3 font-medium text-[#191917]">{lead.store_name}</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{lead.contact_phone}</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{lead.region}</td>
                      <td className="px-4 py-3 font-mono text-[#191917]">{lead.referral_code}</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{(user as { name?: string } | null | undefined)?.name ?? "-"}</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{lead.pilot_started_at}</td>
                      <td className="px-4 py-3"><LeadStatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/performance?edit=${lead.id}`}>수정</Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-[#E9E7E1]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/performance?page=${p}${status ? `&status=${status}` : ""}${code ? `&code=${code}` : ""}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-sm ${
                    p === pageNum ? "bg-[#191917] text-white" : "border border-[#E9E7E1] hover:bg-[#F7F7F5]"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
