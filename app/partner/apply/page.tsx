import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"
import ApplyForm from "./ApplyForm"

export default async function ApplyPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Already applied
  const supabase = createClient("service")
  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("id, status")
    .eq("user_id", session.user.id)
    .single()

  if (profile) {
    if (profile.status === "pending") redirect("/partner/pending")
    if (profile.status === "active") redirect("/partner")
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 px-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-[#191917]">파트너 신청</h1>
          <p className="text-sm text-[#5F5B53] mt-1">
            ReadyTalk 파트너로 활동하시려면 아래 정보를 입력해 주세요.
          </p>
        </div>
        <ApplyForm />
      </div>
    </div>
  )
}
