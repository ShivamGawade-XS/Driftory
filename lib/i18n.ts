export type Locale = "en" | "hi" | "ta" | "te" | "mr"

export const defaultLocale: Locale = "en"

export const locales: Locale[] = ["en", "hi", "ta", "te", "mr"]

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்",
  te: "తెలుగు",
  mr: "मराठी",
}

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
  ta: "🇮🇳",
  te: "🇮🇳",
  mr: "🇮🇳",
}

// load translations for a given locale
export async function getTranslations(locale: Locale) {
  try {
    const translations = await import(`../public/locales/${locale}/common.json`)
    return translations.default
  } catch {
    const fallback = await import("../public/locales/en/common.json")
    return fallback.default
  }
}

// simple translation helper
export function createTranslator(translations: Record<string, string>) {
  return function t(key: string): string {
    return translations[key] || key
  }
}