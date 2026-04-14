export interface PayoutAccountInput {
  bank_name: string
  account_holder_name: string
  account_number: string
}

export function validatePayoutAccountInput(raw: unknown): { ok: true; value: PayoutAccountInput } | { ok: false; field?: string } {
  if (!raw || typeof raw !== "object") return { ok: false }
  const body = raw as Record<string, unknown>
  const value: PayoutAccountInput = {
    bank_name: String(body.bank_name ?? "").trim(),
    account_holder_name: String(body.account_holder_name ?? "").trim(),
    account_number: String(body.account_number ?? "").replace(/\D/g, ""),
  }

  if (!value.bank_name) return { ok: false, field: "bank_name" }
  if (!value.account_holder_name) return { ok: false, field: "account_holder_name" }
  if (!value.account_number || value.account_number.length < 8) return { ok: false, field: "account_number" }
  return { ok: true, value }
}

export function validateSettlementMonth(month: string) {
  return /^\d{4}-\d{2}$/.test(month)
}
