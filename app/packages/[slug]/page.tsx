"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface DayItem { day: number; title: string; description: string; activities: string[] }
interface ReviewItem { id: string; userName: string; rating: number; title: string; comment: string; travelDate: string; helpful: number }
interface PackageDetail {
  id: string; title: string; slug: string; destination: string; category: string
  duration: { days: number; nights: number }; price: { original: number; discounted: number }
  rating: number; reviewCount: number; maxGroupSize: number; difficulty: string
  coverImage: string; images: string[]; highlights: string[]; itinerary: DayItem[]
  inclusions: string[]; exclusions: string[]; transport: string; startCity: string
  reviews: ReviewItem[]
}

function StarRating({ rating }: { rating: number }) {
  return <span className="text-amber-500">{Array.from({length: 5}, (_, i) => i < Math.round(rating) ? "★" : "☆").join("")}</span>
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((img, i) => (
            <img key={i} src={img} alt={`${title} - image ${i + 1}`} className="w-full h-full object-cover flex-shrink-0" />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{active + 1} / {images.length}</div>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-primary-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

function InteractiveMap({ destination }: { destination: string }) {
  const query = encodeURIComponent(destination + " India")
  return (
    <div className="rounded-2xl overflow-hidden border border-surface-200">
      <div className="bg-surface-100 px-4 py-3 flex items-center gap-2"><span>📍</span><span className="font-medium text-surface-700">Location Map</span></div>
      <iframe src={`https://maps.google.com/maps?q=${query}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
        className="w-full h-64 md:h-80" style={{border:0}} allowFullScreen loading="lazy" title="map" />
    </div>
  )
}

export default function PackageDetailPage() {
  const params = useParams()
  const [pkg, setPkg] = useState<PackageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"itinerary"|"reviews"|"map">("itinerary")
  const [travelers, setTravelers] = useState(2)
  const [travelDate, setTravelDate] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/packages/${params.slug}`)
      .then(r => r.json()).then(d => { setPkg(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>
  if (!pkg) return <div className="min-h-screen flex items-center justify-center"><p className="text-surface-500 text-lg">Package not found</p></div>

  const discount = Math.round(((pkg.price.original - pkg.price.discounted) / pkg.price.original) * 100)
  const totalPrice = pkg.price.discounted * travelers

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/packages" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Back to Packages</Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={pkg.images} title={pkg.title} />
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{pkg.category}</span>
                <span className="bg-surface-100 text-surface-600 text-xs font-medium px-3 py-1 rounded-full">{pkg.duration.days}D/{pkg.duration.nights}N</span>
                <span className="bg-surface-100 text-surface-600 text-xs font-medium px-3 py-1 rounded-full capitalize">Difficulty: {pkg.difficulty}</span>
                <span className="bg-surface-100 text-surface-600 text-xs font-medium px-3 py-1 rounded-full">Max {pkg.maxGroupSize} pax</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-surface-800">{pkg.title}</h1>
              <p className="text-surface-500 mt-1">📍 {pkg.destination} • Starts from {pkg.startCity}</p>
              <div className="flex items-center gap-3 mt-3">
                <StarRating rating={pkg.rating} />
                <span className="font-bold text-surface-700">{pkg.rating}</span>
                <span className="text-surface-400">({pkg.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-1 flex gap-1">
              {(["itinerary","reviews","map"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? "bg-primary-600 text-white shadow" : "text-surface-600 hover:bg-surface-100"}`}>{tab === "map" ? "📍 Map" : tab === "reviews" ? `⭐ Reviews (${pkg.reviews.length})` : "📋 Itinerary"}</button>
              ))}
            </div>

            {activeTab === "itinerary" && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Day-by-Day Itinerary</h2>
                {pkg.itinerary.map(day => (
                  <div key={day.day} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-primary-500">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">D{day.day}</span>
                      <h3 className="font-bold text-surface-800">{day.title}</h3>
                    </div>
                    <p className="text-surface-600 text-sm ml-13">{day.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3 ml-13">
                      {day.activities.map((a, i) => <span key={i} className="text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded-full">✓ {a}</span>)}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 rounded-xl p-5">
                    <h3 className="font-bold text-green-800 mb-3">✅ Inclusions</h3>
                    <ul className="space-y-1">{pkg.inclusions.map((inc, i) => <li key={i} className="text-sm text-green-700">• {inc}</li>)}</ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-5">
                    <h3 className="font-bold text-red-800 mb-3">❌ Exclusions</h3>
                    <ul className="space-y-1">{pkg.exclusions.map((exc, i) => <li key={i} className="text-sm text-red-700">• {exc}</li>)}</ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Guest Reviews</h2>
                {pkg.reviews.length === 0 ? <p className="text-surface-400">No reviews yet</p> : pkg.reviews.map(rev => (
                  <div key={rev.id} className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">{rev.userName.charAt(0)}</span><span className="font-medium text-surface-800">{rev.userName}</span></div>
                        <div className="flex items-center gap-2 mt-1"><StarRating rating={rev.rating} /><span className="text-surface-400 text-xs">{new Date(rev.travelDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span></div>
                      </div>
                      <span className="text-xs text-surface-400">👍 {rev.helpful} helpful</span>
                    </div>
                    <h4 className="font-medium text-surface-800 mt-3">{rev.title}</h4>
                    <p className="text-surface-600 text-sm mt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "map" && <InteractiveMap destination={pkg.destination} />}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-5">
              <div>
                <span className="text-surface-400 text-sm line-through">₹{pkg.price.original.toLocaleString()}</span>
                <span className="text-green-600 text-sm font-bold ml-2">{discount}% OFF</span>
                <div className="text-3xl font-bold text-surface-800 mt-1">₹{pkg.price.discounted.toLocaleString()} <span className="text-sm font-normal text-surface-400">/ person</span></div>
              </div>
              <div><label className="text-sm font-medium text-surface-700 block mb-1">Travel Date</label><input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" /></div>
              <div><label className="text-sm font-medium text-surface-700 block mb-1">Travelers</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-10 h-10 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-lg font-bold transition-colors">−</button>
                  <span className="text-xl font-bold w-8 text-center">{travelers}</span>
                  <button onClick={() => setTravelers(Math.min(pkg.maxGroupSize, travelers + 1))} className="w-10 h-10 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-lg font-bold transition-colors">+</button>
                </div>
              </div>
              <div className="border-t border-surface-200 pt-4">
                <div className="flex justify-between text-sm"><span className="text-surface-500">₹{pkg.price.discounted.toLocaleString()} × {travelers}</span><span className="font-bold">₹{totalPrice.toLocaleString()}</span></div>
              </div>
              <Link href={`/book/${pkg.slug}?travelers=${travelers}&date=${travelDate}`} className="btn-primary w-full text-center block py-4 text-lg font-bold">Book Now</Link>
              <p className="text-xs text-surface-400 text-center">Free cancellation up to 48 hours before</p>
              <div className="text-sm space-y-2 pt-2">
                {pkg.highlights.slice(0, 4).map((h, i) => <div key={i} className="flex items-center gap-2 text-surface-600"><span className="text-green-500">✓</span>{h}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
