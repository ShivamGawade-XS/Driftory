interface ComparisonBannerProps {
  savings: number
  from: string
  to: string
}

export default function ComparisonBanner({ savings, from, to }: ComparisonBannerProps) {
  if (savings <= 0) return null

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
          💰
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            Save up to ₹{savings} on {from} → {to}
          </h3>
          <p className="text-green-100 text-sm mt-0.5">
            Book transport + hotel together for the best bundle price
          </p>
        </div>
      </div>
    </div>
  )
}
