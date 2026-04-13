import type { UserRole } from "@/lib/db/types"

export function canApprovePartner(role: UserRole) {
  return role === "admin" || role === "super_admin"
}

export function canEditPerformance(role: UserRole) {
  return role === "admin" || role === "super_admin"
}

export function canManageSettlements(role: UserRole) {
  return role === "admin" || role === "super_admin"
}

export function canOverrideAttribution(role: UserRole) {
  return role === "super_admin"
}

export function canManageAdmins(role: UserRole) {
  return role === "super_admin"
}

export function canRegenerateReferralCode(role: UserRole) {
  return role === "super_admin"
}

export function canAccessLogs(role: UserRole) {
  return role === "super_admin"
}
