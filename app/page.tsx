import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import PopularRoutes from "@/components/home/PopularRoutes"
import TrendingSections from "@/components/home/TrendingSections"

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <PopularRoutes />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <TrendingSections />
      </section>
    </>
  )
}