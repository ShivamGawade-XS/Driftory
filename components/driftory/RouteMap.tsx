"use client"
import { useEffect, useMemo } from "react"
import dynamic from "next/dynamic"

interface Spot {
  name: string
  coordinates?: { lat: number; lng: number } | null
  verified: boolean
  bestTime?: string
  type?: string
}

interface RouteMapProps {
  spots: Spot[]
}

// Dynamically import map components to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
)

function MapInner({ spots }: RouteMapProps) {
  const verifiedSpots = useMemo(
    () => spots.filter((s) => s.verified && s.coordinates?.lat && s.coordinates?.lng),
    [spots]
  )

  useEffect(() => {
    // Fix Leaflet default icon path issue
    if (typeof window !== "undefined") {
      const L = require("leaflet")
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      })
    }
  }, [])

  if (verifiedSpots.length === 0) {
    return (
      <div className="flex items-center justify-center py-12" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">No verified locations to display on map.</p>
      </div>
    )
  }

  const center = {
    lat: verifiedSpots.reduce((sum, s) => sum + s.coordinates!.lat, 0) / verifiedSpots.length,
    lng: verifiedSpots.reduce((sum, s) => sum + s.coordinates!.lng, 0) / verifiedSpots.length,
  }

  const polylinePositions = verifiedSpots.map((s) => [
    s.coordinates!.lat,
    s.coordinates!.lng,
  ] as [number, number])

  // Screen-reader accessible text-only summary
  const routeSummary = verifiedSpots
    .map((s, i) => `Stop ${i + 1}: ${s.name}${s.bestTime ? ` at ${s.bestTime}` : ""}`)
    .join(". ")

  return (
    <div className="relative">
      <div className="sr-only" aria-label={`Route summary: ${routeSummary}`} />
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="w-full rounded-xl z-0"
        style={{ height: "320px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {verifiedSpots.map((spot, i) => (
          <Marker
            key={i}
            position={[spot.coordinates!.lat, spot.coordinates!.lng]}
          >
            <Popup>
              <strong>{spot.name}</strong>
              {spot.bestTime && <br />}
              {spot.bestTime && <span>{spot.bestTime}</span>}
            </Popup>
          </Marker>
        ))}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            color="#0F9B8E"
            weight={3}
            dashArray="8 6"
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  )
}

// Export with dynamic import to prevent SSR
export default dynamic(() => Promise.resolve(MapInner), { ssr: false })
