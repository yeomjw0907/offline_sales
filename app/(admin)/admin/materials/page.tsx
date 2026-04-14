"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { InlineStatus } from "@/components/ui/InlineStatus"

interface Material {
  id: string; title: string; type: "link" | "file" | "note"
  url: string | null; description: string | null
  is_published: boolean; sort_order: number
}

const typeLabels = { link: "링크", file: "파일", note: "노트" }

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", type: "link" as Material["type"], url: "", description: "", sort_order: "0" })
  const [file, setFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ id: string; type: "toggle" | "delete" } | null>(null)

  const load = () => {
    fetch("/api/materials").then(r => r.json()).then(d => setMaterials(d.data ?? []))
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (id: string, is_published: boolean) => {
    setPendingAction({ id, type: "toggle" })
    try {
      await fetch(`/api/materials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !is_published }),
      })
      load()
    } finally {
      setPendingAction(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return
    setPendingAction({ id, type: "delete" })
    try {
      await fetch(`/api/materials/${id}`, { method: "DELETE" })
      load()
    } finally {
      setPendingAction(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)

    let nextUrl = form.url
    if (form.type === "file") {
      if (!file) {
        setFormError("파일 유형은 업로드할 파일을 선택해 주세요.")
        setSaving(false)
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/materials/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json().catch(() => ({}))
        setFormError(uploadData.error ?? "파일 업로드 중 오류가 발생했습니다.")
        setSaving(false)
        return
      }

      const uploadData = await uploadRes.json()
      nextUrl = uploadData.url
    }

    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, url: nextUrl, sort_order: parseInt(form.sort_order) }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setFormError(data.error ?? "자료 저장 중 오류가 발생했습니다.")
      setSaving(false)
      return
    }

    setSaving(false)
    setShowForm(false)
    setForm({ title: "", type: "link", url: "", description: "", sort_order: "0" })
    setFile(null)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#191917]">영업자료 관리</h1>
        <Button onClick={() => setShowForm(v => !v)} variant={showForm ? "outline" : "default"}>
          {showForm ? "취소" : "+ 자료 추가"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>새 자료 추가</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              {formError && (
                <InlineStatus message={formError} tone="error" className="text-sm" />
              )}
              <div className="space-y-1.5">
                <Label>제목 *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>유형</Label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Material["type"] }))}
                  className="h-10 w-full rounded-[10px] border border-[#E9E7E1] bg-white px-3 text-sm">
                  <option value="link">링크</option>
                  <option value="file">파일</option>
                  <option value="note">노트</option>
                </select>
              </div>
              {form.type === "file" ? (
                <div className="space-y-1.5">
                  <Label>파일 업로드 *</Label>
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label>{form.type === "note" ? "노트 내용" : "URL"}</Label>
                  <Input
                    value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    placeholder={form.type === "note" ? "노트 텍스트를 입력하세요" : "https://"}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>설명</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>정렬 순서</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
              </div>
              <LoadingButton type="submit" loading={saving} loadingText="저장 중...">저장</LoadingButton>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E9E7E1] bg-[#F7F7F5]">
                {["제목", "유형", "설명", "순서", "공개", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8A867D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E1]">
              {materials.map(m => (
                <tr key={m.id} className="hover:bg-[#F7F7F5]">
                  <td className="px-4 py-3 font-medium text-[#191917]">{m.title}</td>
                  <td className="px-4 py-3"><Badge variant="default">{typeLabels[m.type]}</Badge></td>
                  <td className="px-4 py-3 text-[#5F5B53] max-w-[200px] truncate">{m.description ?? "-"}</td>
                  <td className="px-4 py-3 text-[#8A867D]">{m.sort_order}</td>
                  <td className="px-4 py-3">
                    <LoadingButton
                      onClick={() => handleToggle(m.id, m.is_published)}
                      loading={pendingAction?.id === m.id && pendingAction.type === "toggle"}
                      loadingText="처리 중..."
                      size="sm"
                      className={m.is_published ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}
                    >
                      {m.is_published ? "공개" : "비공개"}
                    </LoadingButton>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <LoadingButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(m.id)}
                      loading={pendingAction?.id === m.id && pendingAction.type === "delete"}
                      loadingText="삭제 중..."
                      className="text-[#C94C4C] hover:text-[#C94C4C]"
                    >
                      삭제
                    </LoadingButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
