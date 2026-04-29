"use client"
import { useState, useRef, useEffect } from "react"
import { searchCities } from "@/lib/cities"

interface CityInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (city: string) => void
  icon?: React.ReactNode
}

export default function CityInput({ label, placeholder, value, onChange, icon }: CityInputProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setSuggestions(searchCities(val))
    setShowDropdown(true)
  }

  const handleSelect = (city: string) => {
    setQuery(city)
    onChange(city)
    setShowDropdown(false)
  }

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="block text-sm font-medium text-surface-600 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query) { setSuggestions(searchCities(query)); setShowDropdown(true) } }}
          placeholder={placeholder}
          className={`input-field ${icon ? "pl-10" : ""}`}
        />
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-surface-100 overflow-hidden animate-slide-down">
          {suggestions.map((city) => (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2.5 hover:bg-primary-50 text-surface-700 text-sm transition-colors"
            >
              📍 {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
