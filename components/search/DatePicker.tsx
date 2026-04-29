"use client"

interface DatePickerProps {
  label: string
  value: string
  onChange: (date: string) => void
}

export default function DatePicker({ label, value, onChange }: DatePickerProps) {
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-surface-600 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <input
          type="date"
          value={value}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-10"
        />
      </div>
    </div>
  )
}
