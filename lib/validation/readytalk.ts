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
  linkedChannel?: ReadyTalkChannel
}

export const READYTALK_CHANNELS = [
  "kakao_talk",
  "instagram_dm",
  "naver_talktalk",
  "website_widget",
] as const

export type ReadyTalkChannel = (typeof READYTALK_CHANNELS)[number]

function normalizeChannel(raw: unknown): ReadyTalkChannel | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined
  const value = String(raw).trim().toLowerCase().replace(/[-\s]/g, "_")
  return (READYTALK_CHANNELS as readonly string[]).includes(value)
    ? (value as ReadyTalkChannel)
    : undefined
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
  const value: ReadyTalkPilotStartedInput = {
    eventId: String(body.eventId ?? "").trim(),
    merchantExternalId: String(body.merchantExternalId ?? "").trim(),
    referralCode: String(body.referralCode ?? "").trim().toUpperCase(),
    pilotStartedAt: String(body.pilotStartedAt ?? "").trim(),
    storeName: String(body.storeName ?? "").trim(),
    contactPhone: String(body.contactPhone ?? "").trim(),
    region: String(body.region ?? "").trim(),
    linkedChannel: normalizeChannel(body.linkedChannel),
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

export const READYTALK_LIFECYCLE_EVENT_TYPES = [
  "signup_completed",
  "trial_requested",
  "channel_linked",
  "activated",
] as const

export type ReadyTalkLifecycleEventType = (typeof READYTALK_LIFECYCLE_EVENT_TYPES)[number]

export interface ReadyTalkLifecycleInput {
  eventType: ReadyTalkLifecycleEventType
  eventId: string
  merchantExternalId: string
  referralCode: string
  storeName: string | undefined
  contactPhone: string
  region: string | undefined
  occurredAt: string
  channel?: ReadyTalkChannel
}

export function validateReadyTalkLifecycleInput(
  raw: unknown
): { ok: true; value: ReadyTalkLifecycleInput } | { ok: false; field?: string } {
  if (!raw || typeof raw !== "object") return { ok: false }

  const body = raw as Record<string, unknown>
  const eventType = String(body.eventType ?? "").trim() as ReadyTalkLifecycleEventType
  if (!(READYTALK_LIFECYCLE_EVENT_TYPES as readonly string[]).includes(eventType)) {
    return { ok: false, field: "eventType" }
  }

  const channel = normalizeChannel(body.channel)
  if (eventType === "channel_linked" && !channel) {
    return { ok: false, field: "channel" }
  }

  const value: ReadyTalkLifecycleInput = {
    eventType,
    eventId: String(body.eventId ?? "").trim(),
    merchantExternalId: String(body.merchantExternalId ?? "").trim(),
    referralCode: String(body.referralCode ?? "").trim().toUpperCase(),
    storeName: String(body.storeName ?? "").trim(),
    contactPhone: String(body.contactPhone ?? "").trim(),
    region: String(body.region ?? "").trim(),
    occurredAt: String(body.occurredAt ?? "").trim(),
    channel,
  }

  if (!value.eventId) return { ok: false, field: "eventId" }
  if (!value.merchantExternalId) return { ok: false, field: "merchantExternalId" }
  if (!value.referralCode || !/^[A-Z0-9]{4,12}$/.test(value.referralCode)) {
    return { ok: false, field: "referralCode" }
  }
  // signup_completed fires before the store is created — storeName/region are
  // not yet available and must be tolerated as empty for this event only.
  const requireStoreFields = eventType !== "signup_completed"
  if (requireStoreFields && !value.storeName) return { ok: false, field: "storeName" }
  if (!value.contactPhone) return { ok: false, field: "contactPhone" }
  if (requireStoreFields && !value.region) return { ok: false, field: "region" }
  if (!value.occurredAt || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value.occurredAt)) {
    return { ok: false, field: "occurredAt" }
  }

  return { ok: true, value }
}
