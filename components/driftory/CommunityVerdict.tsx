"use client"
import { useState } from "react"

interface CommunityVerdictProps {
  spotName: string
  routeId: string
  spotIndex: number
  onSubmit?: () => void
}

const VERDICTS = [
  { key: "open", label: "Still open", icon: "✓", color: "#10B981" },
  { key: "worth_it", label: "Worth it", icon: "✓", color: "#0F9B8E" },
  { key: "overcrowded", label: "Overcrowded", icon: "✗", color: "#F59E0B" },
  { key: "closed", label: "Closed", icon: "✗", color: "#E8593C" },
]

export default function CommunityVerdict({ spotName, routeId, spotIndex, onSubmit }: CommunityVerdictProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selected) return

    setSubmitting(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("driftory_token") : null
      await fetch("/api/driftory/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ routeId, spotIndex, verdict: selected, note }),
      })
      setSubmitted(true)
      onSubmit?.()
    } catch {
      // silently fail for demo
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-3">
        <p className="text-sm" style={{ color: "#10B981" }}>
          ✓ Thanks for your verdict on {spotName}!
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: "var(--bg-card-hover)",
        borderColor: "var(--border-card)",
      }}
    >
      <p className="text-sm font-medium mb-3" style={{ color: "var(--text-heading)" }}>
        Did you visit {spotName}?
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {VERDICTS.map((v) => (
          <button
            key={v.key}
            onClick={() => setSelected(v.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              selected === v.key
                ? "text-white border-transparent shadow-sm"
                : "border-current opacity-50 hover:opacity-100"
            }`}
            style={
              selected === v.key
                ? { backgroundColor: v.color, borderColor: v.color }
                : { color: v.color }
            }
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>
      <textarea
        className="input-field text-sm !py-2 mb-3 resize-none"
        placeholder="Add a note (optional, 100 chars max)"
        maxLength={100}
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={!selected || submitting}
        className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
        style={{ backgroundColor: "#0F9B8E" }}
      >
        {submitting ? "Submitting..." : "Submit Verdict"}
      </button>
    </div>
  )
}
