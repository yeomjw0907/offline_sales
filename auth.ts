import NextAuth from "next-auth"
import Kakao from "next-auth/providers/kakao"
import { createClient } from "@/lib/db/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
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

    async jwt({ token, account, profile }) {
      if (account?.provider === "kakao") {
        token.kakaoId = String(
          (profile as { id?: unknown })?.id ?? account.providerAccountId
        )
      }
      return token
    },

    async session({ session, token }) {
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
