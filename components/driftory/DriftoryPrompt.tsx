"use client"
import { useState } from "react"
import Link from "next/link"

interface DriftoryPromptProps {
  destination: string
}

export default function DriftoryPrompt({ destination }: DriftoryPromptProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="rounded-xl p-4 mt-4 border relative animate-fade-in"
      style={{
        backgroundColor: "rgba(15,155,142,0.06)",
        borderColor: "rgba(15,155,142,0.2)",
      }}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-3 text-lg opacity-40 hover:opacity-80 transition-opacity"
        style={{ color: "var(--text-muted)" }}
        aria-label="Dismiss Driftory prompt"
      >
        ×
      </button>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: "#0F9B8E" }}>🌊</span>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0F9B8E" }}>
          Driftory
        </span>
      </div>
      <p className="text-sm mb-3" style={{ color: "var(--text-body)" }}>
        Planning your <strong>{destination}</strong> experience? Let Driftory build your coastal route from a creator reel.
      </p>
      <Link
        href={`/driftory?destination=${encodeURIComponent(destination)}`}
        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ backgroundColor: "#0F9B8E" }}
      >
        Build Experience Route →
      </Link>
    </div>
  )
}
