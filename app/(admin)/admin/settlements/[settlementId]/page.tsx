"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettlementStatusBadge } from "@/components/shared/StatusBadge"
import { formatKRW } from "@/lib/settlements/calculate"
import { Button } from "@/components/ui/button"

interface SettlementDetail {
  id: string
  settlement_month: string
  total_cases: number
  gross_amount: number
  withholding_tax_amount: number
  net_amount: number
  status: "scheduled" | "paid"
  paid_at: string | null
  partner_profiles: { referral_code: string | null; users: { name: string | null } | null } | null
  settlement_items: Array<{ id: string; case_amount: number; merchant_leads: { store_name: string; pilot_started_at: string } | null }>
}

export default function SettlementDetailPage() {
  const { settlementId } = useParams<{ settlementId: string }>()
  const router = useRouter()
  const [data, setData] = useState<SettlementDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetch(`/api/settlements/${settlementId}/detail`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [settlementId])

  const handlePay = async () => {
    setPaying(true)
    await fetch(`/api/settlements/${settlementId}`, { method: "PATCH" })
    router.refresh()
    router.push("/admin/settlements")
  }

  if (loading) return <div className="text-sm text-[#8A867D]">불러오는 중...</div>
  if (!data) return <div className="text-sm text-[#C94C4C]">정산 정보를 찾을 수 없습니다.</div>

  const user = data.partner_profiles?.users

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#191917]">정산 상세</h1>
        {data.status === "scheduled" && (
          <Button onClick={handlePay} disabled={paying}>
            {paying ? "처리 중..." : "지급 완료 처리"}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>정산 정보</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              { label: "파트너", value: user?.name ?? "-" },
              { label: "정산 월", value: data.settlement_month },
              { label: "총 건수", value: `${data.total_cases}건` },
              { label: "총액(세전)", value: formatKRW(data.gross_amount) },
              { label: "원천징수(3.3%)", value: formatKRW(data.withholding_tax_amount) },
              { label: "실지급액", value: formatKRW(data.net_amount) },
              { label: "상태", value: <SettlementStatusBadge status={data.status} /> },
              { label: "지급일", value: data.paid_at ? new Date(data.paid_at).toLocaleDateString("ko-KR") : "-" },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[#8A867D]">{label}</dt>
                <dd className="font-medium text-[#191917] mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>정산 항목 ({data.settlement_items.length}건)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                {["상호명", "파일럿 시작일", "건당 금액"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E1]">
              {data.settlement_items.map(item => (
                <tr key={item.id} className="hover:bg-[#F7F7F5]">
                  <td className="px-4 py-3 text-[#191917]">{item.merchant_leads?.store_name ?? "-"}</td>
                  <td className="px-4 py-3 text-[#5F5B53]">{item.merchant_leads?.pilot_started_at ?? "-"}</td>
                  <td className="px-4 py-3 text-[#191917]">{formatKRW(item.case_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
