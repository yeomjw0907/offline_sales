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

const REGION_OPTIONS: Record<string, string[]> = {
  서울특별시: [
    "종로구",
    "중구",
    "용산구",
    "성동구",
    "광진구",
    "동대문구",
    "중랑구",
    "성북구",
    "강북구",
    "도봉구",
    "노원구",
    "은평구",
    "서대문구",
    "마포구",
    "양천구",
    "강서구",
    "구로구",
    "금천구",
    "영등포구",
    "동작구",
    "관악구",
    "서초구",
    "강남구",
    "송파구",
    "강동구",
  ],
  인천광역시: [
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
    "강화군",
    "옹진군",
  ],
  경기도: [
    "수원시",
    "성남시",
    "의정부시",
    "안양시",
    "부천시",
    "광명시",
    "평택시",
    "동두천시",
    "안산시",
    "고양시",
    "과천시",
    "구리시",
    "남양주시",
    "오산시",
    "시흥시",
    "군포시",
    "의왕시",
    "하남시",
    "용인시",
    "파주시",
    "이천시",
    "안성시",
    "김포시",
    "화성시",
    "광주시",
    "양주시",
    "포천시",
    "여주시",
    "연천군",
    "가평군",
    "양평군",
  ],
}

const SELECT_CLASS_NAME =
  "peer flex h-10 w-full appearance-none rounded-[10px] border border-[#DCD9D1] bg-[#FCFCFB] px-3 pr-9 py-2 text-sm text-[#191917] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#191917] focus:ring-offset-2 focus:border-[#191917] disabled:cursor-not-allowed disabled:opacity-50"

function formatPhoneNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

export default function ApplyForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSido, setSelectedSido] = useState("")
  const [selectedSigungu, setSelectedSigungu] = useState("")

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
    const { name, value } = e.target
    const nextValue = name === "phone" ? formatPhoneNumber(value) : value
    setForm((prev) => ({ ...prev, [name]: nextValue }))
  }

  function handleSidoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sido = e.target.value
    setSelectedSido(sido)
    setSelectedSigungu("")
    setForm((prev) => ({ ...prev, activity_region: "" }))
  }

  function handleSigunguChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sigungu = e.target.value
    setSelectedSigungu(sigungu)
    setForm((prev) => ({ ...prev, activity_region: `${selectedSido} ${sigungu}` }))
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

      router.push("/partner")
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
          inputMode="numeric"
          maxLength={13}
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
        <Label>
          활동 지역 <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <select
              id="activity_sido"
              name="activity_sido"
              value={selectedSido}
              onChange={handleSidoChange}
              required
              className={SELECT_CLASS_NAME}
            >
              <option value="" disabled>
                시/도 선택
              </option>
              {Object.keys(REGION_OPTIONS).map((sido) => (
                <option key={sido} value={sido}>
                  {sido}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#8A867D]">
              ▾
            </span>
          </div>

          <div className="relative">
            <select
              id="activity_sigungu"
              name="activity_sigungu"
              value={selectedSigungu}
              onChange={handleSigunguChange}
              required
              disabled={!selectedSido}
              className={SELECT_CLASS_NAME}
            >
              <option value="" disabled>
                시/군/구 선택
              </option>
              {(REGION_OPTIONS[selectedSido] ?? []).map((sigungu) => (
                <option key={sigungu} value={sigungu}>
                  {sigungu}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#8A867D]">
              ▾
            </span>
          </div>
        </div>
        <p className="text-xs text-[#8A867D]">선택값: {form.activity_region || "-"}</p>
      </div>

      {/* Acquisition Channel */}
      <div className="space-y-1.5">
        <Label htmlFor="acquisition_channel">
          유입 경로 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <select
            id="acquisition_channel"
            name="acquisition_channel"
            value={form.acquisition_channel}
            onChange={handleChange}
            required
            className={SELECT_CLASS_NAME}
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
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#8A867D]">
            ▾
          </span>
        </div>
      </div>

      {/* Activity Type */}
      <div className="space-y-1.5">
        <Label htmlFor="activity_type">
          활동 유형 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <select
            id="activity_type"
            name="activity_type"
            value={form.activity_type}
            onChange={handleChange}
            required
            className={SELECT_CLASS_NAME}
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
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#8A867D]">
            ▾
          </span>
        </div>
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
