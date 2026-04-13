import type { DefaultSession } from "next-auth"
import type { UserRole } from "@/lib/db/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      kakaoId: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    kakaoId?: string
  }
}
