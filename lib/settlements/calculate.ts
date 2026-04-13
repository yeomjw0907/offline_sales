const AMOUNT_PER_CASE = 20_000
const WITHHOLDING_RATE = 0.033

export interface SettlementCalculation {
  totalCases: number
  grossAmount: number
  withholdingTaxAmount: number
  netAmount: number
}

export function calculateSettlement(caseCount: number): SettlementCalculation {
  const grossAmount = caseCount * AMOUNT_PER_CASE
  const withholdingTaxAmount = Math.floor(grossAmount * WITHHOLDING_RATE)
  const netAmount = grossAmount - withholdingTaxAmount

  return {
    totalCases: caseCount,
    grossAmount,
    withholdingTaxAmount,
    netAmount,
  }
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getCurrentSettlementMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function getPreviousSettlementMonth(): string {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`
}
