"use client"
import { useState, useEffect } from "react"

export default function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + Math.random() * 25 + 5
      })
    }, 120)
    const timeout = setTimeout(() => setLoading(false), 900)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{
        background: "var(--bg-body)",
        transition: "opacity 0.5s ease",
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? "none" : "auto",
      }}>
      <div className="flex flex-col items-center gap-6">
        {/* Spinning logo icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full"
            style={{
              background: "var(--gradient-primary)",
              animation: "spin 1s linear infinite",
              opacity: 0.2,
            }} />
          <div className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg-body)" }}>
            <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
              <path d="M40 70C60 70 75 55 75 35C75 15 60 0 40 0C20 0 5 15 5 35C5 55 20 70 40 70Z" fill="url(#lo1)" />
              <path d="M20 45L40 25L60 45" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 25V65" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <defs>
                <linearGradient id="lo1" x1="5" y1="0" x2="75" y2="70" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" /><stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-card)" }}>
          <div className="h-full rounded-full" style={{
            width: `${Math.min(progress, 100)}%`,
            background: "var(--gradient-primary)",
            transition: "width 0.3s ease",
          }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Loading TripSathi...</p>
      </div>
    </div>
  )
}
