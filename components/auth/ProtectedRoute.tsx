"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Spinner from "@/components/ui/Spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("driftory_token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const token = typeof window !== "undefined" ? localStorage.getItem("driftory_token") : null

  if (!token) {
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
