import { createClient } from "@/lib/db/client"

export async function logAdminAction(params: {
  adminUserId: string
  actionType: string
  targetType: string
  targetId: string
  beforeData?: Record<string, unknown>
  afterData?: Record<string, unknown>
  requestId?: string
}) {
  const supabase = createClient("service")
  const row = {
    admin_user_id: params.adminUserId,
    action_type: params.actionType,
    target_type: params.targetType,
    target_id: params.targetId,
    before_data: (params.beforeData ?? null) as import("@/lib/db/types").Json,
    after_data: (params.afterData ?? null) as import("@/lib/db/types").Json,
  }
  const { error } = await supabase.from("admin_activity_logs").insert(row)
  if (error) {
    console.error(
      `[logAdminAction] requestId=${params.requestId ?? "n/a"} actionType=${params.actionType} targetType=${params.targetType} targetId=${params.targetId} failed:`,
      error.message
    )
  }
}
