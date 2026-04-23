import type { Metadata } from "next"
import "./globals.css"
import Layout from "@/components/layout/Layout"
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister"

export const metadata: Metadata = {
  title: "TripSathi - One Platform, Every Indian Journey",
  description:
    "TripSathi unifies trains, buses, hotels, and itinerary planning into one seamless platform built for every Indian traveler.",
  manifest: "/manifest.json",
}

export const viewport = {
  themeColor: "#4F46E5",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TripSathi" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <Layout>{children}</Layout>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}