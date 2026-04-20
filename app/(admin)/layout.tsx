import { requireAdmin } from "@/lib/auth/session"
import Link from "next/link"
import { signOut } from "@/auth"

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/partners", label: "파트너 관리" },
  { href: "/admin/performance", label: "실적 관리" },
  { href: "/admin/settlements", label: "정산 관리" },
  { href: "/admin/materials", label: "영업자료" },
]

const superAdminItems = [
  { href: "/admin/team", label: "팀 관리" },
  { href: "/admin/logs", label: "로그" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  const isSuperAdmin = session.user.role === "super_admin"

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-white border-r border-[#E9E7E1] fixed inset-y-0">
        <div className="p-5 border-b border-[#E9E7E1]">
          <p className="font-semibold text-[#191917] text-sm">ReadyTalk</p>
          <p className="text-xs text-[#8A867D] mt-0.5">관리자</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm text-[#5F5B53] rounded-[8px] hover:bg-[#F7F7F5] hover:text-[#191917] transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {isSuperAdmin && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-xs text-[#8A867D]">최고관리자</p>
              </div>
              {superAdminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm text-[#5F5B53] rounded-[8px] hover:bg-[#F7F7F5] hover:text-[#191917] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-[#E9E7E1]">
          <p className="text-xs text-[#8A867D] px-3 mb-2 truncate">{session.user.email ?? session.user.name}</p>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-sm text-[#5F5B53] rounded-[8px] hover:bg-[#F7F7F5] hover:text-[#191917] transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 inset-x-0 z-10 bg-white border-b border-[#E9E7E1] px-4 h-12 flex items-center justify-between">
        <span className="font-semibold text-sm text-[#191917]">ReadyTalk 관리자</span>
        <details className="relative">
          <summary className="cursor-pointer text-sm text-[#5F5B53] list-none px-2 py-1 rounded hover:bg-[#F7F7F5]">메뉴</summary>
          <div className="absolute right-0 top-full mt-1 bg-white border border-[#E9E7E1] rounded-[10px] shadow-modal min-w-[160px] py-1 z-20">
            {[...navItems, ...(isSuperAdmin ? superAdminItems : [])].map((item) => (
              <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-[#5F5B53] hover:bg-[#F7F7F5]">
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56 p-6 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  )
}
