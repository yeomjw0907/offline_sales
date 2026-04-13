import NextAuth from "next-auth"
import Kakao from "next-auth/providers/kakao"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@/lib/db/client"

function getAdminCredentialEntries() {
  const multi = String(process.env.ADMIN_LOGIN_ACCOUNTS ?? "").trim()
  const parsed = multi
    .split(/[,\n;]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf(":")
      if (separator <= 0) return null
      const email = entry.slice(0, separator).trim().toLowerCase()
      const password = entry.slice(separator + 1)
      if (!email || !password) return null
      return { email, password }
    })
    .filter((entry): entry is { email: string; password: string } => entry !== null)

  if (parsed.length > 0) return parsed

  const singleEmail = String(process.env.ADMIN_LOGIN_EMAIL ?? "")
    .trim()
    .toLowerCase()
  const singlePassword = String(process.env.ADMIN_LOGIN_PASSWORD ?? "")
  if (!singleEmail || !singlePassword) return []
  return [{ email: singleEmail, password: singlePassword }]
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Vercel 등 배포 환경에서 호스트/시크릿 추론 실패 시 CSRF·providers가 500이 되는 것을 방지
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")
        const adminEntries = getAdminCredentialEntries()
        const matchedAdmin = adminEntries.find((admin) => admin.email === email)

        if (!matchedAdmin) return null
        if (password !== matchedAdmin.password) return null

        return {
          id: `admin-local:${matchedAdmin.email}`,
          name: "관리자",
          email: matchedAdmin.email,
          role: "admin",
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "admin-credentials") return true
      if (account?.provider !== "kakao") return false

      const supabase = createClient("service")
      const kakaoId = String(
        (profile as { id?: unknown })?.id ?? account.providerAccountId
      )

      const { error } = await supabase.from("users").upsert(
        {
          kakao_id: kakaoId,
          name: (profile as { nickname?: string })?.nickname ?? null,
          email: (profile as { kakao_account?: { email?: string } })
            ?.kakao_account?.email ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "kakao_id" }
      )

      if (error) {
        console.error("[auth] upsert user failed:", error.message)
        return false
      }

      return true
    },

    async jwt({ token, account, profile, user }) {
      if (account?.provider === "admin-credentials") {
        token.role = "admin"
        token.kakaoId = undefined
        token.sub = user?.id ?? token.sub
        return token
      }

      if (account?.provider === "kakao") {
        token.kakaoId = String(
          (profile as { id?: unknown })?.id ?? account.providerAccountId
        )
      }
      return token
    },

    async session({ session, token }) {
      if (!token.kakaoId) {
        if (token.sub) session.user.id = token.sub
        session.user.role = (token.role as "admin" | "super_admin" | "partner") ?? "partner"
        return session
      }

      if (token.kakaoId) {
        const supabase = createClient("service")
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, role")
          .eq("kakao_id", token.kakaoId as string)
          .single()

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.kakaoId = token.kakaoId as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
