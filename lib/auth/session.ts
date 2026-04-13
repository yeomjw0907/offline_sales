import { auth } from "@/auth"
import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/db/types"

export async function getSession() {
  return auth()
}

export async function requireAuth() {
  const session = await auth()
  if (!session) redirect("/login")
  return session
}

export async function requireRole(...roles: UserRole[]) {
  const session = await requireAuth()
  if (!roles.includes(session.user.role)) {
    redirect(session.user.role === "partner" ? "/partner" : "/admin")
  }
  return session
}

export async function requireAdmin() {
  return requireRole("admin", "super_admin")
}

export async function requireSuperAdmin() {
  return requireRole("super_admin")
}

export async function requirePartner() {
  return requireRole("partner")
}
