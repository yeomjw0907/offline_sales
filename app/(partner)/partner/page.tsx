import Link from "next/link"
import { requirePartner } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { formatKRW } from "@/lib/settlements/calculate"
import { Card, CardContent } from "@/components/ui/card"
import { LeadStatusBadge } from "@/components/shared/StatusBadge"
import CopyButton from "./CopyButton"

export default async function PartnerDashboard() {
  const session = await requirePartner()
  const supabase = createClient("service")

  const [{ data: profile }, { data: leads }, { data: settlements }] =
    await Promise.all([
      supabase
        .from("partner_profiles")
        .select("id, referral_code, created_at")
        .eq("user_id", session.user.id)
        .single(),
      supabase
        .from("merchant_leads")
        .select("id, store_name, region, pilot_started_at, status, referral_code")
        .order("pilot_started_at", { ascending: false })
        .limit(5),
      supabase
        .from("settlements")
        .select("id, net_amount, gross_amount, status, settlement_month, total_cases")
        .order("settlement_month", { ascending: false }),
    ])

  // filter leads by this partner's referral code
  const partnerLeads = (leads ?? []).filter(
    (l) => l.referral_code === profile?.referral_code
  )

  // Current month performance
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const thisMonthLeads = partnerLeads.filter(
    (l) => l.pilot_started_at?.startsWith(currentMonth)
  ).length

  const thisMonthSettlement = (settlements ?? []).find(
    (s) => s.settlement_month === currentMonth
  )
  const expectedFee = thisMonthSettlement?.net_amount ?? thisMonthLeads * 20_000 * (1 - 0.033)

  const paidTotal = (settlements ?? [])
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + (s.net_amount ?? 0), 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#191917]">
          안녕하세요, {session.user.name ?? "파트너"}님
        </h1>
        <p className="text-sm text-[#8A867D] mt-0.5">오늘도 좋은 하루 되세요.</p>
      </div>

      {/* Stats 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Referral code */}
        <Card className="col-span-2">
          <CardContent className="py-4">
            <p className="text-xs text-[#8A867D] mb-1.5">내 추천인 코드</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-[#191917] tracking-widest">
                {profile?.referral_code ?? "—"}
              </span>
              {profile?.referral_code && (
                <CopyButton text={profile.referral_code} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* This month count */}
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-[#8A867D] mb-1">이번 달 실적</p>
            <p className="text-2xl font-bold text-[#191917]">
              {thisMonthLeads}
              <span className="text-sm font-normal text-[#5F5B53] ml-1">건</span>
            </p>
          </CardContent>
        </Card>

        {/* Expected fee */}
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-[#8A867D] mb-1">예상 수수료</p>
            <p className="text-lg font-bold text-[#191917] truncate">
              {formatKRW(Math.floor(expectedFee))}
            </p>
          </CardContent>
        </Card>

        {/* Paid total */}
        <Card className="col-span-2">
          <CardContent className="py-4">
            <p className="text-xs text-[#8A867D] mb-1">지급완료 금액</p>
            <p className="text-2xl font-bold text-[#191917]">
              {formatKRW(paidTotal)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#191917]">최근 실적</h2>
          <Link
            href="/partner/settlement"
            className="text-xs text-[#5F5B53] hover:text-[#191917]"
          >
            전체 보기 →
          </Link>
        </div>

        {partnerLeads.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-[#8A867D]">아직 추천한 가맹점이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-[#E9E7E1]">
              {partnerLeads.map((lead) => (
                <div key={lead.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#191917] truncate">
                      {lead.store_name}
                    </p>
                    <p className="text-xs text-[#8A867D] mt-0.5">
                      {lead.region} ·{" "}
                      {new Date(lead.pilot_started_at).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/partner/materials"
          className="flex flex-col items-center justify-center gap-2 bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-5 min-h-[88px] hover:bg-[#F7F7F5] transition-colors"
        >
          <span className="text-2xl">📄</span>
          <span className="text-sm font-medium text-[#191917]">파트너 자료</span>
        </Link>
        <Link
          href="/partner/settlement"
          className="flex flex-col items-center justify-center gap-2 bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-5 min-h-[88px] hover:bg-[#F7F7F5] transition-colors"
        >
          <span className="text-2xl">💰</span>
          <span className="text-sm font-medium text-[#191917]">정산 내역</span>
        </Link>
      </div>
    </div>
  )
}
