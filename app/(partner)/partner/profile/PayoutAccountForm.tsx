"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PayoutAccountFormProps {
  hasExisting: boolean
}

export default function PayoutAccountForm({ hasExisting }: PayoutAccountFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(!hasExisting)
  const [form, setForm] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const payload = {
        ...form,
        account_number: form.account_number.replace(/\D/g, ""),
      }
      if (!payload.account_number) {
        setMessage({ type: "error", text: "계좌번호를 입력해 주세요." })
        setSaving(false)
        return
      }

      const res = await fetch("/api/partners/payout-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMessage({ type: "error", text: data.error ?? "저장에 실패했습니다." })
      } else {
        await router.refresh()
        setMessage({ type: "success", text: "계좌가 등록되었습니다." })
        setOpen(false)
        setForm({ bank_name: "", account_holder_name: "", account_number: "" })
      }
    } catch {
      setMessage({ type: "error", text: "네트워크 오류가 발생했습니다." })
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        {hasExisting ? "계좌 변경하기" : "계좌 등록하기"}
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="bank_name">
          은행명 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bank_name"
          name="bank_name"
          value={form.bank_name}
          onChange={handleChange}
          placeholder="예: 국민은행"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account_holder_name">
          예금주 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="account_holder_name"
          name="account_holder_name"
          value={form.account_holder_name}
          onChange={handleChange}
          placeholder="홍길동"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account_number">
          계좌번호 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="account_number"
          name="account_number"
          value={form.account_number}
          onChange={handleChange}
          placeholder="- 없이 숫자만 입력"
          required
        />
      </div>

      {message && (
        <p
          className={`text-sm rounded-[10px] px-4 py-3 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex gap-2">
        {hasExisting && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setOpen(false)
              setMessage(null)
            }}
          >
            취소
          </Button>
        )}
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "저장 중..." : "계좌 저장하기"}
        </Button>
      </div>
    </form>
  )
}
