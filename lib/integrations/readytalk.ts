import { timingSafeEqual } from "crypto"
import { NextRequest } from "next/server"
import { createClient } from "@/lib/db/client"

export const READYTALK_PROVIDER = "readytalk"
export const READYTALK_PILOT_STARTED_EVENT = "pilot_started"

type ReadyTalkAuthResult =
  | { ok: true }
  | { ok: false; status: number; code: string; error: string }

export interface ReadyTalkPartnerMatch {
  partnerProfileId: string
  partnerUserId: string
  referralCode: string
  partnerStatus: "active"
  partnerName: string | null
  partnerEmail: string | null
  approvedAt: string | null
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

function getPresentedApiKey(req: NextRequest) {
  const headerKey = req.headers.get("x-api-key")?.trim()
  if (headerKey) return headerKey

  const authHeader = req.headers.get("authorization")?.trim()
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim()
  }

  return null
}

export function authenticateReadyTalkRequest(req: NextRequest): ReadyTalkAuthResult {
  const configuredApiKey = process.env.READYTALK_API_KEY?.trim()
  if (!configuredApiKey) {
    return {
      ok: false,
      status: 500,
      code: "integrationNotConfigured",
      error: "ReadyTalk integration is not configured.",
    }
  }

  const presentedApiKey = getPresentedApiKey(req)
  if (!presentedApiKey) {
    return {
      ok: false,
      status: 401,
      code: "missingApiKey",
      error: "Missing ReadyTalk API key.",
    }
  }

  if (!safeCompare(configuredApiKey, presentedApiKey)) {
    return {
      ok: false,
      status: 401,
      code: "invalidApiKey",
      error: "Invalid ReadyTalk API key.",
    }
  }

  return { ok: true }
}

export function getReadyTalkSystemUserId() {
  const systemUserId = process.env.READYTALK_SYSTEM_USER_ID?.trim()
  if (!systemUserId) {
    return {
      ok: false as const,
      status: 500,
      code: "integrationNotConfigured",
      error: "ReadyTalk system user is not configured.",
    }
  }

  return { ok: true as const, value: systemUserId }
}

export async function findActivePartnerByReferralCode(
  rawReferralCode: string
): Promise<ReadyTalkPartnerMatch | null> {
  const referralCode = rawReferralCode.trim().toUpperCase()
  const supabase = createClient("service")

  const { data: partner, error: partnerError } = await supabase
    .from("partner_profiles")
    .select("id, user_id, referral_code, status, approved_at")
    .eq("referral_code", referralCode)
    .eq("status", "active")
    .maybeSingle()

  if (partnerError) {
    throw new Error(partnerError.message)
  }

  if (!partner || !partner.referral_code) return null

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", partner.user_id)
    .maybeSingle()

  if (userError) {
    throw new Error(userError.message)
  }

  return {
    partnerProfileId: partner.id,
    partnerUserId: partner.user_id,
    referralCode: partner.referral_code,
    partnerStatus: "active",
    partnerName: user?.name ?? null,
    partnerEmail: user?.email ?? null,
    approvedAt: partner.approved_at,
  }
}
