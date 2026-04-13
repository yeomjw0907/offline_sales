import { requireSuperAdmin } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  searchParams: Promise<{ action_type?: string; target_type?: string }>
}

export default async function LogsPage({ searchParams }: Props) {
  await requireSuperAdmin()
  const { action_type, target_type } = await searchParams
  const supabase = createClient("service")

  let query = supabase
    .from("admin_activity_logs")
    .select("*, users(name)")
    .order("created_at", { ascending: false })
    .limit(100)

  if (action_type) query = query.eq("action_type", action_type)
  if (target_type) query = query.eq("target_type", target_type)

  const { data: logs } = await query

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-[#191917]">관리자 로그</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                  {["관리자", "액션", "대상 유형", "대상 ID", "일시"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E1]">
                {logs?.map(log => {
                  const user = Array.isArray(log.users) ? log.users[0] : log.users
                  return (
                    <tr key={log.id} className="hover:bg-[#F7F7F5]">
                      <td className="px-4 py-3 text-[#191917]">{(user as { name?: string })?.name ?? "-"}</td>
                      <td className="px-4 py-3 font-medium text-[#191917]">{log.action_type}</td>
                      <td className="px-4 py-3 text-[#5F5B53]">{log.target_type}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#8A867D]">
                        {log.target_id ? log.target_id.slice(0, 8) + "..." : "-"}
                      </td>
                      <td className="px-4 py-3 text-[#8A867D]">
                        {new Date(log.created_at).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
