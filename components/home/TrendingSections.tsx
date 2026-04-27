"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

interface TrendingPkg {
  id: string; slug: string; title: string; destination: string; category: string
  duration: { days: number; nights: number }; price: { original: number; discounted: number }
  rating: number; reviewCount: number; coverImage: string; groupDeal: boolean; seasonal: boolean
}

export default function TrendingSections() {
  const [data, setData] = useState<{ seasonal: TrendingPkg[]; groupDeals: TrendingPkg[]; topRated: TrendingPkg[] }>({ seasonal: [], groupDeals: [], topRated: [] })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/packages/trending`)
      .then(r => r.json()).then(setData).catch(() => {})
  }, [])

  const renderCards = (pkgs: TrendingPkg[], badge: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pkgs.map(pkg => {
        const discount = Math.round(((pkg.price.original - pkg.price.discounted) / pkg.price.original) * 100)
        return (
          <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1" style={{ background: "var(--bg-card)" }}>
            <div className="relative h-44 overflow-hidden">
              <img src={pkg.coverImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">{badge}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-surface-800 group-hover:text-primary-600 transition-colors line-clamp-1">{pkg.title}</h3>
              <p className="text-surface-400 text-sm mt-1">{pkg.duration.days}D/{pkg.duration.nights}N • {pkg.destination}</p>
              <div className="flex items-end justify-between mt-3">
                <div>
                  <span className="text-surface-400 text-xs line-through">₹{pkg.price.original.toLocaleString()}</span>
                  <span className="block text-xl font-bold text-primary-600">₹{pkg.price.discounted.toLocaleString()}</span>
                </div>
                <span className="text-green-600 text-xs font-bold">{discount}% OFF</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )

  if (!data.seasonal.length && !data.groupDeals.length && !data.topRated.length) return null

  return (
    <div className="space-y-16">
      {data.seasonal.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-surface-800">🔥 Seasonal Hot Deals</h2>
              <p className="text-surface-500 mt-1">Limited-time offers for this season</p>
            </div>
            <Link href="/packages?seasonal=true" className="text-primary-600 hover:underline text-sm font-medium">View All →</Link>
          </div>
          {renderCards(data.seasonal, "🔥 Season Special")}
        </section>
      )}

      {data.groupDeals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-surface-800">👥 Group Deals</h2>
              <p className="text-surface-500 mt-1">Save more when you travel together</p>
            </div>
            <Link href="/packages?groupDeal=true" className="text-primary-600 hover:underline text-sm font-medium">View All →</Link>
          </div>
          {renderCards(data.groupDeals, "👥 Group Deal")}
        </section>
      )}

      {data.topRated.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-surface-800">⭐ Top Rated Packages</h2>
              <p className="text-surface-500 mt-1">Loved by our travelers</p>
            </div>
            <Link href="/packages?sort=rating" className="text-primary-600 hover:underline text-sm font-medium">View All →</Link>
          </div>
          {renderCards(data.topRated, "⭐ Top Rated")}
        </section>
      )}
    </div>
  )
}
