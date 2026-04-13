import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")

  if (isPublic) return NextResponse.next()

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = session.user.role

  // Super-admin only
  if (
    pathname.startsWith("/admin/team") ||
    pathname.startsWith("/admin/logs")
  ) {
    if (role !== "super_admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  // Admin area
  if (pathname.startsWith("/admin")) {
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/partner", req.url))
    }
  }

  // Partner area
  if (pathname.startsWith("/partner")) {
    if (role !== "partner") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
