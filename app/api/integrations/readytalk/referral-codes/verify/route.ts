import { NextRequest } from "next/server"
import {
  authenticateReadyTalkRequest,
  findActivePartnerByReferralCode,
} from "@/lib/integrations/readytalk"
import { createRequestTraceId, logTraceError, tracedJson } from "@/lib/db/request-trace"
import { validateReadyTalkReferralCodeVerifyInput } from "@/lib/validation/readytalk"

export async function POST(req: NextRequest) {
  const requestId = createRequestTraceId()
  const authResult = authenticateReadyTalkRequest(req)
  if (!authResult.ok) {
    return tracedJson(
      requestId,
      { code: authResult.code, error: authResult.error },
      { status: authResult.status }
    )
  }

  const body = await req.json().catch(() => null)
  const validated = validateReadyTalkReferralCodeVerifyInput(body)
  if (!validated.ok) {
    return tracedJson(
      requestId,
      { code: "invalidInput", error: "Invalid verification request.", field: validated.field },
      { status: 400 }
    )
  }

  try {
    const partner = await findActivePartnerByReferralCode(validated.value.code)
    if (!partner) {
      return tracedJson(
        requestId,
        {
          data: {
            valid: false,
            code: validated.value.code,
            reason: "not_found_or_inactive",
          },
        },
        { status: 200 }
      )
    }

    return tracedJson(
      requestId,
      {
        data: {
          valid: true,
          code: partner.referralCode,
          partnerId: partner.partnerProfileId,
          partnerName: partner.partnerName,
          partnerEmail: partner.partnerEmail,
          status: partner.partnerStatus,
          approvedAt: partner.approvedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logTraceError(requestId, "readytalk.verify", error)
    return tracedJson(
      requestId,
      { code: "unknown", error: "Failed to verify referral code." },
      { status: 500 }
    )
  }
}
