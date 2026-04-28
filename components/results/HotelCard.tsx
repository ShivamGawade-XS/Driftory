import { HotelResult } from "@/lib/api"

interface HotelCardProps {
  hotel: HotelResult
  onSelect?: (hotel: HotelResult) => void
}

export default function HotelCard({ hotel, onSelect }: HotelCardProps) {
  return (
    <div className="card hover:-translate-y-0.5 group overflow-hidden">
      {/* image */}
      <div className="relative h-40 -mx-6 -mt-6 mb-4 bg-surface-100 overflow-hidden">
        {hotel.imageUrl ? (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-purple-100 to-purple-200">
            🏨
          </div>
        )}
        <span className="badge-hotel absolute top-3 left-3">Hotel</span>
      </div>

      {/* details */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-surface-900 text-lg truncate">{hotel.name}</h3>
          <p className="text-sm text-surface-500 mb-1">{hotel.provider}</p>
          <p className="text-sm text-surface-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {hotel.location}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-primary-600">₹{hotel.pricePerNight}</div>
          <div className="text-xs text-surface-500">per night</div>
          {hotel.rating > 0 && (
            <div className="flex items-center gap-1 text-sm text-surface-500 mt-1 justify-end">
              <span className="text-amber-500">★</span> {hotel.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      {/* amenities */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities.slice(0, 4).map((a) => (
            <span key={a} className="px-2 py-0.5 bg-surface-50 text-surface-600 text-xs rounded-md">
              {a}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="px-2 py-0.5 text-surface-400 text-xs">+{hotel.amenities.length - 4} more</span>
          )}
        </div>
      )}

      {/* select button */}
      {onSelect && (
        <button onClick={() => onSelect(hotel)} className="btn-primary w-full mt-4 text-sm py-2">
          Select Hotel
        </button>
      )}
    </div>
  )
}
