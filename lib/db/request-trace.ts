import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

export function createRequestTraceId() {
  return randomUUID()
}

export function tracedJson(traceId: string, body: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(
    { ...body, requestId: traceId },
    {
      ...init,
      headers: {
        "x-request-id": traceId,
        ...(init?.headers ?? {}),
      },
    }
  )
}

export function logTraceError(traceId: string, context: string, error: unknown, extra?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[${context}] requestId=${traceId} error=${message}`, extra ?? {})
}
