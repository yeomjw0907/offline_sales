export interface PerformanceInput {
  store_name: string
  contact_phone: string
  region: string
  referral_code: string
  pilot_started_at: string
}

export function validatePerformanceInput(raw: unknown): { ok: true; value: PerformanceInput } | { ok: false; field?: string } {
  if (!raw || typeof raw !== "object") return { ok: false }
  const body = raw as Record<string, unknown>
  const value: PerformanceInput = {
    store_name: String(body.store_name ?? "").trim(),
    contact_phone: String(body.contact_phone ?? "").trim(),
    region: String(body.region ?? "").trim(),
    referral_code: String(body.referral_code ?? "").trim().toUpperCase(),
    pilot_started_at: String(body.pilot_started_at ?? "").trim(),
  }

  if (!value.store_name) return { ok: false, field: "store_name" }
  if (!value.contact_phone) return { ok: false, field: "contact_phone" }
  if (!value.region) return { ok: false, field: "region" }
  if (!value.referral_code || !/^[A-Z0-9]{4,12}$/.test(value.referral_code)) return { ok: false, field: "referral_code" }
  if (!value.pilot_started_at || !/^\d{4}-\d{2}-\d{2}$/.test(value.pilot_started_at)) return { ok: false, field: "pilot_started_at" }

  return { ok: true, value }
}
