"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    })

    setSubmitting(false)

    if (!result || result.error) {
      setError("이메일 또는 비밀번호를 확인해 주세요.")
      return
    }

    router.push(result.url ?? "/admin")
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[12px] border border-[#E9E7E1] shadow-card p-8 flex flex-col items-center gap-6">
        <div className="w-full">
          <Button asChild type="button" variant="ghost" size="sm" className="px-0 text-[#5F5B53]">
            <Link href="/login">← 파트너 로그인으로</Link>
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#191917] mb-1">관리자 로그인</h1>
          <p className="text-sm text-[#5F5B53]">관리자 계정으로 접속하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-[10px] px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "로그인 중..." : "관리자 로그인"}
          </Button>
        </form>
      </div>
    </main>
  )
}
