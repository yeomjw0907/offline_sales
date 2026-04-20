export interface ReadyTalkReferralCodeVerifyInput {
  code: string
}

export interface ReadyTalkPilotStartedInput {
  eventId: string
  merchantExternalId: string
  referralCode: string
  pilotStartedAt: string
  storeName: string
  contactPhone: string
  region: string
}

export function validateReadyTalkReferralCodeVerifyInput(
  raw: unknown
): { ok: true; value: ReadyTalkReferralCodeVerifyInput } | { ok: false; field?: string } {
  if (!raw || typeof raw !== "object") return { ok: false }

  const body = raw as Record<string, unknown>
  const value = {
    code: String(body.code ?? "").trim().toUpperCase(),
  }

  if (!value.code || !/^[A-Z0-9]{4,12}$/.test(value.code)) {
    return { ok: false, field: "code" }
  }

  return { ok: true, value }
}

export function validateReadyTalkPilotStartedInput(
  raw: unknown
): { ok: true; value: ReadyTalkPilotStartedInput } | { ok: false; field?: string } {
  if (!raw || typeof raw !== "object") return { ok: false }

  const body = raw as Record<string, unknown>
  const value = {
    eventId: String(body.eventId ?? "").trim(),
    merchantExternalId: String(body.merchantExternalId ?? "").trim(),
    referralCode: String(body.referralCode ?? "").trim().toUpperCase(),
    pilotStartedAt: String(body.pilotStartedAt ?? "").trim(),
    storeName: String(body.storeName ?? "").trim(),
    contactPhone: String(body.contactPhone ?? "").trim(),
    region: String(body.region ?? "").trim(),
  }

  if (!value.eventId) return { ok: false, field: "eventId" }
  if (!value.merchantExternalId) return { ok: false, field: "merchantExternalId" }
  if (!value.referralCode || !/^[A-Z0-9]{4,12}$/.test(value.referralCode)) {
    return { ok: false, field: "referralCode" }
  }
  if (!value.pilotStartedAt || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value.pilotStartedAt)) {
    return { ok: false, field: "pilotStartedAt" }
  }
  if (!value.storeName) return { ok: false, field: "storeName" }
  if (!value.contactPhone) return { ok: false, field: "contactPhone" }
  if (!value.region) return { ok: false, field: "region" }

  return { ok: true, value }
}
