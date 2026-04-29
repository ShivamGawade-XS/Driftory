"use client"
import { useState } from "react"
import { SearchResponse, TransportResult, HotelResult } from "@/lib/api"
import TransportCard from "./TransportCard"
import HotelCard from "./HotelCard"
import SortFilter from "./SortFilter"
import ComparisonBanner from "./ComparisonBanner"
import EmptyState from "@/components/ui/EmptyState"

interface ResultsContainerProps {
  data: SearchResponse
  onSelectTransport?: (t: TransportResult) => void
  onSelectHotel?: (h: HotelResult) => void
}

export default function ResultsContainer({ data, onSelectTransport, onSelectHotel }: ResultsContainerProps) {
  const [activeTab, setActiveTab] = useState<"transport" | "hotels">("transport")
  const [sortBy, setSortBy] = useState("price")

  const sortedTransport = [...data.transport].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

  const sortedHotels = [...data.hotels].sort((a, b) => {
    if (sortBy === "price") return a.pricePerNight - b.pricePerNight
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

  return (
    <div>
      <ComparisonBanner
        savings={data.savings}
        from={data.meta.from}
        to={data.meta.to}
      />

      <SortFilter
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transportCount={data.transport.length}
        hotelCount={data.hotels.length}
      />

      {activeTab === "transport" && (
        <div className="space-y-4">
          {sortedTransport.length > 0 ? (
            sortedTransport.map((t) => (
              <TransportCard key={t.id} result={t} onSelect={onSelectTransport} />
            ))
          ) : (
            <EmptyState
              title="No transport options found"
              description="Try searching for a different route or date."
            />
          )}
        </div>
      )}

      {activeTab === "hotels" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedHotels.length > 0 ? (
            sortedHotels.map((h) => (
              <HotelCard key={h.id} hotel={h} onSelect={onSelectHotel} />
            ))
          ) : (
            <EmptyState
              title="No hotels found"
              description="Try searching for a different destination."
            />
          )}
        </div>
      )}
    </div>
  )
}
