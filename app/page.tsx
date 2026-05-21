import DriftoryClient from "@/app/driftory/DriftoryClient"
import Features from "@/components/home/Features"
import PopularRoutes from "@/components/home/PopularRoutes"
import TrendingSections from "@/components/home/TrendingSections"

export default function Home() {
  return (
    <>
      <DriftoryClient />
      
      <div className="border-t mt-12" style={{ borderColor: "var(--border-card)" }}>
        <Features />
      </div>
      
      <PopularRoutes />
      
      <section className="max-w-7xl mx-auto px-4 py-16">
        <TrendingSections />
      </section>
    </>
  )
}