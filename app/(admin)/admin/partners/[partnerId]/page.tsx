"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartnerStatusBadge, LeadStatusBadge, SettlementStatusBadge } from "@/components/shared/StatusBadge"
import { formatKRW } from "@/lib/settlements/calculate"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { InlineStatus } from "@/components/ui/InlineStatus"

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
  const [actionLabel, setActionLabel] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch(`/api/partners/${partnerId}/detail`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [partnerId])

  const handleSuspend = async (days: 1 | 3 | 7 | 30) => {
    setActionError(null)
    setActing(true)
    setActionLabel(`${days}일 정지 처리 중...`)
    try {
      const res = await fetch(`/api/partners/${partnerId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setActionError(data.error ?? "파트너 정지 처리에 실패했습니다.")
        return
      }
      load()
    } catch {
      setActionError("네트워크 오류로 정지 처리에 실패했습니다.")
    } finally {
      setActing(false)
      setActionLabel(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("정말 계정을 삭제할까요? 삭제 후에도 재가입은 가능합니다.")) return
    setActionError(null)
    setActing(true)
    setActionLabel("계정 삭제 처리 중...")
    try {
      const res = await fetch(`/api/partners/${partnerId}/delete`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setActionError(data.error ?? "계정 삭제에 실패했습니다.")
        return
      }
      window.location.href = "/admin/partners"
    } catch {
      setActionError("네트워크 오류로 계정 삭제에 실패했습니다.")
    } finally {
      setActing(false)
      setActionLabel(null)
    }
  }

  if (loading) return <div className="text-sm text-[#8A867D]">불러오는 중...</div>
  if (!data) return <div className="text-sm text-[#C94C4C]">파트너를 찾을 수 없습니다.</div>

  const user = data.users

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-[#191917]">{user?.name ?? "파트너"} 상세</h1>
        <div className="flex gap-2 flex-wrap">
          {[1, 3, 7, 30].map((days) => (
            <LoadingButton
              key={days}
              onClick={() => handleSuspend(days as 1 | 3 | 7 | 30)}
              disabled={acting}
              loading={acting && actionLabel?.includes(`${days}일 정지`) === true}
              loadingText="처리 중..."
              variant="outline"
            >
              {`${days}일 정지`}
            </LoadingButton>
          ))}
          <LoadingButton
            onClick={handleDelete}
            disabled={acting}
            loading={acting && actionLabel?.includes("계정 삭제") === true}
            loadingText="삭제 중..."
            variant="danger"
          >
            계정 삭제
          </LoadingButton>
        </div>
      </div>
      {acting && actionLabel && <InlineStatus message={actionLabel} tone="neutral" className="text-sm" />}
      {actionError && <InlineStatus message={actionError} tone="error" className="text-sm" />}

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
