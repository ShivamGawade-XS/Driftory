"use client"
import { useState } from "react"
import DriftoryPrompt from "@/components/driftory/DriftoryPrompt"

interface SaveButtonProps {
  onSave: () => Promise<void>
  disabled?: boolean
  destination?: string
}

export default function SaveButton({ onSave, disabled, destination }: SaveButtonProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // error handled by parent
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSave}
        disabled={disabled || saving}
        className={`btn-primary text-sm py-2 px-6 flex items-center gap-2 ${saved ? "bg-green-600 hover:bg-green-700" : ""}`}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>✓ Saved!</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save Trip
          </>
        )}
      </button>
      {saved && destination && <DriftoryPrompt destination={destination} />}
    </>
  )
}
