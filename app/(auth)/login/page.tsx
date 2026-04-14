"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { InlineStatus } from "@/components/ui/InlineStatus"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleKakaoLogin() {
    if (isLoading) return
    setError(null)
    setIsLoading(true)
    try {
      await signIn("kakao", { callbackUrl: "/partner" })
    } catch {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-8 flex flex-col items-center gap-6">
        <div className="w-full">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-0 text-[#5F5B53]"
            onClick={() => router.back()}
          >
            ← 뒤로가기
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#191917] mb-1">
            파트너 로그인
          </h1>
          <p className="text-sm text-[#5F5B53]">
            카카오 계정으로 간편하게 시작하세요
          </p>
        </div>

        <LoadingButton
          onClick={handleKakaoLogin}
          loading={isLoading}
          loadingText="로그인 중..."
          className="w-full bg-[#FEE500] hover:bg-[#F5D900] text-[#191917] disabled:opacity-70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.477 2 11c0 2.943 1.646 5.533 4.157 7.11L5.1 21.5l4.08-2.69C9.7 18.93 10.84 19 12 19c5.523 0 10-3.477 10-8S17.523 3 12 3z" />
          </svg>
          카카오로 로그인
        </LoadingButton>
        {isLoading && (
          <InlineStatus message="카카오 인증 화면으로 이동 중입니다..." tone="neutral" className="w-full text-center" />
        )}
        {error && (
          <InlineStatus message={error} tone="error" className="w-full text-center" />
        )}

        <p className="text-xs text-[#8A867D] text-center leading-relaxed">
          로그인하면{" "}
          <a href="/terms" className="underline">이용약관</a>과{" "}
          <a href="/privacy" className="underline">개인정보처리방침</a>에
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </main>
  )
}
