"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ReelDescriptor from "@/components/driftory/ReelDescriptor"
import VibeCard from "@/components/driftory/VibeCard"
import RouteMap from "@/components/driftory/RouteMap"
import CreatorAttribution from "@/components/driftory/CreatorAttribution"

interface RouteData {
  title: string
  coastline: string
  vibeProfile: string[]
  totalDuration: number
  totalBudget: { min: number; max: number }
  spots: any[]
  creatorHandle?: string | null
  creatorVerified?: boolean
  shareToken?: string
  _id?: string
}

export default function DriftoryClient() {
  const [route, setRoute] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    if (!route) return
    setSaving(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("tripsathi_token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const res = await fetch("/api/driftory/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(route),
      })

      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setShareToken(data.shareToken)
        setTimeout(() => setSaved(false), 5000)
      }
    } catch {
      // silently fail for demo
    } finally {
      setSaving(false)
    }
  }

  const handleBookTransport = () => {
    if (!route) return
    router.push(`/search?to=${encodeURIComponent(route.coastline)}&type=transport`)
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const remaining = mins % 60
    if (hours === 0) return `${remaining}min`
    if (remaining === 0) return `${hours}h`
    return `${hours}h ${remaining}min`
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-body)" }}>
      {/* Hero strip */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,155,142,0.08) 0%, transparent 50%, rgba(245,158,11,0.05) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <span
              className="text-xs font-bold uppercase tracking-widest block mb-3"
              style={{ color: "#0F9B8E" }}
            >
              Driftory
            </span>
            <h1
              className="font-display mb-3"
              style={{ color: "var(--text-heading)" }}
            >
              From creator stories to real-world coastal journeys.
            </h1>
            <p className="text-base" style={{ color: "var(--text-muted)" }}>
              Describe what you saw in a reel — we'll build you a verified, mapped experience route.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Input panel */}
          <div className="lg:col-span-2">
            <ReelDescriptor
              onResult={setRoute}
              onError={setError}
              onLoading={setLoading}
            />
          </div>

          {/* Right: Route output */}
          <div className="lg:col-span-3">
            {error && (
              <div
                className="rounded-xl p-4 mb-4 text-sm"
                style={{
                  backgroundColor: "rgba(232,89,60,0.08)",
                  color: "#E8593C",
                }}
              >
                {error}
              </div>
            )}

            {loading && !route && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card">
                    <div className="skeleton h-6 w-3/4 rounded mb-3" />
                    <div className="skeleton h-4 w-1/2 rounded mb-2" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                  </div>
                ))}
              </div>
            )}

            {route && (
              <div className="space-y-4 animate-fade-in">
                {/* Route header card */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: "#0F9B8E" }}>🌊</span>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "#0F9B8E" }}
                    >
                      Experience Route
                    </span>
                  </div>
                  <h2 className="mb-2" style={{ color: "var(--text-heading)" }}>
                    {route.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                    <span>📍 {route.coastline}</span>
                    <span>⏱ {formatDuration(route.totalDuration)}</span>
                    <span>
                      💰 ₹{route.totalBudget.min}
                      {route.totalBudget.max > route.totalBudget.min
                        ? ` – ₹${route.totalBudget.max}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(route.vibeProfile || []).map((v) => (
                      <span
                        key={v}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: "#0F9B8E" }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Creator attribution */}
                <CreatorAttribution
                  handle={route.creatorHandle}
                  verified={route.creatorVerified}
                />

                {/* Map */}
                <div className="card !p-0 overflow-hidden">
                  <RouteMap spots={route.spots} />
                </div>

                {/* Spot cards */}
                {route.spots.map((spot, i) => (
                  <VibeCard key={i} spot={spot} index={i} />
                ))}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`btn-primary flex items-center gap-2 text-sm ${
                      saved ? "!bg-green-600" : ""
                    }`}
                    style={
                      !saved
                        ? { background: "linear-gradient(135deg, #0F9B8E, #0d8377)" }
                        : {}
                    }
                    id="driftory-save"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      "✓ Saved to your TripSathi dashboard"
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save to TripSathi
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBookTransport}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    id="driftory-book"
                  >
                    🚆 Book transport and stay
                  </button>

                  {shareToken && (
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/driftory/route/${shareToken}`
                        navigator.clipboard.writeText(url)
                      }}
                      className="btn-secondary flex items-center gap-2 text-sm"
                      id="driftory-share"
                    >
                      🔗 Copy share link
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!route && !loading && !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌊</div>
                <h3 className="mb-2" style={{ color: "var(--text-heading)" }}>
                  Describe a creator reel
                </h3>
                <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
                  Paste a caption, pick the coastline, select your vibe — and we'll turn it into a verified experience route with map, timing, and budget.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
