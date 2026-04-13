"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const ACQUISITION_CHANNELS = [
  { value: "SNS", label: "SNS" },
  { value: "지인소개", label: "지인소개" },
  { value: "인터넷검색", label: "인터넷검색" },
  { value: "기타", label: "기타" },
]

const ACTIVITY_TYPES = [
  { value: "오프라인", label: "오프라인" },
  { value: "온라인", label: "온라인" },
  { value: "둘다", label: "둘 다" },
]

export default function ApplyForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    activity_region: "",
    acquisition_channel: "",
    activity_type: "",
    intro: "",
  })

  const [consent, setConsent] = useState({ required: false, marketing: false })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!consent.required) {
      setError("개인정보 수집 및 이용에 동의해 주세요.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "신청 중 오류가 발생했습니다.")
        return
      }

      router.push("/partner/pending")
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-6 space-y-5"
    >
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="홍길동"
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">
          연락처 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">
          이메일 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
        />
      </div>

      {/* Activity Region */}
      <div className="space-y-1.5">
        <Label htmlFor="activity_region">
          활동 지역 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="activity_region"
          name="activity_region"
          value={form.activity_region}
          onChange={handleChange}
          placeholder="예: 서울 강남구"
          required
        />
      </div>

      {/* Acquisition Channel */}
      <div className="space-y-1.5">
        <Label htmlFor="acquisition_channel">
          유입 경로 <span className="text-red-500">*</span>
        </Label>
        <select
          id="acquisition_channel"
          name="acquisition_channel"
          value={form.acquisition_channel}
          onChange={handleChange}
          required
          className="flex h-10 w-full rounded-[10px] border border-[#E9E7E1] bg-white px-3 py-2 text-sm text-[#191917] focus:outline-none focus:ring-2 focus:ring-[#191917] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            선택해 주세요
          </option>
          {ACQUISITION_CHANNELS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Type */}
      <div className="space-y-1.5">
        <Label htmlFor="activity_type">
          활동 유형 <span className="text-red-500">*</span>
        </Label>
        <select
          id="activity_type"
          name="activity_type"
          value={form.activity_type}
          onChange={handleChange}
          required
          className="flex h-10 w-full rounded-[10px] border border-[#E9E7E1] bg-white px-3 py-2 text-sm text-[#191917] focus:outline-none focus:ring-2 focus:ring-[#191917] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            선택해 주세요
          </option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Intro */}
      <div className="space-y-1.5">
        <Label htmlFor="intro">자기소개 (선택)</Label>
        <Textarea
          id="intro"
          name="intro"
          value={form.intro}
          onChange={handleChange}
          placeholder="간단한 자기소개나 활동 계획을 입력해 주세요."
          rows={3}
        />
      </div>

      {/* Consent */}
      <div className="space-y-3 border-t border-[#E9E7E1] pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent.required}
            onChange={(e) =>
              setConsent((prev) => ({ ...prev, required: e.target.checked }))
            }
            className="mt-0.5 h-4 w-4 rounded border-[#E9E7E1] accent-[#191917]"
          />
          <span className="text-sm text-[#191917]">
            <span className="font-medium">[필수]</span> 개인정보 수집 및 이용에
            동의합니다.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent.marketing}
            onChange={(e) =>
              setConsent((prev) => ({ ...prev, marketing: e.target.checked }))
            }
            className="mt-0.5 h-4 w-4 rounded border-[#E9E7E1] accent-[#191917]"
          />
          <span className="text-sm text-[#5F5B53]">
            <span className="font-medium">[선택]</span> 마케팅 정보 수신에
            동의합니다.
          </span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full h-11"
        disabled={submitting}
      >
        {submitting ? "신청 중..." : "파트너 신청하기"}
      </Button>
    </form>
  )
}
