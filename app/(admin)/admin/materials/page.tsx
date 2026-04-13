"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch("/api/materials").then(r => r.json()).then(d => setMaterials(d.data ?? []))
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (id: string, is_published: boolean) => {
    await fetch(`/api/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !is_published }),
    })
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return
    await fetch(`/api/materials/${id}`, { method: "DELETE" })
    load()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sort_order: parseInt(form.sort_order) }),
    })
    setSaving(false)
    setShowForm(false)
    setForm({ title: "", type: "link", url: "", description: "", sort_order: "0" })
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
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" />
              </div>
              <div className="space-y-1.5">
                <Label>설명</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>정렬 순서</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
              </div>
              <Button type="submit" disabled={saving}>{saving ? "저장 중..." : "저장"}</Button>
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
                    <button onClick={() => handleToggle(m.id, m.is_published)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${m.is_published ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                      {m.is_published ? "공개" : "비공개"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(m.id)} className="text-[#C94C4C] hover:text-[#C94C4C]">삭제</Button>
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
