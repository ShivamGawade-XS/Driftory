"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import VibeCard from "@/components/driftory/VibeCard"
import RouteMap from "@/components/driftory/RouteMap"
import CreatorAttribution from "@/components/driftory/CreatorAttribution"

export default function SharedRoutePage() {
  const params = useParams()
  const [route, setRoute] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(`/api/driftory/shared/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setRoute(data.route)
        } else {
          setError(data.message || "Route not found")
        }
      } catch {
        setError("Failed to load route")
      } finally {
        setLoading(false)
      }
    }
    fetchRoute()
  }, [params.id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-3/4 rounded mb-3" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🌊</div>
        <h2 style={{ color: "var(--text-heading)" }}>Route not found</h2>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    )
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const remaining = mins % 60
    if (hours === 0) return `${remaining}min`
    if (remaining === 0) return `${hours}h`
    return `${hours}h ${remaining}min`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-4 animate-fade-in">
        {/* Route header */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: "#0F9B8E" }}>🌊</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0F9B8E" }}>
              Shared Experience Route
            </span>
          </div>
          <h1 className="mb-2" style={{ color: "var(--text-heading)" }}>
            {route.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            <span>📍 {route.coastline}</span>
            <span>⏱ {formatDuration(route.totalDuration)}</span>
            <span>
              💰 ₹{route.totalBudget?.min || 0}
              {(route.totalBudget?.max || 0) > (route.totalBudget?.min || 0)
                ? ` – ₹${route.totalBudget.max}`
                : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(route.vibeProfile || []).map((v: string) => (
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

        {/* Creator */}
        <CreatorAttribution handle={route.creatorHandle} verified={route.creatorVerified} />

        {/* Map */}
        <div className="card !p-0 overflow-hidden">
          <RouteMap spots={route.spots || []} />
        </div>

        {/* Spots */}
        {(route.spots || []).map((spot: any, i: number) => (
          <VibeCard key={i} spot={spot} index={i} />
        ))}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const url = window.location.href
              navigator.clipboard.writeText(url)
            }}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            🔗 Copy share link
          </button>
        </div>
      </div>
    </div>
  )
}
