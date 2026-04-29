"use client"

interface SortFilterProps {
  sortBy: string
  onSortChange: (sort: string) => void
  activeTab: "transport" | "hotels"
  onTabChange: (tab: "transport" | "hotels") => void
  transportCount: number
  hotelCount: number
}

export default function SortFilter({ sortBy, onSortChange, activeTab, onTabChange, transportCount, hotelCount }: SortFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* tabs */}
      <div className="flex bg-surface-100 rounded-xl p-1">
        <button
          onClick={() => onTabChange("transport")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "transport"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-surface-500 hover:text-surface-700"
          }`}
        >
          🚆 Transport ({transportCount})
        </button>
        <button
          onClick={() => onTabChange("hotels")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "hotels"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-surface-500 hover:text-surface-700"
          }`}
        >
          🏨 Hotels ({hotelCount})
        </button>
      </div>

      {/* sort dropdown */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-surface-500">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-surface-200 bg-white text-sm text-surface-700 focus:outline-none focus:border-primary-400"
        >
          <option value="price">Price</option>
          <option value="duration">Duration</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  )
}
