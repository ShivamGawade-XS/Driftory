"use client"
import { useState, useEffect } from "react"
import { getMyItineraries } from "@/lib/api"
import TripCard from "@/components/dashboard/TripCard"
import Spinner from "@/components/ui/Spinner"
import EmptyState from "@/components/ui/EmptyState"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { locale } = useLanguage()
  const ds: Record<string, Record<string, string>> = {
    en: { login: "Sign in to view saved trips", loginDesc: "You need an account to save and manage your trip itineraries.", title: "Saved Trips", subtitle: "Your saved travel itineraries", newTrip: "+ New Trip", noTrips: "No saved trips yet", noTripsDesc: "Search for a route, build your itinerary, and save it here.", loginBtn: "Login", regBtn: "Create Account" },
    hi: { login: "सहेजी गई यात्राएं देखने के लिए साइन इन करें", loginDesc: "अपनी यात्रा योजनाओं को सहेजने और प्रबंधित करने के लिए खाता चाहिए।", title: "सहेजी गई यात्राएं", subtitle: "आपकी सहेजी गई यात्रा योजनाएं", newTrip: "+ नई यात्रा", noTrips: "अभी कोई सहेजी गई यात्रा नहीं", noTripsDesc: "कोई मार्ग खोजें, योजना बनाएं और यहां सहेजें।", loginBtn: "लॉगिन", regBtn: "खाता बनाएं" },
    ta: { login: "சேமித்த பயணங்களைக் காண உள்நுழையவும்", loginDesc: "பயண திட்டங்களை சேமிக்க கணக்கு தேவை.", title: "சேமித்த பயணங்கள்", subtitle: "சேமிக்கப்பட்ட பயண திட்டங்கள்", newTrip: "+ புதிய பயணம்", noTrips: "சேமிக்கப்பட்ட பயணங்கள் இல்லை", noTripsDesc: "ஒரு பாதையைத் தேடுங்கள், திட்டமிடுங்கள், இங்கே சேமியுங்கள்.", loginBtn: "உள்நுழை", regBtn: "கணக்கு உருவாக்கு" },
    te: { login: "సేవ్ చేసిన ట్రిప్‌లను చూడటానికి సైన్ ఇన్ చేయండి", loginDesc: "మీ ప్రయాణ ప్రణాళికలను సేవ్ చేయడానికి ఖాతా అవసరం.", title: "సేవ్ చేసిన ట్రిప్‌లు", subtitle: "మీ సేవ్ చేసిన ప్రయాణ ప్రణాళికలు", newTrip: "+ కొత్త ట్రిప్", noTrips: "సేవ్ చేసిన ట్రిప్‌లు ఇంకా లేవు", noTripsDesc: "ఒక మార్గం శోధించండి, ప్రణాళిక చేయండి, ఇక్కడ సేవ్ చేయండి.", loginBtn: "లాగిన్", regBtn: "ఖాతా సృష్టించండి" },
    mr: { login: "सेव्ह केलेल्या सहली पाहण्यासाठी साइन इन करा", loginDesc: "प्रवास योजना सेव्ह करण्यासाठी खाते आवश्यक आहे.", title: "सेव्ह केलेल्या सहली", subtitle: "तुमच्या सेव्ह केलेल्या प्रवास योजना", newTrip: "+ नवीन सहल", noTrips: "अजून सेव्ह सहली नाहीत", noTripsDesc: "एक मार्ग शोधा, योजना बनवा आणि येथे सेव्ह करा.", loginBtn: "लॉगिन", regBtn: "खाते तयार करा" },
  }
  const d = ds[locale] || ds.en

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("tripsathi_token") : null
    if (!token) {
      setLoading(false)
      setError("login_required")
      return
    }

    Promise.all([
      getMyItineraries(token).catch(() => []),
      import("@/lib/api").then(m => m.getMyBookings(token)).catch(() => [])
    ])
      .then(([tripsData, bookingsData]) => {
        setTrips(Array.isArray(tripsData) ? tripsData : [])
        // merge API bookings with localStorage bookings (dedup by bookingRef)
        const localBookings = JSON.parse(localStorage.getItem("tripsathi_bookings") || "[]")
        const apiBookings = Array.isArray(bookingsData) ? bookingsData : []
        const seen = new Set<string>()
        const merged: any[] = []
        for (const b of [...apiBookings, ...localBookings]) {
          const key = b.bookingRef || b._id
          if (!seen.has(key)) { seen.add(key); merged.push(b) }
        }
        merged.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        setBookings(merged)
        // sync merged set back to localStorage
        localStorage.setItem("tripsathi_bookings", JSON.stringify(merged))
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="py-20"><Spinner size="lg" /></div>
    )
  }

  if (error === "login_required") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-surface-900 mb-3">{d.login}</h1>
        <p className="text-surface-500 mb-6">{d.loginDesc}</p>
        <div className="flex justify-center gap-3">
          <Link href="/login" className="btn-primary">{d.loginBtn}</Link>
          <Link href="/register" className="btn-secondary">{d.regBtn}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">{d.title}</h1>
          <p className="text-surface-500 mt-1">{d.subtitle}</p>
        </div>
        <Link href="/search" className="btn-primary text-sm py-2 px-4">
          {d.newTrip}
        </Link>
      </div>

      {trips.length === 0 && bookings.length === 0 ? (
        <EmptyState
          title={d.noTrips}
          description={d.noTripsDesc}
          icon="✈️"
        />
      ) : (
        <div className="space-y-8">
          {trips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip: any) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
          
          {bookings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-surface-900 mb-4">Confirmed Bookings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((b: any) => (
                  <div key={b._id} className="card border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{b.type}</span>
                      <span className="text-surface-500 text-sm">{new Date(b.travelDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-lg text-surface-900 line-clamp-1">{b.type === "hotel" ? b.hotel?.name : b.transport?.name}</h3>
                    <p className="text-surface-500 text-sm mb-3">Ref: {b.bookingRef}</p>
                    <div className="flex justify-between items-end border-t border-surface-100 pt-3">
                      <span className="text-surface-600 text-sm">{b.to || "Destination"}</span>
                      <span className="font-bold text-primary-600">₹{b.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
