"use client"
import { useEffect, useState } from "react"
import { getSharedItinerary } from "@/lib/api"
import Spinner from "@/components/ui/Spinner"
import ErrorCard from "@/components/ui/ErrorCard"

interface SharedItinerary {
  title: string
  from: string
  to: string
  travelDate: string
  transport: Array<{ type: string; name: string; provider: string; departureTime: string; arrivalTime: string; duration: string; price: number }>
  hotels: Array<{ name: string; provider: string; pricePerNight: number; rating: number; location: string }>
}

export default function SharedItineraryPage({ params }: { params: { token: string } }) {
  const [itinerary, setItinerary] = useState<SharedItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSharedItinerary(params.token)
      .then(setItinerary)
      .catch(() => setError("This shared itinerary was not found or may have been deleted."))
      .finally(() => setLoading(false))
  }, [params.token])

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>
  if (error) return <div className="max-w-2xl mx-auto px-4 py-16"><ErrorCard message={error} /></div>
  if (!itinerary) return null

  const totalCost =
    itinerary.transport.reduce((s, t) => s + t.price, 0) +
    itinerary.hotels.reduce((s, h) => s + h.pricePerNight, 0)

  const formattedDate = new Date(itinerary.travelDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
          🔗 Shared Itinerary
        </div>
        <h1 className="text-3xl font-bold text-surface-900">{itinerary.title}</h1>
        <p className="text-surface-500 mt-2">{itinerary.from} → {itinerary.to} • {formattedDate}</p>
        <div className="text-2xl font-bold gradient-text mt-2">₹{totalCost} total</div>
      </div>

      {/* transport */}
      {itinerary.transport.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-3">🚆 Transport</h2>
          <div className="space-y-3">
            {itinerary.transport.map((t, i) => (
              <div key={i} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={t.type === "train" ? "badge-train" : "badge-bus"}>
                      {t.type === "train" ? "Train" : "Bus"}
                    </span>
                    <h3 className="font-semibold text-surface-900 mt-1">{t.name}</h3>
                    <p className="text-sm text-surface-500">{t.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">₹{t.price}</div>
                    <div className="text-sm text-surface-500">{t.departureTime} - {t.arrivalTime}</div>
                    <div className="text-xs text-surface-400">{t.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* hotels */}
      {itinerary.hotels.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-surface-900 mb-3">🏨 Hotels</h2>
          <div className="space-y-3">
            {itinerary.hotels.map((h, i) => (
              <div key={i} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-surface-900">{h.name}</h3>
                    <p className="text-sm text-surface-500">{h.provider} • {h.location}</p>
                    {h.rating > 0 && <span className="text-sm text-amber-500">★ {h.rating}</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">₹{h.pricePerNight}</div>
                    <div className="text-xs text-surface-500">per night</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
