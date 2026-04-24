"use client"
import { useLanguage } from "@/context/LanguageContext"
const str: Record<string, Record<string, string>> = {
  en: { title: "Privacy Policy", updated: "Last updated: April 4, 2026", intro: "This Privacy Policy describes how TripSathi collects, uses, and protects your personal information.", s1: "1. Information We Collect", s1d: "We collect information you provide directly: name, email, phone, payment details, and travel preferences. We also automatically collect device info, IP address, browser type, and usage analytics.", s2: "2. How We Use Your Data", s2d: "Your data is used to process bookings, provide customer support, personalize your travel recommendations, send booking confirmations and price alerts, and improve our platform. We never sell your personal data to third parties.", s3: "3. Data Security", s3d: "We implement industry-standard 256-bit SSL encryption, PCI-DSS compliance for payments, and regular security audits. Your data is stored on encrypted servers within India in compliance with the Information Technology Act, 2000.", s4: "4. Your Rights", s4d: "You have the right to access, modify, or delete your personal data at any time. Contact privacy@tripsathi.com for data-related requests. We respond within 48 hours." },
  hi: { title: "गोपनीयता नीति", updated: "अंतिम अपडेट: 4 अप्रैल, 2026", intro: "यह गोपनीयता नीति बताती है कि ट्रिपसाथी आपकी व्यक्तिगत जानकारी कैसे एकत्र करता, उपयोग करता और सुरक्षित रखता है।", s1: "1. हम जो जानकारी एकत्र करते हैं", s1d: "हम वो जानकारी एकत्र करते हैं जो आप सीधे प्रदान करते हैं: नाम, ईमेल, फोन, भुगतान विवरण और यात्रा प्राथमिकताएं। हम स्वचालित रूप से डिवाइस जानकारी, IP पता, ब्राउज़र प्रकार और उपयोग विश्लेषण भी एकत्र करते हैं।", s2: "2. हम आपके डेटा का उपयोग कैसे करते हैं", s2d: "आपका डेटा बुकिंग प्रोसेस करने, ग्राहक सहायता प्रदान करने, आपकी यात्रा सिफारिशों को व्यक्तिगत बनाने, बुकिंग पुष्टि और मूल्य अलर्ट भेजने और हमारे प्लेटफॉर्म को बेहतर बनाने के लिए उपयोग किया जाता है।", s3: "3. डेटा सुरक्षा", s3d: "हम उद्योग-मानक 256-बिट SSL एन्क्रिप्शन, भुगतान के लिए PCI-DSS अनुपालन और नियमित सुरक्षा ऑडिट लागू करते हैं।", s4: "4. आपके अधिकार", s4d: "आपको किसी भी समय अपने व्यक्तिगत डेटा तक पहुंचने, संशोधित करने या हटाने का अधिकार है। privacy@tripsathi.com पर संपर्क करें।" },
  ta: { title: "தனியுரிமை கொள்கை", updated: "கடைசி புதுப்பிப்பு: ஏப்ரல் 4, 2026", intro: "டிரிப்சாதி உங்கள் தனிப்பட்ட தகவல்களை எவ்வாறு சேகரிக்கிறது, பயன்படுத்துகிறது மற்றும் பாதுகாக்கிறது என்பதை இந்த தனியுரிமை கொள்கை விவரிக்கிறது.", s1: "1. நாங்கள் சேகரிக்கும் தகவல்கள்", s1d: "நீங்கள் நேரடியாக வழங்கும் தகவல்களை நாங்கள் சேகரிக்கிறோம்: பெயர், மின்னஞ்சல், தொலைபேசி, கட்டண விவரங்கள் மற்றும் பயண விருப்பங்கள்.", s2: "2. உங்கள் தரவை எவ்வாறு பயன்படுத்துகிறோம்", s2d: "உங்கள் புக்கிங்களை செயல்படுத்த, வாடிக்கையாளர் ஆதரவை வழங்க, பயண பரிந்துரைகளை தனிப்பயனாக்க உங்கள் தரவு பயன்படுத்தப்படுகிறது.", s3: "3. தரவு பாதுகாப்பு", s3d: "256-பிட் SSL குறியாக்கம், PCI-DSS இணக்கம் மற்றும் வழக்கமான பாதுகாப்பு தணிக்கைகளை செயல்படுத்துகிறோம்.", s4: "4. உங்கள் உரிமைகள்", s4d: "எந்த நேரத்திலும் உங்கள் தனிப்பட்ட தரவை அணுக, மாற்ற அல்லது நீக்க உங்களுக்கு உரிமை உண்டு." },
  te: { title: "గోప్యతా విధానం", updated: "చివరి అప్‌డేట్: ఏప్రిల్ 4, 2026", intro: "ట్రిప్‌సాథీ మీ వ్యక్తిగత సమాచారాన్ని ఎలా సేకరిస్తుంది, ఉపయోగిస్తుంది మరియు రక్షిస్తుంది అనేది ఈ గోప్యతా విధానం వివరిస్తుంది.", s1: "1. మేము సేకరించే సమాచారం", s1d: "మీరు నేరుగా అందించే సమాచారాన్ని సేకరిస్తాము: పేరు, ఇమెయిల్, ఫోన్, చెల్లింపు వివరాలు మరియు ప్రయాణ ప్రాధాన్యతలు.", s2: "2. మీ డేటాను ఎలా ఉపయోగిస్తాము", s2d: "బుకింగ్‌లను ప్రాసెస్ చేయడానికి, కస్టమర్ సపోర్ట్ అందించడానికి, ప్రయాణ సిఫారసులను వ్యక్తిగతీకరించడానికి మీ డేటా ఉపయోగించబడుతుంది.", s3: "3. డేటా భద్రత", s3d: "256-బిట్ SSL ఎన్‌క్రిప్షన్, PCI-DSS సమ్మతి మరియు సాధారణ భద్రతా ఆడిట్‌లను అమలు చేస్తాము.", s4: "4. మీ హక్కులు", s4d: "ఎప్పుడైనా మీ వ్యక్తిగత డేటాను యాక్సెస్ చేయడానికి, మార్చడానికి లేదా తొలగించడానికి మీకు హక్కు ఉంది." },
  mr: { title: "गोपनीयता धोरण", updated: "शेवटचे अपडेट: 4 एप्रिल, 2026", intro: "ट्रिपसाथी तुमची वैयक्तिक माहिती कशी गोळा करते, वापरते आणि संरक्षित करते हे हे गोपनीयता धोरण वर्णन करते.", s1: "1. आम्ही गोळा करत असलेली माहिती", s1d: "तुम्ही थेट प्रदान करत असलेली माहिती आम्ही गोळा करतो: नाव, ईमेल, फोन, पेमेंट तपशील आणि प्रवास प्राधान्ये.", s2: "2. तुमचा डेटा कसा वापरतो", s2d: "तुमचा डेटा बुकिंग प्रक्रिया करण्यासाठी, ग्राहक सहाय्य प्रदान करण्यासाठी, प्रवास शिफारशी वैयक्तिकृत करण्यासाठी वापरला जातो.", s3: "3. डेटा सुरक्षा", s3d: "आम्ही 256-बिट SSL एन्क्रिप्शन, PCI-DSS अनुपालन आणि नियमित सुरक्षा ऑडिट अंमलात आणतो.", s4: "4. तुमचे अधिकार", s4d: "तुम्हाला कोणत्याही वेळी तुमच्या वैयक्तिक डेटावर प्रवेश, बदल किंवा हटवण्याचा अधिकार आहे." },
}
export default function PrivacyPage() {
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
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s4}</h2><p>{t.s4d}</p>
        </div>
      </div>
    </div>
  )
}
