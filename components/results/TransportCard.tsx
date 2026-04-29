import { TransportResult } from "@/lib/api"

interface TransportCardProps {
  result: TransportResult
  onSelect?: (result: TransportResult) => void
}

export default function TransportCard({ result, onSelect }: TransportCardProps) {
  const isTrain = result.type === "train"

  return (
    <div className="card hover:-translate-y-0.5 group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* type badge + name */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={isTrain ? "badge-train" : "badge-bus"}>
              {isTrain ? "🚆 Train" : "🚌 Bus"}
            </span>
            {result.class && (
              <span className="badge bg-surface-100 text-surface-600">{result.class}</span>
            )}
          </div>
          <h3 className="font-semibold text-surface-900 text-lg">{result.name}</h3>
          <p className="text-sm text-surface-500">{result.provider}</p>
        </div>

        {/* timing */}
        <div className="flex items-center gap-3 text-center">
          <div>
            <div className="font-bold text-surface-900">{result.departureTime}</div>
            <div className="text-xs text-surface-500">{result.from}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs text-surface-400">{result.duration}</div>
            <div className="w-20 h-px bg-surface-300 relative">
              <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-primary-500" />
            </div>
          </div>
          <div>
            <div className="font-bold text-surface-900">{result.arrivalTime}</div>
            <div className="text-xs text-surface-500">{result.to}</div>
          </div>
        </div>

        {/* price + action */}
        <div className="text-right flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-primary-600">₹{result.price}</div>
          {result.rating > 0 && (
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <span className="text-amber-500">★</span> {result.rating.toFixed(1)}
            </div>
          )}
          {onSelect && (
            <button
              onClick={() => onSelect(result)}
              className="btn-primary text-sm py-1.5 px-4"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
