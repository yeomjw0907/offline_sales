"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PartnerOption {
  id: string
  referral_code: string
  name: string | null
  email: string | null
}

export default function NewPerformancePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    store_name: "", contact_phone: "", region: "",
    referral_code: "", pilot_started_at: "",
  })
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [duplicate, setDuplicate] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [partners, setPartners] = useState<PartnerOption[]>([])
  const [selectedPartnerId, setSelectedPartnerId] = useState("")

  useEffect(() => {
    fetch("/api/partners/lookup?list=1")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setPartners(Array.isArray(data.data) ? data.data : []))
      .catch(() => setPartners([]))
  }, [])

  const handleCodeBlur = async () => {
    if (!form.referral_code) return
    const res = await fetch(`/api/partners/lookup?code=${form.referral_code.toUpperCase()}`)
    if (res.ok) {
      const data = await res.json()
      setPartnerName(data.name ?? "이름 없음")
    } else {
      setPartnerName(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setDuplicate(false)

    const res = await fetch("/api/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, referral_code: form.referral_code.toUpperCase() }),
    })

    if (res.status === 409) {
      setDuplicate(true)
      setSubmitting(false)
      return
    }
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "오류가 발생했습니다.")
      setSubmitting(false)
      return
    }

    router.push("/admin/performance")
    router.refresh()
  }

  return (
    <div className="max-w-lg space-y-5">
      <h1 className="text-2xl font-semibold text-[#191917]">새 실적 입력</h1>

      <Card>
        <CardHeader><CardTitle>파일럿 시작 정보</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {duplicate && (
              <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-3 text-sm text-amber-800">
                동일한 상호명 + 연락처 조합이 이미 등록되어 있습니다. 계속 입력하시겠습니까?
                <div className="mt-2 flex gap-2">
                  <Button size="sm" type="submit" variant="default">중복 확인 후 저장</Button>
                  <Button size="sm" type="button" variant="outline" onClick={() => setDuplicate(false)}>취소</Button>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] p-3 text-sm text-[#C94C4C]">{error}</div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="store_name">상호명 *</Label>
              <Input id="store_name" value={form.store_name} onChange={e => setForm(f => ({ ...f, store_name: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_phone">연락처 *</Label>
              <Input id="contact_phone" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="region">지역 *</Label>
              <Input id="region" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="partner_select">파트너 선택 (드롭다운)</Label>
              <select
                id="partner_select"
                value={selectedPartnerId}
                onChange={(e) => {
                  const id = e.target.value
                  setSelectedPartnerId(id)
                  const selected = partners.find((p) => p.id === id)
                  if (selected?.referral_code) {
                    setForm((f) => ({ ...f, referral_code: selected.referral_code }))
                    setPartnerName(selected.name ?? "이름 없음")
                  }
                }}
                className="h-10 w-full rounded-[10px] border border-[#DCD9D1] bg-[#FCFCFB] px-3 py-2 text-sm text-[#191917] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#191917] focus:ring-offset-2 focus:border-[#191917]"
              >
                <option value="">파트너를 선택해 자동 입력</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {(p.name ?? "이름 없음")} ({p.referral_code})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="referral_code">추천인 코드 *</Label>
              <Input
                id="referral_code"
                value={form.referral_code}
                onChange={e => setForm(f => ({ ...f, referral_code: e.target.value.toUpperCase() }))}
                onBlur={handleCodeBlur}
                className="font-mono uppercase"
                required
              />
              {partnerName && (
                <p className="text-sm text-[#2F7D4A]">파트너: {partnerName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pilot_started_at">파일럿 시작일 *</Label>
              <Input id="pilot_started_at" type="date" value={form.pilot_started_at} onChange={e => setForm(f => ({ ...f, pilot_started_at: e.target.value }))} required />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "저장 중..." : "저장"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
