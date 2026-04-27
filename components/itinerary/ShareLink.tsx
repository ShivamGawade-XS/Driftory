"use client"
import { useState } from "react"

interface ShareLinkProps {
  shareToken: string | null
}

export default function ShareLink({ shareToken }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)

  if (!shareToken) return null

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/shared/${shareToken}`
    : `/shared/${shareToken}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const input = document.createElement("input")
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-3 py-2 bg-surface-50 rounded-lg text-sm text-surface-600 truncate border border-surface-200">
        {shareUrl}
      </div>
      <button
        onClick={handleCopy}
        className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5 whitespace-nowrap"
      >
        {copied ? (
          <>✓ Copied</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}
