"use client"
import { useLanguage } from "@/context/LanguageContext"
const str: Record<string, Record<string, string>> = {
  en: { title: "Terms of Service", updated: "Last updated: April 4, 2026", intro: "By using TripSathi, you agree to these terms. Please read them carefully.", s1: "1. Use of Service", s1d: "TripSathi provides a travel aggregation platform. Users must be 18+ or have guardian consent. You are responsible for the accuracy of information you provide during booking.", s2: "2. Booking & Payments", s2d: "All bookings are subject to availability with our partner operators. Prices displayed are inclusive of applicable taxes unless stated. Payment processing is handled securely via Razorpay.", s3: "3. Liability", s3d: "TripSathi acts as an intermediary between travelers and service providers. We are not liable for delays, cancellations, or service quality issues caused by third-party operators." },
  hi: { title: "सेवा की शर्तें", updated: "अंतिम अपडेट: 4 अप्रैल, 2026", intro: "ट्रिपसाथी का उपयोग करके, आप इन शर्तों से सहमत हैं। कृपया इन्हें ध्यान से पढ़ें।", s1: "1. सेवा का उपयोग", s1d: "ट्रिपसाथी एक यात्रा एग्रीगेशन प्लेटफॉर्म प्रदान करता है। उपयोगकर्ता 18+ होने चाहिए या अभिभावक की सहमति होनी चाहिए।", s2: "2. बुकिंग और भुगतान", s2d: "सभी बुकिंग हमारे पार्टनर ऑपरेटरों की उपलब्धता के अधीन हैं। प्रदर्शित कीमतों में लागू कर शामिल हैं।", s3: "3. दायित्व", s3d: "ट्रिपसाथी यात्रियों और सेवा प्रदाताओं के बीच मध्यस्थ के रूप में काम करता है। हम तीसरे पक्ष के ऑपरेटरों की देरी, रद्दीकरण या सेवा गुणवत्ता के लिए उत्तरदायी नहीं हैं।" },
  ta: { title: "சேவை விதிமுறைகள்", updated: "கடைசி புதுப்பிப்பு: ஏப்ரல் 4, 2026", intro: "டிரிப்சாதியைப் பயன்படுத்துவதன் மூலம், இந்த விதிமுறைகளை ஏற்கிறீர்கள்.", s1: "1. சேவையின் பயன்பாடு", s1d: "டிரிப்சாதி ஒரு பயண ஒருங்கிணைப்பு தளத்தை வழங்குகிறது. பயனர்கள் 18+ வயது அல்லது பாதுகாவலர் ஒப்புதல் பெற்றிருக்க வேண்டும்.", s2: "2. புக்கிங் மற்றும் கட்டணம்", s2d: "அனைத்து புக்கிங்களும் எங்கள் பங்குதாரர்களின் இருப்பிற்கு உட்பட்டவை.", s3: "3. பொறுப்பு", s3d: "டிரிப்சாதி பயணிகள் மற்றும் சேவை வழங்குநர்களுக்கு இடையே இடைத்தரகராக செயல்படுகிறது." },
  te: { title: "సేవా నిబంధనలు", updated: "చివరి అప్‌డేట్: ఏప్రిల్ 4, 2026", intro: "ట్రిప్‌సాథీని ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలకు అంగీకరిస్తారు.", s1: "1. సేవ వినియోగం", s1d: "ట్రిప్‌సాథీ ప్రయాణ సమీకరణ వేదికను అందిస్తుంది. వినియోగదారులు 18+ లేదా సంరక్షకుడి అనుమతి కలిగి ఉండాలి.", s2: "2. బుకింగ్ & చెల్లింపులు", s2d: "అన్ని బుకింగ్‌లు మా భాగస్వామి ఆపరేటర్ల లభ్యతకు లోబడి ఉంటాయి.", s3: "3. బాధ్యత", s3d: "ట్రిప్‌సాథీ ప్రయాణికులు మరియు సేవా ప్రదాతల మధ్య మధ్యవర్తిగా పనిచేస్తుంది." },
  mr: { title: "सेवा अटी", updated: "शेवटचे अपडेट: 4 एप्रिल, 2026", intro: "ट्रिपसाथीचा वापर करून, तुम्ही या अटींशी सहमत आहात.", s1: "1. सेवेचा वापर", s1d: "ट्रिपसाथी प्रवास एकत्रीकरण व्यासपीठ प्रदान करते. वापरकर्ते 18+ वयाचे असणे किंवा पालकांची संमती असणे आवश्यक आहे.", s2: "2. बुकिंग आणि पेमेंट", s2d: "सर्व बुकिंग आमच्या भागीदार ऑपरेटर्सच्या उपलब्धतेच्या अधीन आहेत.", s3: "3. दायित्व", s3d: "ट्रिपसाथी प्रवासी आणि सेवा प्रदात्यांमध्ये मध्यस्थ म्हणून कार्य करते." },
}
export default function TermsPage() {
  const { locale } = useLanguage()
  const t = str[locale] || str.en
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="font-display text-4xl font-bold text-surface-800 mb-2">{t.title}</h1>
        <p className="text-surface-500 mb-8 pb-4 border-b">{t.updated}</p>
        <div className="prose prose-surface max-w-none text-surface-600 space-y-6">
          <p>{t.intro}</p>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s1}</h2><p>{t.s1d}</p>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s2}</h2><p>{t.s2d}</p>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s3}</h2><p>{t.s3d}</p>
        </div>
      </div>
    </div>
  )
}
