"use client"
import { useState } from "react"

interface CreatorAttributionProps {
  handle?: string | null
  verified?: boolean
}

export default function CreatorAttribution({ handle, verified }: CreatorAttributionProps) {
  const [showClaim, setShowClaim] = useState(false)
  const [claimUrl, setClaimUrl] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleClaim = () => {
    if (claimUrl.trim()) {
      setSubmitted(true)
    }
  }

  if (!handle && !showClaim) {
    return (
      <div
        className="rounded-xl p-3 border flex items-center justify-between"
        style={{
          backgroundColor: "var(--bg-card-hover)",
          borderColor: "var(--border-card)",
        }}
      >
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          Route inspired by a creator
        </span>
        <button
          onClick={() => setShowClaim(true)}
          className="text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: "#0F9B8E" }}
          id="driftory-claim-route"
        >
          Claim this route
        </button>
      </div>
    )
  }

  if (showClaim && !handle) {
    return (
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: "var(--bg-card-hover)",
          borderColor: "var(--border-card)",
        }}
      >
        {submitted ? (
          <p className="text-sm text-center" style={{ color: "#10B981" }}>
            ✓ Claim submitted! We'll verify your profile.
          </p>
        ) : (
          <>
            <p className="text-sm mb-2" style={{ color: "var(--text-heading)" }}>
              Claim this route — link your Instagram profile
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                className="input-field flex-1 text-sm !py-2"
                placeholder="https://instagram.com/yourhandle"
                value={claimUrl}
                onChange={(e) => setClaimUrl(e.target.value)}
                id="driftory-claim-url"
              />
              <button
                onClick={handleClaim}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
                style={{ backgroundColor: "#0F9B8E" }}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-3 border flex items-center gap-3"
      style={{
        backgroundColor: "var(--bg-card-hover)",
        borderColor: "var(--border-card)",
      }}
    >
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        Route inspired by
      </span>
      <span className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
        @{handle}
      </span>
      {verified && (
        <span
          className="badge text-xs"
          style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}
        >
          ✓ Verified
        </span>
      )}
    </div>
  )
}
