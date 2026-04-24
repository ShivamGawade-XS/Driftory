"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

const categories = [
  { id: "all", label: "All", icon: "🌍" },
  { id: "heritage", label: "Heritage", icon: "🏛️" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "adventure", label: "Adventure", icon: "⛰️" },
  { id: "pilgrimage", label: "Pilgrimage", icon: "🙏" },
  { id: "honeymoon", label: "Honeymoon", icon: "💕" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
]

interface PackageCardProps {
  pkg: {
    id: string; slug: string; title: string; destination: string; category: string
    duration: { days: number; nights: number }; price: { original: number; discounted: number }
    rating: number; reviewCount: number; coverImage: string; highlights: string[]
    featured: boolean; seasonal: boolean; groupDeal: boolean; maxGroupSize: number
  }
}

function PackageCard({ pkg }: PackageCardProps) {
  const discount = Math.round(((pkg.price.original - pkg.price.discounted) / pkg.price.original) * 100)
  return (
    <Link href={`/packages/${pkg.slug}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--bg-card)" }}>
      <div className="relative h-52 overflow-hidden">
        <img src={pkg.coverImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {pkg.featured && <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Featured</span>}
        {pkg.groupDeal && <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">👥 Group Deal</span>}
        {pkg.seasonal && <span className={`absolute top-3 ${pkg.featured ? "left-28" : "left-3"} bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full`}>🔥 Seasonal</span>}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white/90 text-sm">{pkg.duration.days}D / {pkg.duration.nights}N • {pkg.destination}</p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-surface-800 group-hover:text-primary-600 transition-colors line-clamp-1">{pkg.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-amber-500 font-bold">★ {pkg.rating}</span>
          <span className="text-surface-400 text-sm">({pkg.reviewCount} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {pkg.highlights.slice(0, 3).map((h, i) => <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{h}</span>)}
        </div>
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-surface-100">
          <div>
            <span className="text-surface-400 text-sm line-through">₹{pkg.price.original.toLocaleString()}</span>
            <span className="block text-2xl font-bold text-primary-600">₹{pkg.price.discounted.toLocaleString()}</span>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{discount}% OFF</span>
        </div>
      </div>
    </Link>
  )
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageCardProps["pkg"][]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("")
  const { locale } = useLanguage()

  const pkgStr: Record<string, Record<string, string>> = {
    en: { title: "Tour Packages", subtitle: "Curated travel experiences across incredible India", sortBy: "Sort by", priceLow: "Price: Low to High", priceHigh: "Price: High to Low", rated: "Highest Rated", shortest: "Shortest First", none: "No packages found", all: "All", heritage: "Heritage", beach: "Beach", adventure: "Adventure", pilgrimage: "Pilgrimage", honeymoon: "Honeymoon", family: "Family" },
    hi: { title: "टूर पैकेज", subtitle: "अविश्वसनीय भारत में क्यूरेटेड यात्रा अनुभव", sortBy: "क्रमबद्ध करें", priceLow: "कम कीमत", priceHigh: "अधिक कीमत", rated: "सर्वोच्च रेटेड", shortest: "सबसे छोटा", none: "कोई पैकेज नहीं मिला", all: "सभी", heritage: "विरासत", beach: "समुद्र तट", adventure: "रोमांच", pilgrimage: "तीर्थयात्रा", honeymoon: "हनीमून", family: "परिवार" },
    ta: { title: "டூர் பேக்கேஜ்கள்", subtitle: "அதிசய இந்தியா முழுவதும் சிறந்த பயண அனுபவங்கள்", sortBy: "வரிசைப்படுத்து", priceLow: "குறைந்த விலை", priceHigh: "அதிக விலை", rated: "அதிக மதிப்பீடு", shortest: "குறுகிய", none: "பேக்கேஜ்கள் இல்லை", all: "அனைத்தும்", heritage: "பாரம்பரியம்", beach: "கடற்கரை", adventure: "சாகசம்", pilgrimage: "யாத்திரை", honeymoon: "ஹனிமூன்", family: "குடும்பம்" },
    te: { title: "టూర్ ప్యాకేజీలు", subtitle: "అద్భుతమైన భారతదేశంలో క్యూరేటెడ్ ప్రయాణ అనుభవాలు", sortBy: "క్రమీకరించు", priceLow: "తక్కువ ధర", priceHigh: "ఎక్కువ ధర", rated: "అధిక రేటింగ్", shortest: "తక్కువ", none: "ప్యాకేజీలు కనుగొనబడలేదు", all: "అన్నీ", heritage: "వారసత్వం", beach: "బీచ్", adventure: "సాహసం", pilgrimage: "తీర్థయాత్ర", honeymoon: "హనీమూన్", family: "కుటుంబం" },
    mr: { title: "टूर पॅकेजेस", subtitle: "अविश्वसनीय भारतातील क्यूरेटेड प्रवास अनुभव", sortBy: "क्रमवारी", priceLow: "कमी किंमत", priceHigh: "अधिक किंमत", rated: "सर्वोच्च रेटेड", shortest: "सर्वात लहान", none: "पॅकेजेस सापडले नाहीत", all: "सर्व", heritage: "वारसा", beach: "समुद्रकिनारा", adventure: "साहस", pilgrimage: "तीर्थयात्रा", honeymoon: "हनीमून", family: "कुटुंब" },
  }
  const ps = pkgStr[locale] || pkgStr.en
  const catLabels: Record<string, string> = { all: ps.all, heritage: ps.heritage, beach: ps.beach, adventure: ps.adventure, pilgrimage: ps.pilgrimage, honeymoon: ps.honeymoon, family: ps.family }

  const fetchPackages = async (cat: string, sortBy: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (cat !== "all") params.set("category", cat)
      if (sortBy) params.set("sort", sortBy)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/packages?${params}`)
      const data = await res.json()
      setPackages(data.packages)
    } catch { setPackages([]) }
    setLoading(false)
  }

  useEffect(() => { fetchPackages("all", "") }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategory = (cat: string) => { setActiveCategory(cat); fetchPackages(cat, sort) }
  const handleSort = (s: string) => { setSort(s); fetchPackages(activeCategory, s) }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold">{ps.title}</h1>
          <p className="mt-3 text-white/80 text-lg">{ps.subtitle}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="rounded-2xl shadow-lg p-4 flex flex-wrap gap-2 items-center justify-between" style={{ background: "var(--bg-card)" }}>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-primary-600 text-white shadow-md" : "bg-surface-100 text-surface-600 hover:bg-surface-200"}`}>
                {cat.icon} {catLabels[cat.id] || cat.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => handleSort(e.target.value)} className="px-4 py-2 rounded-xl border border-surface-200 text-sm bg-white">
            <option value="">{ps.sortBy}</option>
            <option value="price">{ps.priceLow}</option>
            <option value="price_desc">{ps.priceHigh}</option>
            <option value="rating">{ps.rated}</option>
            <option value="duration">{ps.shortest}</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />)}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20"><p className="text-surface-400 text-lg">{ps.none}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pb-12">
            {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}
      </div>
    </div>
  )
}
