"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
  _id: string
  name: string
  email: string
  language: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("tripsathi_user") : null
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("tripsathi_token")
    localStorage.removeItem("tripsathi_user")
    window.dispatchEvent(new Event("auth-change"))
    router.push("/")
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-surface-900 mb-3">Not signed in</h1>
        <p className="text-surface-500 mb-6">Please sign in to view your profile.</p>
        <Link href="/login" className="btn-primary">Login</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Profile</h1>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-900">{user.name}</h2>
            <p className="text-surface-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-surface-100 pt-6">
          <div className="flex justify-between items-center">
            <span className="text-surface-600">Language</span>
            <span className="font-medium text-surface-900">
              {user.language === "hi" ? "हिंदी" : "English"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-surface-600">Member since</span>
            <span className="font-medium text-surface-900">2026</span>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-surface-100">
          <Link href="/dashboard" className="btn-secondary flex-1 text-center">
            My Trips
          </Link>
          <button onClick={handleLogout} className="btn-primary bg-red-600 hover:bg-red-700 shadow-red-600/25 flex-1">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
