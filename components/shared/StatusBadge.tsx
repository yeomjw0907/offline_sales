import { Badge } from "@/components/ui/badge"
import type { PartnerStatus, MerchantLeadStatus, SettlementStatus } from "@/lib/db/types"

const partnerStatusMap: Record<PartnerStatus, { label: string; variant: "pending" | "active" | "inactive" }> = {
  pending: { label: "승인 대기", variant: "pending" },
  active: { label: "활성", variant: "active" },
  inactive: { label: "비활성", variant: "inactive" },
}

const leadStatusMap: Record<MerchantLeadStatus, { label: string; variant: "active" | "scheduled" | "paid" }> = {
  pilot_started: { label: "파일럿 시작", variant: "active" },
  settlement_ready: { label: "정산 예정", variant: "scheduled" },
  paid: { label: "지급 완료", variant: "paid" },
}

const settlementStatusMap: Record<SettlementStatus, { label: string; variant: "scheduled" | "paid" }> = {
  scheduled: { label: "정산 예정", variant: "scheduled" },
  paid: { label: "지급 완료", variant: "paid" },
}

export function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
  const { label, variant } = partnerStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function LeadStatusBadge({ status }: { status: MerchantLeadStatus }) {
  const { label, variant } = leadStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function SettlementStatusBadge({ status }: { status: SettlementStatus }) {
  const { label, variant } = settlementStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}
