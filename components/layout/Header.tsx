"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import LanguageToggle from "@/components/ui/LanguageToggle"
import ThemeToggle from "@/components/ui/ThemeToggle"
import Logo from "@/components/ui/Logo"
import { useLanguage } from "@/context/LanguageContext"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{name: string} | null>(null)

  const checkUser = () => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("driftory_user") : null
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    checkUser()
    window.addEventListener("auth-change", checkUser)
    return () => window.removeEventListener("auth-change", checkUser)
  }, [])
  
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {pathname !== "/" && (
              <button 
                onClick={() => router.back()} 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-surface-900 transition-colors"
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Logo className="h-10 sm:h-12 w-auto drop-shadow-sm" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm">{t("nav_home")}</Link>
            <Link href="/search" className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm">Transport & Stays</Link>
            <Link href="/packages" className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm">Curated Packages</Link>
            <Link href="/dashboard" className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm">{t("nav_saved")}</Link>
            <Link href="/faq" className="text-surface-600 hover:text-primary-600 font-medium transition-colors text-sm">{t("nav_help") || "Help"}</Link>
            <ThemeToggle />
            <LanguageToggle />
            {user ? (
              <Link href="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold ml-2 shadow-sm hover:scale-105 transition-transform">
                {user.name.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm py-2 px-4">{t("nav_login")}</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">{t("nav_register")}</Link>
              </>
            )}
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors" aria-label="Toggle menu">
            <svg className="w-6 h-6 text-surface-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 rounded-lg text-surface-600 hover:bg-surface-100" onClick={() => setMenuOpen(false)}>{t("nav_home")}</Link>
              <Link href="/search" className="px-4 py-2 rounded-lg text-surface-600 hover:bg-surface-100" onClick={() => setMenuOpen(false)}>Transport & Stays</Link>
              <Link href="/packages" className="px-4 py-2 rounded-lg text-surface-600 hover:bg-surface-100" onClick={() => setMenuOpen(false)}>Curated Packages</Link>
              <Link href="/dashboard" className="px-4 py-2 rounded-lg text-surface-600 hover:bg-surface-100" onClick={() => setMenuOpen(false)}>{t("nav_saved")}</Link>
              <Link href="/faq" className="px-4 py-2 rounded-lg text-surface-600 hover:bg-surface-100" onClick={() => setMenuOpen(false)}>{t("nav_help") || "Help"}</Link>
              <div className="px-4 py-2 flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              {user ? (
                <div className="px-4 py-2 mt-2 border-t border-surface-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Link href="/profile" className="flex-1 btn-primary text-center" onClick={() => setMenuOpen(false)}>My Profile</Link>
                </div>
              ) : (
                <div className="flex gap-2 mt-2 px-4 pb-2 border-t border-surface-100 pt-4">
                  <Link href="/login" className="btn-secondary text-sm py-2 px-4 flex-1 text-center" onClick={() => setMenuOpen(false)}>{t("nav_login")}</Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-4 flex-1 text-center" onClick={() => setMenuOpen(false)}>{t("nav_register")}</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
