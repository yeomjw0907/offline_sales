import Link from "next/link"
import { requirePartner } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { formatKRW } from "@/lib/settlements/calculate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettlementStatusBadge } from "@/components/shared/StatusBadge"

export default async function SettlementPage() {
  const session = await requirePartner()
  const supabase = createClient("service")

  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  const [{ data: settlements }, { data: payoutAccount }] = await Promise.all([
    profile
      ? supabase
          .from("settlements")
          .select("*")
          .eq("partner_profile_id", profile.id)
          .order("settlement_month", { ascending: false })
      : Promise.resolve({ data: [] }),
    profile
      ? supabase
          .from("partner_payout_accounts")
          .select("bank_name, account_holder_name, account_number_encrypted")
          .eq("partner_profile_id", profile.id)
          .eq("is_active", true)
          .single()
      : Promise.resolve({ data: null }),
  ])

  const items = settlements ?? []
  const totalScheduled = items
    .filter((s) => s.status === "scheduled")
    .reduce((sum, s) => sum + s.net_amount, 0)
  const totalPaid = items
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.net_amount, 0)

  // Decode masked account number (last 4 digits)
  function maskAccount(encrypted: string): string {
    try {
      const decoded = Buffer.from(encrypted, "base64").toString("utf-8")
      return "****" + decoded.slice(-4)
    } catch {
      return "****"
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#191917]">정산 내역</h1>
        <p className="text-sm text-[#8A867D] mt-0.5">수수료 정산 현황을 확인하세요.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-[#8A867D] mb-1">정산 예정액</p>
            <p className="text-lg font-bold text-[#191917] truncate">
              {formatKRW(totalScheduled)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-[#8A867D] mb-1">지급완료액</p>
            <p className="text-lg font-bold text-[#191917] truncate">
              {formatKRW(totalPaid)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settlement table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">정산 목록</CardTitle>
        </CardHeader>
        <CardContent className="pt-3 pb-2">
          {items.length === 0 ? (
            <p className="text-sm text-[#8A867D] text-center py-8">
              아직 정산 내역이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-[#E9E7E1]">
                    <th className="text-left text-xs font-medium text-[#8A867D] pb-2.5">
                      정산 월
                    </th>
                    <th className="text-right text-xs font-medium text-[#8A867D] pb-2.5">
                      건수
                    </th>
                    <th className="text-right text-xs font-medium text-[#8A867D] pb-2.5">
                      지급액
                    </th>
                    <th className="text-center text-xs font-medium text-[#8A867D] pb-2.5">
                      상태
                    </th>
                    <th className="text-right text-xs font-medium text-[#8A867D] pb-2.5">
                      지급일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E7E1]">
                  {items.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 text-[#191917] font-medium">
                        {s.settlement_month}
                      </td>
                      <td className="py-3 text-right text-[#5F5B53]">
                        {s.total_cases}건
                      </td>
                      <td className="py-3 text-right text-[#191917] font-medium">
                        {formatKRW(s.net_amount)}
                      </td>
                      <td className="py-3 text-center">
                        <SettlementStatusBadge status={s.status} />
                      </td>
                      <td className="py-3 text-right text-[#8A867D] text-xs">
                        {s.paid_at
                          ? new Date(s.paid_at).toLocaleDateString("ko-KR", {
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout account */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">출금 계좌</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          {payoutAccount ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A867D]">은행</span>
                <span className="text-[#191917] font-medium">
                  {payoutAccount.bank_name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A867D]">예금주</span>
                <span className="text-[#191917] font-medium">
                  {payoutAccount.account_holder_name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A867D]">계좌번호</span>
                <span className="text-[#191917] font-mono">
                  {maskAccount(payoutAccount.account_number_encrypted)}
                </span>
              </div>
              <p className="text-xs text-[#8A867D] mt-2">
                계좌 변경은{" "}
                <Link
                  href="/partner/profile"
                  className="underline hover:text-[#191917]"
                >
                  프로필
                </Link>
                에서 할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[#8A867D] mb-3">
                등록된 출금 계좌가 없습니다.
              </p>
              <Link
                href="/partner/profile"
                className="text-sm font-medium text-[#191917] underline"
              >
                프로필에서 계좌 등록하기 →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
