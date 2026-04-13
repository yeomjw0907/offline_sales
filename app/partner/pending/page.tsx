import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { signOut } from "@/auth"
import { createClient } from "@/lib/db/client"
import { Button } from "@/components/ui/button"

export default async function PendingPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const supabase = createClient("service")
  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("created_at, status")
    .eq("user_id", session.user.id)
    .single()

  if (profile?.status === "active") redirect("/partner")

  const appliedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-8 text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⏳</span>
        </div>
        <h1 className="text-lg font-semibold text-[#191917] mb-2">
          신청이 접수되었습니다
        </h1>
        <p className="text-sm text-[#5F5B53] mb-6 leading-relaxed">
          관리자 승인 후 서비스를 이용하실 수 있습니다.
          <br />
          승인 완료 시 안내 드리겠습니다.
        </p>

        <div className="bg-[#F7F7F5] rounded-[10px] p-4 mb-6 text-left space-y-2">
          {session.user.name && (
            <div className="flex justify-between text-sm">
              <span className="text-[#8A867D]">이름</span>
              <span className="text-[#191917] font-medium">{session.user.name}</span>
            </div>
          )}
          {appliedDate && (
            <div className="flex justify-between text-sm">
              <span className="text-[#8A867D]">신청일</span>
              <span className="text-[#191917]">{appliedDate}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[#8A867D]">상태</span>
            <span className="text-amber-700 font-medium">승인 대기 중</span>
          </div>
        </div>

        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <Button variant="outline" className="w-full" type="submit">
            로그아웃
          </Button>
        </form>
      </div>
    </div>
  )
}
