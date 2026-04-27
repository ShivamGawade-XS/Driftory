"use client"
import { useState } from "react"
import { TransportResult, HotelResult } from "@/lib/api"
import TransportCard from "@/components/results/TransportCard"
import HotelCard from "@/components/results/HotelCard"

interface ItineraryItem {
  transport: TransportResult | null
  hotel: HotelResult | null
}

interface ItineraryBuilderProps {
  from: string
  to: string
  date?: string
  selectedTransport?: TransportResult | null
  selectedHotel?: HotelResult | null
  onSave?: (itinerary: ItineraryItem) => void
}

export default function ItineraryBuilder({ from, to, date, selectedTransport = null, selectedHotel = null, onSave }: ItineraryBuilderProps) {
  const [transport, setTransport] = useState<TransportResult | null>(selectedTransport)
  const [hotel, setHotel] = useState<HotelResult | null>(selectedHotel)

  const totalCost = (transport?.price || 0) + (hotel?.pricePerNight || 0)

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-surface-900">My Itinerary</h2>
          <p className="text-sm text-surface-500">{from} → {to}{date ? ` • ${date}` : ""}</p>
        </div>
        {totalCost > 0 && (
          <div className="text-right">
            <div className="text-sm text-surface-500">Total</div>
            <div className="text-2xl font-bold gradient-text">₹{totalCost}</div>
          </div>
        )}
      </div>

      {/* transport slot */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-surface-600 mb-2">🚆 Transport</h3>
        {transport ? (
          <div className="relative">
            <TransportCard result={transport} />
            <button
              onClick={() => setTransport(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center text-surface-400">
            Select a transport option from results
          </div>
        )}
      </div>

      {/* hotel slot */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-surface-600 mb-2">🏨 Hotel</h3>
        {hotel ? (
          <div className="relative">
            <HotelCard hotel={hotel} />
            <button
              onClick={() => setHotel(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center text-surface-400">
            Select a hotel from results
          </div>
        )}
      </div>

      {/* save button */}
      {(transport || hotel) && onSave && (
        <button
          onClick={() => onSave({ transport, hotel })}
          className="btn-primary w-full"
        >
          Save Itinerary
        </button>
      )}
    </div>
  )
}
