"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginApi } from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await loginApi(email, password)
      localStorage.setItem("tripsathi_token", data.token)
      localStorage.setItem("tripsathi_user", JSON.stringify(data))
      window.dispatchEvent(new Event("auth-change"))
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">TS</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">{t("login_title")}</h1>
          <p className="text-surface-500 mt-2">{t("login_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">{t("email_label")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">{t("password_label")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-50"
          >
            {loading ? "..." : t("nav_login")}
          </button>

          <p className="text-center text-sm text-surface-500 mt-4">
            {t("login_no_account") || "Don\u0027t have an account?"}{" "}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              {t("nav_register")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
