import { requirePartner } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileForm from "./ProfileForm"
import PayoutAccountForm from "./PayoutAccountForm"

export default async function ProfilePage() {
  const session = await requirePartner()
  const supabase = createClient("service")

  const [{ data: dbUser }, { data: profile }] = await Promise.all([
    supabase
      .from("users")
      .select("name, phone, email")
      .eq("id", session.user.id)
      .single(),
    supabase
      .from("partner_profiles")
      .select("id, activity_region, activity_type, intro")
      .eq("user_id", session.user.id)
      .single(),
  ])

  const { data: payoutAccount } = profile
    ? await supabase
        .from("partner_payout_accounts")
        .select("bank_name, account_holder_name, account_number_encrypted")
        .eq("partner_profile_id", profile.id)
        .eq("is_active", true)
        .single()
    : { data: null }

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
        <h1 className="text-xl font-semibold text-[#191917]">프로필</h1>
        <p className="text-sm text-[#8A867D] mt-0.5">계정 및 파트너 정보를 관리합니다.</p>
      </div>

      {/* User info (read-only) */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#F7F7F5]">
            <span className="text-sm text-[#8A867D]">이름</span>
            <span className="text-sm text-[#191917] font-medium">
              {dbUser?.name ?? session.user.name ?? "—"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F7F7F5]">
            <span className="text-sm text-[#8A867D]">이메일</span>
            <span className="text-sm text-[#191917]">
              {dbUser?.email ?? session.user.email ?? "—"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-[#8A867D]">연락처</span>
            <span className="text-sm text-[#191917]">{dbUser?.phone ?? "—"}</span>
          </div>
          <p className="text-xs text-[#8A867D]">
            기본 정보는 카카오 계정과 연동되어 수정할 수 없습니다.
          </p>
        </CardContent>
      </Card>

      {/* Partner info (editable) */}
      <ProfileForm
        initialData={{
          activity_region: profile?.activity_region ?? "",
          activity_type: profile?.activity_type ?? "",
          intro: profile?.intro ?? "",
        }}
      />

      {/* Payout account */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">출금 계좌</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {payoutAccount && (
            <div className="bg-[#F7F7F5] rounded-[10px] p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A867D]">은행</span>
                <span className="text-[#191917] font-medium">{payoutAccount.bank_name}</span>
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
            </div>
          )}
          <PayoutAccountForm hasExisting={!!payoutAccount} />
        </CardContent>
      </Card>

      {/* Sign out */}
      <div className="pb-4">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <Button variant="outline" className="w-full text-[#5F5B53]" type="submit">
            로그아웃
          </Button>
        </form>
      </div>
    </div>
  )
}
