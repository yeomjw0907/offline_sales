export const ERROR_MESSAGES = {
  unknown: "오류가 발생했습니다.",
  network: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  unauthorized: "로그인이 필요합니다.",
  forbidden: "권한이 없습니다.",
  invalidInput: "입력값을 확인해 주세요.",
  duplicate: "동일한 데이터가 이미 존재합니다.",
  saveFailed: "저장에 실패했습니다.",
  deleteFailed: "삭제에 실패했습니다.",
  suspendFailed: "파트너 정지 처리에 실패했습니다.",
} as const

export function getErrorMessage(code?: string, fallback?: string) {
  if (!code) return fallback ?? ERROR_MESSAGES.unknown
  return (ERROR_MESSAGES as Record<string, string>)[code] ?? fallback ?? ERROR_MESSAGES.unknown
}
