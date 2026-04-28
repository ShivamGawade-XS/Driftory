"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"

const navItems = [
  { key: "nav_home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { key: "nav_search", href: "/search", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { key: "nav_packages", href: "/packages", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { key: "nav_saved", href: "/dashboard", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
  { key: "nav_profile", href: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-surface-200 safe-area-bottom" style={{ background: "var(--bg-card)", transition: "background 0.4s ease" }}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${pathname === item.href ? "text-primary-600" : "text-surface-400 hover:text-surface-600"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-[10px] font-medium">{t(item.key)}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
