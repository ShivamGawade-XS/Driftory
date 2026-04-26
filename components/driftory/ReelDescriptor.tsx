"use client"
import { useState, KeyboardEvent } from "react"

interface ReelDescriptorProps {
  onResult: (route: any) => void
  onError: (error: string) => void
  onLoading: (loading: boolean) => void
}

const COASTLINES = ["North Goa", "South Goa", "Konkan", "Varkala", "Other"]

const VIBE_OPTIONS = [
  "chill", "moderate", "party",
  "sunrise", "daytime", "sunset", "night",
  "hidden", "local", "tourist",
  "beach", "shack", "rooftop",
]

export default function ReelDescriptor({ onResult, onError, onLoading }: ReelDescriptorProps) {
  const [caption, setCaption] = useState("")
  const [description, setDescription] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState("")
  const [coastline, setCoastline] = useState("North Goa")
  const [vibes, setVibes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addHashtag = (tag: string) => {
    const clean = tag.replace(/^#/, "").trim().toLowerCase()
    if (clean && !hashtags.includes(clean)) {
      setHashtags([...hashtags, clean])
    }
    setHashtagInput("")
  }

  const handleHashtagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && hashtagInput.trim()) {
      e.preventDefault()
      addHashtag(hashtagInput)
    }
    if (e.key === "Backspace" && !hashtagInput && hashtags.length > 0) {
      setHashtags(hashtags.slice(0, -1))
    }
  }

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag))
  }

  const toggleVibe = (v: string) => {
    setVibes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
  }

  const handleSubmit = async () => {
    if (!caption.trim()) {
      onError("Please enter a caption or description of the reel.")
      return
    }

    setLoading(true)
    onLoading(true)
    onError("")

    try {
      const res = await fetch("/api/driftory/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, description, hashtags, coastline, vibes }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Analysis failed")
      }

      onResult(data.route)
    } catch (err: any) {
      onError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
      onLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0F9B8E" }}>
          Describe what you saw
        </span>
      </div>

      {/* Caption */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-heading)" }}>
          Reel Caption / Description *
        </label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Paste the reel caption or describe what you saw..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          id="driftory-caption"
        />
      </div>

      {/* Additional Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-heading)" }}>
          What did you see? (optional)
        </label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder="Describe the spots, the vibe, the sequence..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="driftory-description"
        />
      </div>

      {/* Hashtags */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-heading)" }}>
          Hashtags (optional)
        </label>
        <div className="input-field flex flex-wrap gap-2 items-center !p-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: "#0F9B8E" }}
            >
              #{tag}
              <button
                onClick={() => removeHashtag(tag)}
                className="ml-0.5 hover:opacity-70 text-white/80"
                aria-label={`Remove hashtag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
            placeholder="Type + enter to add"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            style={{ color: "var(--text-heading)" }}
            id="driftory-hashtag-input"
          />
        </div>
      </div>

      {/* Coastline Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-heading)" }}>
          Coastline *
        </label>
        <select
          className="input-field"
          value={coastline}
          onChange={(e) => setCoastline(e.target.value)}
          id="driftory-coastline"
        >
          {COASTLINES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Vibe Chips */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-heading)" }}>
          Vibe
        </label>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              role="checkbox"
              aria-checked={vibes.includes(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                vibes.includes(v)
                  ? "text-white border-transparent scale-105 shadow-sm"
                  : "border-current opacity-60 hover:opacity-100"
              }`}
              style={
                vibes.includes(v)
                  ? { backgroundColor: "#0F9B8E", borderColor: "#0F9B8E" }
                  : { color: "var(--text-muted)" }
              }
              id={`driftory-vibe-${v}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !caption.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          !loading
            ? { background: "linear-gradient(135deg, #0F9B8E, #0d8377)" }
            : { background: "linear-gradient(135deg, #0F9B8E, #0d8377)", opacity: 0.7 }
        }
        id="driftory-submit"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>🌊 Extract Experience Route</>
        )}
      </button>
    </div>
  )
}
