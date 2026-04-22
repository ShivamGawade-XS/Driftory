"use client"
import { useLanguage } from "@/context/LanguageContext"

const str: Record<string, Record<string, string>> = {
  en: { title: "Join the TripSathi Team", subtitle: "We are building the infrastructure for Indian travel. Help us make journeys unforgettable.", open: "Open Positions", apply: "Apply Now", noFit: "Don't see a perfect fit?", sendResume: "Send us your resume at" },
  hi: { title: "ट्रिपसाथी टीम से जुड़ें", subtitle: "हम भारतीय यात्रा का बुनियादी ढांचा बना रहे हैं। यात्राओं को अविस्मरणीय बनाने में हमारी मदद करें।", open: "खुली पोजीशन", apply: "अभी आवेदन करें", noFit: "सही पद नहीं दिखा?", sendResume: "अपना रिज्यूम भेजें" },
  ta: { title: "டிரிப்சாதி குழுவில் சேருங்கள்", subtitle: "இந்திய பயணத்திற்கான உள்கட்டமைப்பை உருவாக்குகிறோம். பயணங்களை மறக்கமுடியாததாக மாற்ற உதவுங்கள்.", open: "திறந்த பதவிகள்", apply: "இப்போது விண்ணப்பியுங்கள்", noFit: "சரியான பதவி இல்லையா?", sendResume: "உங்கள் ரெஸ்யூமை அனுப்புங்கள்" },
  te: { title: "ట్రిప్‌సాథీ టీమ్‌లో చేరండి", subtitle: "భారత ప్రయాణ మౌలిక సదుపాయాలను నిర్మిస్తున్నాము. ప్రయాణాలను మరపురానివిగా చేయడంలో సహాయపడండి.", open: "ఖాళీ పదవులు", apply: "ఇప్పుడే దరఖాస్తు చేయండి", noFit: "సరైన పదవి కనిపించలేదా?", sendResume: "మీ రెస్యూమ్ పంపండి" },
  mr: { title: "ट्रिपसाथी टीममध्ये सामील व्हा", subtitle: "आम्ही भारतीय प्रवासाची पायाभूत सुविधा बनवत आहोत. प्रवास अविस्मरणीय बनवण्यात मदत करा.", open: "रिक्त पदे", apply: "आता अर्ज करा", noFit: "योग्य पद दिसत नाही?", sendResume: "तुमचा रिज्यूम पाठवा" },
}

export default function CareersPage() {
  const { locale } = useLanguage()
  const t = str[locale] || str.en
  const jobs = [
    { title: "Senior Frontend Engineer", dept: "Engineering", loc: "Bengaluru / Remote", type: "Full-time" },
    { title: "Product Manager - Travel", dept: "Product", loc: "Gurgaon", type: "Full-time" },
    { title: "Customer Success Exec", dept: "Support", loc: "Mumbai", type: "Full-time" },
    { title: "Travel Content Writer", dept: "Marketing", loc: "Remote", type: "Contract" },
  ]

  return (
    <div className="min-h-screen bg-surface-50 pb-16">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20 px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold">{t.title}</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-surface-800 mb-6">{t.open}</h2>
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="border border-surface-200 rounded-xl p-5 hover:border-primary-500 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-surface-800">{job.title}</h3>
                  <div className="flex gap-3 text-sm text-surface-500 mt-2">
                    <span className="bg-surface-100 px-2 py-1 rounded-md">{job.dept}</span>
                    <span className="flex items-center">📍 {job.loc}</span>
                    <span className="flex items-center">⏱️ {job.type}</span>
                  </div>
                </div>
                <button className="btn-primary py-2 px-6">{t.apply}</button>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-primary-50 rounded-xl text-center">
            <h3 className="font-bold text-primary-800 text-lg">{t.noFit}</h3>
            <p className="text-primary-600 mt-2">{t.sendResume} <strong>careers@tripsathi.com</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
