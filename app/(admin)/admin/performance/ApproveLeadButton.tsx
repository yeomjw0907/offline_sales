"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/ui/LoadingButton"

export default function ApproveLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleApprove() {
    if (!confirm("이 실적을 승인하시겠습니까? 승인 후 정산 대상에 포함됩니다.")) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/performance/${leadId}/approve`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "승인에 실패했습니다.")
        return
      }
      router.refresh()
    } catch {
      setError("네트워크 오류로 승인에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <LoadingButton
        onClick={handleApprove}
        loading={loading}
        loadingText="승인 중..."
        size="sm"
      >
        승인
      </LoadingButton>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
