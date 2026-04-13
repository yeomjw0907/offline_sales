import { requireAdmin } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { Card, CardContent } from "@/components/ui/card"
import { PartnerStatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { PartnerStatus } from "@/lib/db/types"

interface Props {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}

export default async function PartnersPage({ searchParams }: Props) {
  await requireAdmin()
  const { q, status, page } = await searchParams
  const supabase = createClient("service")

  const pageNum = Math.max(1, parseInt(page ?? "1"))
  const pageSize = 20
  const from = (pageNum - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("partner_profiles")
    .select("id, status, referral_code, activity_region, approved_at, created_at, users(name, email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (status && status !== "all") {
    query = query.eq("status", status as PartnerStatus)
  }
  if (q) {
    query = query.or(`referral_code.ilike.%${q}%`)
  }

  const { data: partners, count } = await query
  const totalPages = Math.ceil((count ?? 0) / pageSize)

  const statuses: { value: string; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "pending", label: "대기" },
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#191917]">파트너 관리</h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {statuses.map((s) => (
          <Link
            key={s.value}
            href={`/admin/partners?status=${s.value}${q ? `&q=${q}` : ""}`}
            className={`px-3 py-1.5 rounded-[8px] text-sm border transition-colors ${
              (status ?? "all") === s.value
                ? "bg-[#191917] text-white border-[#191917]"
                : "bg-white text-[#5F5B53] border-[#E9E7E1] hover:bg-[#F7F7F5]"
            }`}
          >
            {s.label}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="추천인 코드 검색"
            className="h-9 px-3 rounded-[8px] border border-[#E9E7E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#8A867D]/40"
          />
          {status && <input type="hidden" name="status" value={status} />}
          <Button type="submit" size="sm" variant="outline">검색</Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                  {["이름", "이메일", "추천인 코드", "지역", "상태", "승인일", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E1]">
                {partners?.map((p) => {
                  const user = Array.isArray(p.users) ? p.users[0] : p.users
                  return (
                    <tr key={p.id} className="hover:bg-[#F7F7F5]">
                      <td className="px-4 py-3 font-medium text-[#191917]">
                        {(user as { name?: string })?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-[#5F5B53]">
                        {(user as { email?: string })?.email ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#191917]">
                        {p.referral_code ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-[#5F5B53]">{p.activity_region ?? "-"}</td>
                      <td className="px-4 py-3"><PartnerStatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-[#8A867D]">
                        {p.approved_at ? new Date(p.approved_at).toLocaleDateString("ko-KR") : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/partners/${p.id}`}>상세</Link>
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
                  href={`/admin/partners?page=${p}${status ? `&status=${status}` : ""}${q ? `&q=${q}` : ""}`}
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
