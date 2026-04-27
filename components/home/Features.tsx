"use client"
import { useLanguage } from "@/context/LanguageContext"
import { Reveal, Tilt3D, StaggerReveal } from "@/components/effects/MotionEffects"

const icons = [
  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
  "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
]
const colors = ["from-blue-500 to-blue-600", "from-green-500 to-emerald-600", "from-purple-500 to-purple-600", "from-orange-500 to-amber-600"]

export default function Features() {
  const { t } = useLanguage()
  const features = [
    { title: t("feature_unified"), desc: t("feature_unified_desc") },
    { title: t("feature_compare"), desc: t("feature_compare_desc") },
    { title: t("feature_save"), desc: t("feature_save_desc") },
    { title: t("feature_hindi"), desc: t("feature_hindi_desc") },
  ]

  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-surface-900 mb-4">{t("features_title")}</h2>
            <p className="text-surface-500 text-lg max-w-2xl mx-auto">{t("hero_subtitle")}</p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={120}>
          {features.map((f, i) => (
            <Tilt3D key={i} className="card group cursor-default">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icons[i]} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">{f.title}</h3>
              <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
            </Tilt3D>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
