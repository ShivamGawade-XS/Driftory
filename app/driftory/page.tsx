import type { Metadata } from "next"
import DriftoryClient from "./DriftoryClient"

export const metadata: Metadata = {
  title: "Driftory — Coastal Experience Routes | Driftory",
  description:
    "Turn creator-inspired travel reels into verified, mapped, timed, and budgeted coastal experience routes. Powered by Driftory.",
}

export default function DriftoryPage() {
  return <DriftoryClient />
}
