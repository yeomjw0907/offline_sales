"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ConsentKey = "required" | "marketing"

const CONSENT_TEXTS: Record<ConsentKey, { title: string; sections: { heading: string; items: string[] }[]; footer?: string }> = {
  required: {
    title: "개인정보 수집 및 이용 동의 (필수)",
    sections: [
      {
        heading: "수집 항목",
        items: [
          "이름, 전화번호, 이메일",
          "카카오 계정 식별자",
          "활동 지역, 활동 유형, 유입 경로",
          "자기소개(선택 입력 시)",
        ],
      },
      {
        heading: "수집·이용 목적",
        items: [
          "파트너 신청 접수 및 신원 확인",
          "추천인 코드 발급 및 실적 귀속 판단",
          "수수료 정산 및 세무 처리 대응",
          "공지사항·운영 안내 전달, 민원 처리",
        ],
      },
      {
        heading: "보유 및 이용 기간",
        items: [
          "회원 탈퇴 또는 처리 목적 달성 시까지",
          "관계 법령에 따라 보관이 필요한 경우 해당 법정 기간까지 (계약·결제·소비자 분쟁 등)",
        ],
      },
    ],
    footer:
      "본 동의를 거부할 권리가 있으나, 거부 시 파트너 신청이 제한될 수 있습니다. 자세한 사항은 개인정보처리방침을 참고해 주세요.",
  },
  marketing: {
    title: "마케팅 정보 수신 동의 (선택)",
    sections: [
      {
        heading: "수신 내용",
        items: [
          "신규 프로모션, 이벤트, 캠페인 안내",
          "서비스 업데이트 및 신규 기능 소개",
          "파트너 활동에 도움이 되는 영업 자료·팁",
        ],
      },
      {
        heading: "수신 방법",
        items: ["이메일, SMS, 카카오 알림톡, 앱 푸시 등"],
      },
      {
        heading: "보유 및 이용 기간",
        items: ["동의 철회 시 또는 회원 탈퇴 시까지"],
      },
    ],
    footer:
      "본 동의는 선택 사항이며, 동의하지 않아도 파트너 활동에는 제한이 없습니다. 동의 후에도 언제든지 철회하실 수 있습니다.",
  },
}

const ACQUISITION_CHANNELS = [
  { value: "SNS", label: "SNS" },
  { value: "지인소개", label: "지인소개" },
  { value: "인터넷검색", label: "인터넷검색" },
  { value: "채용플랫폼", label: "채용플랫폼 (사람인, 잡코리아 등)" },
  { value: "기타", label: "기타" },
]

const ACTIVITY_TYPES = [
  { value: "오프라인", label: "오프라인" },
  { value: "온라인", label: "온라인" },
  { value: "둘다", label: "둘 다" },
]

const REGION_OPTIONS: Record<string, string[]> = {
  서울특별시: [
    "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구",
    "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구",
    "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구",
    "서초구", "강남구", "송파구", "강동구",
  ],
  부산광역시: [
    "중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구",
    "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구",
    "기장군",
  ],
  대구광역시: [
    "중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군",
    "군위군",
  ],
  인천광역시: [
    "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구",
    "강화군", "옹진군",
  ],
  광주광역시: [
    "동구", "서구", "남구", "북구", "광산구",
  ],
  대전광역시: [
    "동구", "중구", "서구", "유성구", "대덕구",
  ],
  울산광역시: [
    "중구", "남구", "동구", "북구", "울주군",
  ],
  세종특별자치시: [
    "세종특별자치시",
  ],
  경기도: [
    "수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시",
    "동두천시", "안산시", "고양시", "과천시", "구리시", "남양주시", "오산시",
    "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시", "이천시",
    "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시",
    "연천군", "가평군", "양평군",
  ],
  강원특별자치도: [
    "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시",
    "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군",
    "양구군", "인제군", "고성군", "양양군",
  ],
  충청북도: [
    "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군",
    "진천군", "괴산군", "음성군", "단양군",
  ],
  충청남도: [
    "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시",
    "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군",
    "태안군",
  ],
  전북특별자치도: [
    "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군",
    "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군",
  ],
  전라남도: [
    "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군",
    "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군",
    "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군",
    "신안군",
  ],
  경상북도: [
    "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시",
    "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군",
    "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군",
    "울릉군",
  ],
  경상남도: [
    "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시",
    "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군",
    "산청군", "함양군", "거창군", "합천군",
  ],
  제주특별자치도: [
    "제주시", "서귀포시",
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
  const [openConsent, setOpenConsent] = useState<ConsentKey | null>(null)

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

  useEffect(() => {
    if (!openConsent) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenConsent(null)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [openConsent])

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
        body: JSON.stringify({ ...form, marketing_consent: consent.marketing }),
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
        <div className="flex items-start justify-between gap-3">
          <label className="flex items-start gap-3 cursor-pointer flex-1">
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
          <button
            type="button"
            onClick={() => setOpenConsent("required")}
            className="shrink-0 text-xs text-[#5F5B53] underline underline-offset-2 hover:text-[#191917]"
          >
            전문 보기
          </button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <label className="flex items-start gap-3 cursor-pointer flex-1">
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
          <button
            type="button"
            onClick={() => setOpenConsent("marketing")}
            className="shrink-0 text-xs text-[#5F5B53] underline underline-offset-2 hover:text-[#191917]"
          >
            전문 보기
          </button>
        </div>
      </div>

      {openConsent && (
        <ConsentModal
          consent={CONSENT_TEXTS[openConsent]}
          onClose={() => setOpenConsent(null)}
        />
      )}

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

function ConsentModal({
  consent,
  onClose,
}: {
  consent: (typeof CONSENT_TEXTS)[ConsentKey]
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-lg max-h-[80vh] flex-col rounded-[12px] border border-[#E9E7E1] bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E9E7E1] px-5 py-4">
          <h3
            id="consent-modal-title"
            className="text-base font-semibold text-[#191917]"
          >
            {consent.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-[#8A867D] hover:text-[#191917]"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 text-sm leading-relaxed text-[#5F5B53]">
          <div className="space-y-4">
            {consent.sections.map((section) => (
              <section key={section.heading}>
                <h4 className="mb-1 text-sm font-semibold text-[#191917]">
                  {section.heading}
                </h4>
                <ul className="list-disc space-y-1 pl-5">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
            {consent.footer && (
              <p className="border-t border-[#E9E7E1] pt-3 text-xs text-[#8A867D]">
                {consent.footer}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end border-t border-[#E9E7E1] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] bg-[#191917] px-4 py-2 text-sm text-white hover:bg-[#3A3835]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
