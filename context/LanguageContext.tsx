"use client"
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { Locale, locales, defaultLocale } from "@/lib/i18n"

type Translations = Record<string, string>

interface LanguageContextType {
  locale: Locale
  t: (key: string) => string
  setLocale: (locale: Locale) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLocale,
  t: (key: string) => key,
  setLocale: () => {},
  isLoading: false,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadTranslations = useCallback(async (loc: Locale) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/locales/${loc}/common.json`)
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setTranslations(data)
    } catch {
      // Fallback to English
      try {
        const res = await fetch("/locales/en/common.json")
        const data = await res.json()
        setTranslations(data)
      } catch {
        setTranslations({})
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Load saved locale from localStorage
    const saved = localStorage.getItem("tripsathi-locale") as Locale | null
    const initial = saved && locales.includes(saved) ? saved : defaultLocale
    setLocaleState(initial)
    loadTranslations(initial)
  }, [loadTranslations])

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc)
    localStorage.setItem("tripsathi-locale", loc)
    loadTranslations(loc)
    // Update html lang attribute
    document.documentElement.lang = loc
  }, [loadTranslations])

  const t = useCallback((key: string): string => {
    return translations[key] || key
  }, [translations])

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
