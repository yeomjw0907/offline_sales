"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  month: string
}

export default function GenerateSettlementButton({ month }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleClick() {
    setMessage(null)
    setLoading(true)
    try {
      const res = await fetch("/api/settlements/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "정산 생성에 실패했습니다.")
        return
      }
      const created = typeof data.created === "number" ? data.created : 0
      setMessage(
        created > 0
          ? `${month} 정산 ${created}건이 생성되었습니다.`
          : `${month}에 생성할 정산이 없습니다. (이미 생성됨 또는 해당 월 실적 없음)`
      )
      router.refresh()
    } catch {
      setMessage("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="outline" onClick={handleClick} disabled={loading}>
        {loading ? "처리 중..." : `${month} 정산 생성`}
      </Button>
      {message && <p className="text-xs text-[#5F5B53] max-w-xs text-right">{message}</p>}
    </div>
  )
}
