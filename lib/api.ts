const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export interface TransportResult {
  id: string
  type: "train" | "bus"
  name: string
  provider: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  rating: number
  availableSeats: number | null
  class: string | null
  rank?: number
}

export interface HotelResult {
  id: string
  name: string
  provider: string
  city: string
  pricePerNight: number
  rating: number
  location: string
  amenities: string[]
  imageUrl: string
  type: string
  rank?: number
}

export interface SearchResponse {
  transport: TransportResult[]
  hotels: HotelResult[]
  savings: number
  meta: {
    from: string
    to: string
    date: string
    transportCount: number
    hotelCount: number
    fetchedAt: string
  }
  cached: boolean
}

export async function searchAll(from: string, to: string, date?: string, sort?: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ from, to })
  if (date) params.set("date", date)
  if (sort) params.set("sort", sort)

  const res = await fetch(`${API_BASE}/search?${params.toString()}`)
  if (!res.ok) throw new Error("Search failed")
  return res.json()
}

export async function searchTransport(from: string, to: string, sort?: string): Promise<{ results: TransportResult[] }> {
  const params = new URLSearchParams({ from, to })
  if (sort) params.set("sort", sort)

  const res = await fetch(`${API_BASE}/search/transport?${params.toString()}`)
  if (!res.ok) throw new Error("Transport search failed")
  return res.json()
}

export async function searchHotels(city: string, sort?: string): Promise<{ results: HotelResult[] }> {
  const params = new URLSearchParams({ city })
  if (sort) params.set("sort", sort)

  const res = await fetch(`${API_BASE}/search/hotels?${params.toString()}`)
  if (!res.ok) throw new Error("Hotel search failed")
  return res.json()
}

// auth
export async function loginApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Login failed")
  }
  return res.json()
}

export async function registerApi(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Registration failed")
  }
  return res.json()
}

export async function getMeApi(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Not authenticated")
  return res.json()
}

// itinerary
export async function saveItinerary(data: Record<string, unknown>, token: string) {
  const res = await fetch(`${API_BASE}/itinerary`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to save itinerary")
  return res.json()
}

export async function getMyItineraries(token: string) {
  const res = await fetch(`${API_BASE}/itinerary`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to fetch itineraries")
  return res.json()
}

export async function getSharedItinerary(shareToken: string) {
  const res = await fetch(`${API_BASE}/itinerary/shared/${shareToken}`)
  if (!res.ok) throw new Error("Shared itinerary not found")
  return res.json()
}

export async function getMyBookings(token: string) {
  const res = await fetch(`${API_BASE}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to fetch bookings")
  return res.json()
}
