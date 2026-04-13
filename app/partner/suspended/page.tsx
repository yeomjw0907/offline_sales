import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { createClient } from "@/lib/db/client"
import { Button } from "@/components/ui/button"

export default async function SuspendedPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const supabase = createClient("service")
  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("deactivated_at, status")
    .eq("user_id", session.user.id)
    .single()

  if (!profile || profile.status !== "inactive") {
    redirect("/partner")
  }

  const until = profile.deactivated_at ? new Date(profile.deactivated_at) : null
  const untilText = until ? until.toLocaleDateString("ko-KR") : "관리자에게 문의"

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⛔</span>
        </div>
        <h1 className="text-lg font-semibold text-[#191917] mb-2">계정이 정지되었습니다</h1>
        <p className="text-sm text-[#5F5B53] mb-6 leading-relaxed">
          정지 해제 예정일: {untilText}
          <br />
          문의가 필요한 경우 관리자에게 연락해 주세요.
        </p>

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
