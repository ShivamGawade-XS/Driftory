"use client"
import { useState } from "react"
import AlternativesPanel from "./AlternativesPanel"

interface SpotData {
  name: string
  placeId?: string | null
  coordinates?: { lat: number; lng: number } | null
  verified: boolean
  type: string
  vibe: string[]
  bestTime: string
  estimatedDuration: number
  estimatedCost: { min: number; max: number }
  alternatives?: any[]
  communityVerdicts?: any[]
}

interface VibeCardProps {
  spot: SpotData
  index: number
}

const TYPE_ICONS: Record<string, string> = {
  beach: "🏖️",
  cafe: "☕",
  nightlife: "🎵",
  viewpoint: "⛰️",
  hidden_gem: "⭐",
  other: "📍",
}

export default function VibeCard({ spot, index }: VibeCardProps) {
  const [showAlternatives, setShowAlternatives] = useState(false)

  const latestVerdict = spot.communityVerdicts && spot.communityVerdicts.length > 0
    ? spot.communityVerdicts[spot.communityVerdicts.length - 1]
    : null

  const verdictLabels: Record<string, string> = {
    open: "✓ Still open",
    worth_it: "✓ Worth it",
    overcrowded: "⚠ Overcrowded",
    closed: "✗ Closed",
  }

  return (
    <div
      className="card hover:-translate-y-0.5 group"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "slideUp 0.5s ease-out both",
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Step number */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: "#0F9B8E" }}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg" style={{ color: "var(--text-heading)" }}>
              {spot.name}
            </h3>
            <span className="text-lg" title={spot.type}>
              {TYPE_ICONS[spot.type] || TYPE_ICONS.other}
            </span>
          </div>
        </div>

        {/* Verification badge */}
        {spot.verified ? (
          <span
            className="badge text-xs font-medium"
            style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}
          >
            ✓ Verified
          </span>
        ) : (
          <span
            className="badge text-xs font-medium"
            style={{ backgroundColor: "rgba(232,89,60,0.1)", color: "#E8593C" }}
            aria-label="Location not confirmed — verify before visiting"
          >
            ⚠ Unconfirmed
          </span>
        )}
      </div>

      {/* Unverified warning */}
      {!spot.verified && (
        <div
          className="mb-3 px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "rgba(232,89,60,0.08)", color: "#E8593C" }}
        >
          Location unconfirmed — verify before visiting.
        </div>
      )}

      {/* Vibe chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(spot.vibe || []).map((v) => (
          <span
            key={v}
            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: "#0F9B8E" }}
          >
            {v}
          </span>
        ))}
      </div>

      {/* Info row */}
      <div className="flex flex-wrap items-center gap-4 text-sm mb-3" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1">
          <span style={{ color: "#F59E0B" }}>🕐</span> {spot.bestTime}
        </span>
        <span>{spot.estimatedDuration} min</span>
        {(spot.estimatedCost.min > 0 || spot.estimatedCost.max > 0) && (
          <span className="font-medium" style={{ color: "var(--text-heading)" }}>
            ₹{spot.estimatedCost.min}{spot.estimatedCost.max > spot.estimatedCost.min ? ` – ₹${spot.estimatedCost.max}` : ""}
          </span>
        )}
        {spot.estimatedCost.min === 0 && spot.estimatedCost.max === 0 && (
          <span className="font-medium" style={{ color: "#10B981" }}>Free</span>
        )}
      </div>

      {/* Latest community verdict */}
      {latestVerdict && (
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Last verified {new Date(latestVerdict.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
          {" — "}{verdictLabels[latestVerdict.verdict] || latestVerdict.verdict}
        </div>
      )}

      {/* Alternatives toggle */}
      {spot.alternatives && spot.alternatives.length > 0 && (
        <div>
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: "#0F9B8E" }}
            id={`driftory-alt-toggle-${index}`}
          >
            🌿 Lesser-known alternatives {showAlternatives ? "▴" : "▾"}
          </button>
          <AlternativesPanel
            alternatives={spot.alternatives}
            isOpen={showAlternatives}
          />
        </div>
      )}
    </div>
  )
}
