import type { Metadata } from "next"
import DriftoryClient from "./DriftoryClient"

export const metadata: Metadata = {
  title: "Driftory — Coastal Experience Routes | TripSathi",
  description:
    "Turn creator-inspired travel reels into verified, mapped, timed, and budgeted coastal experience routes. Powered by TripSathi.",
}

export default function DriftoryPage() {
  return <DriftoryClient />
}
