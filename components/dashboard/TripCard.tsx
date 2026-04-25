import Link from "next/link"

interface TripCardProps {
  trip: {
    _id: string
    title: string
    from: string
    to: string
    travelDate: string
    transport: Array<{ name: string; price: number; type: string }>
    hotels: Array<{ name: string; pricePerNight: number }>
    shareToken?: string
    createdAt: string
  }
}

export default function TripCard({ trip }: TripCardProps) {
  const totalCost =
    trip.transport.reduce((sum, t) => sum + t.price, 0) +
    trip.hotels.reduce((sum, h) => sum + h.pricePerNight, 0)

  const formattedDate = new Date(trip.travelDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="card hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-surface-900 text-lg truncate">{trip.title}</h3>
          <p className="text-surface-500 text-sm mt-1">
            {trip.from} → {trip.to} • {formattedDate}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-primary-600">₹{totalCost}</div>
        </div>
      </div>

      {/* summary */}
      <div className="flex flex-wrap gap-2 mt-3">
        {trip.transport.map((t, i) => (
          <span key={i} className={t.type === "train" ? "badge-train" : "badge-bus"}>
            {t.type === "train" ? "🚆" : "🚌"} {t.name}
          </span>
        ))}
        {trip.hotels.map((h, i) => (
          <span key={i} className="badge-hotel">🏨 {h.name}</span>
        ))}
      </div>

      {/* actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-100">
        {trip.shareToken && (
          <Link
            href={`/shared/${trip.shareToken}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Shared →
          </Link>
        )}
        <span className="flex-1" />
        <span className="text-xs text-surface-400">
          Saved {new Date(trip.createdAt).toLocaleDateString("en-IN")}
        </span>
      </div>
    </div>
  )
}
