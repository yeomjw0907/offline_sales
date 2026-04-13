"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const regionParts = initialData.activity_region?.trim().split(" ") ?? []
  const initialSido = regionParts[0] ?? ""
  const initialSigungu = regionParts.slice(1).join(" ") ?? ""
  const [selectedSido, setSelectedSido] = useState(initialSido)
  const [selectedSigungu, setSelectedSigungu] = useState(initialSigungu)

  function handleChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage(null)
  }

  function handleSidoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sido = e.target.value
    setSelectedSido(sido)
    setSelectedSigungu("")
    setForm((prev) => ({ ...prev, activity_region: "" }))
    setMessage(null)
  }

  function handleSigunguChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sigungu = e.target.value
    setSelectedSigungu(sigungu)
    setForm((prev) => ({ ...prev, activity_region: `${selectedSido} ${sigungu}` }))
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
            <Label>활동 지역</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <select
                  id="activity_sido"
                  name="activity_sido"
                  value={selectedSido}
                  onChange={handleSidoChange}
                  className={SELECT_CLASS_NAME}
                >
                  <option value="">시/도 선택</option>
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
                  disabled={!selectedSido}
                  className={SELECT_CLASS_NAME}
                >
                  <option value="">시/군/구 선택</option>
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

          <div className="space-y-1.5">
            <Label htmlFor="activity_type">활동 유형</Label>
            <select
              id="activity_type"
              name="activity_type"
              value={form.activity_type}
              onChange={handleChange}
              className={SELECT_CLASS_NAME}
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
