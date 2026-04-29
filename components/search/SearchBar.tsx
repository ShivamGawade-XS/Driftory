"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import CityInput from "./CityInput"
import DatePicker from "./DatePicker"
import { useLanguage } from "@/context/LanguageContext"

export default function SearchBar() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const { t } = useLanguage()

  const handleSearch = () => {
    if (!from || !to) return
    const params = new URLSearchParams({ from, to })
    if (date) params.set("date", date)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <CityInput
          label={t("search_placeholder_from")}
          placeholder={t("search_placeholder_from")}
          value={from}
          onChange={setFrom}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        {/* swap button */}
        <div className="flex items-end pb-1">
          <button
            onClick={() => { const temp = from; setFrom(to); setTo(temp) }}
            className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors"
            aria-label="Swap cities"
          >
            <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        <CityInput
          label={t("search_placeholder_to")}
          placeholder={t("search_placeholder_to")}
          value={to}
          onChange={setTo}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <DatePicker label={t("search_placeholder_date")} value={date} onChange={setDate} />

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={!from || !to}
            className="btn-primary w-full lg:w-auto whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t("search_button")}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
