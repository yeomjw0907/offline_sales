"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ACTIVITY_TYPES = [
  { value: "오프라인", label: "오프라인" },
  { value: "온라인", label: "온라인" },
  { value: "둘다", label: "둘 다" },
]

interface ProfileFormProps {
  initialData: {
    activity_region: string
    activity_type: string
    intro: string
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [form, setForm] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/partners/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMessage({ type: "error", text: data.error ?? "저장에 실패했습니다." })
      } else {
        setMessage({ type: "success", text: "프로필이 저장되었습니다." })
      }
    } catch {
      setMessage({ type: "error", text: "네트워크 오류가 발생했습니다." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm">파트너 정보</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="activity_region">활동 지역</Label>
            <Input
              id="activity_region"
              name="activity_region"
              value={form.activity_region}
              onChange={handleChange}
              placeholder="예: 서울 강남구"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="activity_type">활동 유형</Label>
            <select
              id="activity_type"
              name="activity_type"
              value={form.activity_type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-[10px] border border-[#E9E7E1] bg-white px-3 py-2 text-sm text-[#191917] focus:outline-none focus:ring-2 focus:ring-[#191917] focus:ring-offset-2"
            >
              <option value="">선택해 주세요</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="intro">자기소개</Label>
            <Textarea
              id="intro"
              name="intro"
              value={form.intro}
              onChange={handleChange}
              placeholder="간단한 자기소개를 입력해 주세요."
              rows={3}
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

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "저장 중..." : "저장하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
