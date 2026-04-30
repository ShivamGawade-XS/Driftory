"use client"
import { useRef, useState, useEffect } from "react"
import { locales, localeNames, localeFlags } from "@/lib/i18n"
import { useLanguage } from "@/context/LanguageContext"

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 transition-all duration-200 text-sm font-medium text-surface-700"
        aria-label="Change language"
      >
        <span className="text-base">{localeFlags[locale]}</span>
        <span>{localeNames[locale]}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-surface-200 overflow-hidden z-50 min-w-[160px] animate-slide-down">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-surface-50 transition-colors ${
                l === locale ? "bg-primary-50 text-primary-700 font-bold" : "text-surface-600"
              }`}
            >
              <span>{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
              {l === locale && <span className="ml-auto text-primary-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
