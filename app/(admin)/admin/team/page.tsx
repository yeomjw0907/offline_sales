import { requireSuperAdmin } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TeamPage() {
  await requireSuperAdmin()
  const supabase = createClient("service")

  const { data: admins } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .in("role", ["admin", "super_admin"])
    .order("created_at", { ascending: false })

  const roleLabels = { admin: "관리자", super_admin: "최고관리자" }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-[#191917]">팀 관리</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                {["이름", "이메일", "역할", "등록일"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E1]">
              {admins?.map(u => (
                <tr key={u.id} className="hover:bg-[#F7F7F5]">
                  <td className="px-4 py-3 font-medium text-[#191917]">{u.name ?? "-"}</td>
                  <td className="px-4 py-3 text-[#5F5B53]">{u.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "super_admin" ? "active" : "default"}>
                      {roleLabels[u.role as keyof typeof roleLabels]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#8A867D]">
                    {new Date(u.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
