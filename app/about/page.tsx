"use client"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

const s: Record<string, Record<string, string>> = {
  en: { title: "About Crimson Syndicate", desc: "Crimson Syndicate is a team of innovators brought together to explore the unknown and build solutions beyond the ordinary. Inspired by the mysterious and bold spirit of Stranger Things, we stepped into this hackathon ready to challenge limits, experiment with ideas, and create something extraordinary.", mission: "Our Mission", missionDesc: "At Crimson Syndicate, we believe innovation happens when curiosity meets courage. This project represents our mission to push boundaries, think differently, and turn the impossible into reality.", story: "Our Journey", storyDesc: "Like navigating the Upside Down, our journey involved solving complex problems under pressure, collaborating across diverse skills, and adapting quickly to unexpected challenges. Through creativity, teamwork, and determination, we transformed our ideas into a powerful working solution.", cta: "Ready to start your journey?", ctaDesc: "Join thousands of travelers who have simplified their travel planning with TripSathi.", search: "Search Trips", packages: "View Packages" },
  hi: { title: "क्रिमसन सिंडिकेट के बारे में", desc: "क्रिमसन सिंडिकेट नवप्रवर्तकों की एक टीम है। स्ट्रेंजर थिंग्स की साहसी भावना से प्रेरित होकर, हमने सीमाओं को चुनौती देने और कुछ असाधारण बनाने के लिए इस हैकथॉन में कदम रखा है।", mission: "हमारा मिशन", missionDesc: "हमारा मानना है कि नवाचार तब होता है जब जिज्ञासा साहस से मिलती है। यह प्रोजेक्ट सीमाओं को आगे बढ़ाने और असंभव को वास्तविकता में बदलने के हमारे मिशन का प्रतिनिधित्व करता है।", story: "हमारी हैकथॉन यात्रा", storyDesc: "अपसाइड डाउन को नेविगेट करने की तरह, हमारी यात्रा में दबाव में जटिल समस्याओं को हल करना शामिल था। टीम वर्क और दृढ़ संकल्प के माध्यम से, हमने एक शक्तिशाली समाधान तैयार किया।", cta: "अपनी यात्रा शुरू करें?", ctaDesc: "हजारों यात्रियों से जुड़ें जिन्होंने ट्रिपसाथी के साथ अपनी यात्रा योजना को सरल बनाया है।", search: "ट्रिप खोजें", packages: "पैकेज देखें" },
  ta: { title: "கிரிம்சன் சிண்டிகேட் பற்றி", desc: "கிரிம்சன் சிண்டிகேட் என்பது புதுமையாளர்களின் குழு. ஸ்ட்ரேஞ்சர் திங்ஸால் ஈர்க்கப்பட்டு, அசாதாரணமான ஒன்றை உருவாக்க இந்த ஹேக்கத்தானில் நுழைந்தோம்.", mission: "எங்கள் நோக்கம்", missionDesc: "ஆர்வம் தைரியத்தை சந்திக்கும் போது புதுமை நிகழ்கிறது. சாத்தியமற்றதை யதார்த்தமாக மாற்றுவதே எங்கள் நோக்கம்.", story: "எங்கள் பயணம்", storyDesc: "அப்சைடு டவுனை வழிநடத்துவதைப் போல, எங்கள் பயணம் அழுத்தத்தின் கீழ் சிக்கலான பிரச்சனைகளை தீர்ப்பதை உள்ளடக்கியது. குழுப்பணி மூலம், ஒரு சக்திவாய்ந்த தீர்வை உருவாக்கினோம்.", cta: "உங்கள் பயணத்தைத் தொடங்க தயாரா?", ctaDesc: "டிரிப்சாதியுடன் பயணத் திட்டமிடலை எளிதாக்கிய ஆயிரக்கணக்கான பயணிகளுடன் சேருங்கள்.", search: "ட்ரிப்கள் தேடு", packages: "பேக்கேஜ்கள் பார்" },
  te: { title: "క్రిమ్సన్ సిండికేట్ గురించి", desc: "క్రిమ్సన్ సిండికేట్ అనేది ఆవిష్కర్తల బృందం. స్ట్రేంజర్ థింగ్స్ స్ఫూర్తితో, అసాధారణమైనదాన్ని సృష్టించడానికి మేము ఈ హ్యాకథాన్‌లోకి ప్రవేశించాము.", mission: "మా లక్ష్యం", missionDesc: "ఉత్సుకత ధైర్యాన్ని కలుసుకున్నప్పుడు ఆవిష్కరణ జరుగుతుంది. అసాధ్యమైనదాన్ని సాకారం చేయడమే మా లక్ష్యం.", story: "మా ప్రయాణం", storyDesc: "అప్‌సైడ్ డౌన్‌ ఇరుక్కున్నట్లు, మా ప్రయాణం ఒత్తిడిలో సంక్లిష్ట సమస్యలను పరిష్కరించడం. టీమ్‌వర్క్ ద్వారా, మేము శక్తివంతమైన పరిష్కారాన్ని సృష్టించాము.", cta: "మీ ప్రయాణాన్ని ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?", ctaDesc: "ట్రిప్‌సాథీతో ప్రయాణ ప్లానింగ్‌ను సరళం చేసుకున్న వేలాది ప్రయాణికులతో చేరండి.", search: "ట్రిప్‌లు వెతుకు", packages: "ప్యాకేజీలు చూడు" },
  mr: { title: "क्रिमसन सिंडिकेट बद्दल", desc: "क्रिमसन सिंडिकेट ही नवकल्पकांची एक टीम आहे. स्ट्रेंजर थिंग्जच्या भावनेने प्रेरित होऊन, आम्ही या हॅकाथॉनमध्ये काहीतरी असाधारण करण्यासाठी प्रवेश केला.", mission: "आमचे ध्येय", missionDesc: "जेव्हा कुतूहल धाडसाला भेटते तेव्हा नावीन्य घडते. अशक्य गोष्टी वास्तवात साकारणे हे आमचे ध्येय आहे.", story: "आमचा प्रवास", storyDesc: "अपसाइड डाउन नेव्हिगेट करण्यासारखे, आमच्या प्रवासात दबावाखाली जटिल समस्या सोडवणे समाविष्ट होते. टीमवर्कद्वारे आम्ही एक शक्तिशाली उपाय तयार केला.", cta: "तुमचा प्रवास सुरू करायला तयार?", ctaDesc: "ट्रिपसाथीसोबत प्रवास नियोजन सोपे केलेल्या हजारो प्रवाशांसोबत सामील व्हा.", search: "ट्रिप शोधा", packages: "पॅकेजेस पहा" },
}

export default function AboutPage() {
  const { locale } = useLanguage()
  const t = s[locale] || s.en
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-surface-800 mb-6 text-center">{t.title}</h1>
          <p className="text-xl text-surface-600 text-center leading-relaxed">{t.desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-primary-500">
            <h2 className="text-2xl font-bold text-surface-800 mb-3">{t.mission}</h2>
            <p className="text-surface-600">{t.missionDesc}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-accent-500">
            <h2 className="text-2xl font-bold text-surface-800 mb-3">{t.story}</h2>
            <p className="text-surface-600">{t.storyDesc}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{t.cta}</h2>
          <p className="mb-8 text-white/80 max-w-xl mx-auto">{t.ctaDesc}</p>
          <div className="flex justify-center gap-4">
            <Link href="/search" className="btn-secondary px-8 py-3 bg-white text-primary-700 hover:bg-surface-50 border-none font-bold">{t.search}</Link>
            <Link href="/packages" className="border-2 border-white/30 hover:bg-white/10 px-8 py-3 rounded-xl font-bold transition-colors">{t.packages}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
