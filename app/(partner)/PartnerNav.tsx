"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Home, BookOpen, Wallet, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/partner", label: "홈", icon: Home },
  { href: "/partner/materials", label: "자료", icon: BookOpen },
  { href: "/partner/settlement", label: "정산", icon: Wallet },
  { href: "/partner/profile", label: "프로필", icon: User },
]

export default function PartnerNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 bg-white border-b border-[#E9E7E1] items-center px-6">
        <span className="font-semibold text-[#191917] text-base mr-8 shrink-0">
          ReadyTalk 파트너
        </span>
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map(({ href, label }) => {
            const active =
              href === "/partner" ? pathname === "/partner" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-[10px] text-sm font-medium transition-colors",
                  active
                    ? "bg-[#191917] text-white"
                    : "text-[#5F5B53] hover:bg-[#F7F7F5] hover:text-[#191917]"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-sm text-[#8A867D] hover:text-[#191917] transition-colors min-h-[44px] px-2"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E9E7E1] flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/partner" ? pathname === "/partner" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] text-[10px] font-medium transition-colors",
                active ? "text-[#191917]" : "text-[#8A867D]"
              )}
            >
              <Icon className={cn("w-5 h-5", active ? "stroke-[2.5px]" : "stroke-2")} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
