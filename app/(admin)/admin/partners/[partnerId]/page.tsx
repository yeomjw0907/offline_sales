"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartnerStatusBadge, LeadStatusBadge, SettlementStatusBadge } from "@/components/shared/StatusBadge"
import { formatKRW } from "@/lib/settlements/calculate"
import { Button } from "@/components/ui/button"

interface PartnerDetail {
  id: string; status: string; referral_code: string | null
  activity_region: string | null; acquisition_channel: string | null
  activity_type: string | null; intro: string | null
  approved_at: string | null; created_at: string
  users: { name: string | null; email: string | null; phone: string | null } | null
  merchant_leads: Array<{ id: string; store_name: string; region: string; pilot_started_at: string; status: string }>
  settlements: Array<{ id: string; settlement_month: string; total_cases: number; net_amount: number; status: string }>
}

export default function PartnerDetailPage() {
  const { partnerId } = useParams<{ partnerId: string }>()
  const [data, setData] = useState<PartnerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const load = () => {
    setLoading(true)
    fetch(`/api/partners/${partnerId}/detail`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [partnerId])

  const handleAction = async (action: "approve" | "deactivate") => {
    setActing(true)
    await fetch(`/api/partners/${partnerId}/${action}`, { method: "POST" })
    load()
    setActing(false)
  }

  if (loading) return <div className="text-sm text-[#8A867D]">불러오는 중...</div>
  if (!data) return <div className="text-sm text-[#C94C4C]">파트너를 찾을 수 없습니다.</div>

  const user = data.users

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[#191917]">{user?.name ?? "파트너"} 상세</h1>
        <div className="flex gap-2">
          {data.status === "pending" && (
            <Button onClick={() => handleAction("approve")} disabled={acting}>승인</Button>
          )}
          {data.status === "active" && (
            <Button onClick={() => handleAction("deactivate")} disabled={acting} variant="danger">비활성 처리</Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>프로필 정보</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              { label: "이름", value: user?.name ?? "-" },
              { label: "이메일", value: user?.email ?? "-" },
              { label: "전화번호", value: user?.phone ?? "-" },
              { label: "상태", value: <PartnerStatusBadge status={data.status as "pending" | "active" | "inactive"} /> },
              { label: "추천인 코드", value: <span className="font-mono">{data.referral_code ?? "-"}</span> },
              { label: "활동 지역", value: data.activity_region ?? "-" },
              { label: "활동 유형", value: data.activity_type ?? "-" },
              { label: "유입 경로", value: data.acquisition_channel ?? "-" },
              { label: "승인일", value: data.approved_at ? new Date(data.approved_at).toLocaleDateString("ko-KR") : "-" },
              { label: "신청일", value: new Date(data.created_at).toLocaleDateString("ko-KR") },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[#8A867D]">{label}</dt>
                <dd className="font-medium text-[#191917] mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
          {data.intro && (
            <div className="mt-4 pt-4 border-t border-[#E9E7E1]">
              <p className="text-xs text-[#8A867D] mb-1">소개</p>
              <p className="text-sm text-[#5F5B53]">{data.intro}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>실적 내역 ({data.merchant_leads.length}건)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                {["상호명", "지역", "파일럿 시작일", "상태"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E1]">
              {data.merchant_leads.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-[#8A867D]">실적이 없습니다.</td></tr>
              ) : data.merchant_leads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#F7F7F5]">
                  <td className="px-4 py-3 text-[#191917]">{lead.store_name}</td>
                  <td className="px-4 py-3 text-[#5F5B53]">{lead.region}</td>
                  <td className="px-4 py-3 text-[#5F5B53]">{lead.pilot_started_at}</td>
                  <td className="px-4 py-3"><LeadStatusBadge status={lead.status as "pilot_started" | "settlement_ready" | "paid"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>정산 내역</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                {["정산 월", "건수", "실지급액", "상태"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E1]">
              {data.settlements.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-[#8A867D]">정산 내역이 없습니다.</td></tr>
              ) : data.settlements.map(s => (
                <tr key={s.id} className="hover:bg-[#F7F7F5]">
                  <td className="px-4 py-3 font-mono text-[#191917]">{s.settlement_month}</td>
                  <td className="px-4 py-3 text-[#5F5B53]">{s.total_cases}건</td>
                  <td className="px-4 py-3 text-[#191917]">{formatKRW(s.net_amount)}</td>
                  <td className="px-4 py-3"><SettlementStatusBadge status={s.status as "scheduled" | "paid"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
