import { requirePartner } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"
import type { PartnerMaterial, MaterialType } from "@/lib/db/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, FileText } from "lucide-react"

const typeConfig: Record<
  MaterialType,
  { label: string; variant: "default" | "active" | "scheduled" }
> = {
  link: { label: "링크", variant: "active" },
  file: { label: "파일", variant: "scheduled" },
  note: { label: "노트", variant: "default" },
}

export default async function MaterialsPage() {
  await requirePartner()

  const supabase = createClient("service")
  const { data: materials } = await supabase
    .from("partner_materials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  const items = (materials ?? []) as PartnerMaterial[]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-[#191917]">파트너 자료</h1>
        <p className="text-sm text-[#8A867D] mt-0.5">영업에 활용할 수 있는 자료입니다.</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="w-10 h-10 text-[#E9E7E1] mx-auto mb-3" />
            <p className="text-sm text-[#8A867D]">등록된 자료가 없습니다.</p>
            <p className="text-xs text-[#8A867D] mt-1">
              관리자가 자료를 등록하면 여기서 확인하실 수 있습니다.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((material) => {
            const config = typeConfig[material.type]
            return (
              <Card key={material.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <h3 className="text-sm font-semibold text-[#191917] truncate">
                          {material.title}
                        </h3>
                      </div>
                      {material.description && (
                        <p className="text-sm text-[#5F5B53] mb-3 leading-relaxed">
                          {material.description}
                        </p>
                      )}

                      {/* Note inline content */}
                      {material.type === "note" && material.url && (
                        <div className="bg-[#F7F7F5] rounded-[10px] p-4 text-sm text-[#5F5B53] leading-relaxed whitespace-pre-wrap">
                          {material.url}
                        </div>
                      )}

                      {/* Link / File action button */}
                      {material.type === "link" && material.url && (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline" className="gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5" />
                            바로가기
                          </Button>
                        </a>
                      )}

                      {material.type === "file" && material.url && (
                        <a href={material.url} download>
                          <Button size="sm" variant="outline" className="gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            다운로드
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
