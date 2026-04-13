import { redirect } from "next/navigation"
import { requirePartner } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import PartnerNav from "./PartnerNav"

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requirePartner()

  const supabase = createClient("service")
  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("id, status, deactivated_at")
    .eq("user_id", session.user.id)
    .single()

  // No profile → redirect to apply (but not if already on apply)
  // We do this check via middleware-style redirect from layout
  if (!profile) {
    redirect("/partner/apply")
  }

  if (profile.status === "pending") {
    redirect("/partner/pending")
  }

  if (profile.status === "inactive") {
    if (profile.deactivated_at && new Date(profile.deactivated_at) <= new Date()) {
      await supabase
        .from("partner_profiles")
        .update({
          status: "active",
          deactivated_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)
    } else {
      redirect("/partner/suspended")
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <PartnerNav />
      <main className="pb-20 md:pb-0 md:pt-16">{children}</main>
    </div>
  )
}
