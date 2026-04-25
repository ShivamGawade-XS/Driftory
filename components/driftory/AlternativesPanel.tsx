"use client"

interface Alternative {
  name: string
  placeId?: string | null
  coordinates?: { lat: number; lng: number } | null
  reason?: string
  crowdLevel?: string
}

interface AlternativesPanelProps {
  alternatives: Alternative[]
  isOpen: boolean
}

const CROWD_COLORS: Record<string, { bg: string; text: string }> = {
  hidden: { bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  local: { bg: "rgba(15,155,142,0.1)", text: "#0F9B8E" },
  tourist: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  crowded: { bg: "rgba(232,89,60,0.1)", text: "#E8593C" },
}

export default function AlternativesPanel({ alternatives, isOpen }: AlternativesPanelProps) {
  return (
    <div
      className="overflow-hidden transition-all duration-200 ease-out"
      style={{
        maxHeight: isOpen ? `${alternatives.length * 120 + 20}px` : "0px",
        opacity: isOpen ? 1 : 0,
        marginTop: isOpen ? "12px" : "0px",
      }}
    >
      <div className="space-y-2">
        {alternatives.map((alt, i) => {
          const crowdStyle = CROWD_COLORS[alt.crowdLevel || "local"] || CROWD_COLORS.local
          return (
            <div
              key={i}
              className="rounded-xl p-3 border transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-card-hover)",
                borderColor: "var(--border-card)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm" style={{ color: "var(--text-heading)" }}>
                  {alt.name}
                </span>
                {alt.crowdLevel && (
                  <span
                    className="badge text-xs"
                    style={{ backgroundColor: crowdStyle.bg, color: crowdStyle.text }}
                  >
                    {alt.crowdLevel}
                  </span>
                )}
              </div>
              {alt.reason && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {alt.reason}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
