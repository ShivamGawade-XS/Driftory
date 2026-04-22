"use client"
import { useLanguage } from "@/context/LanguageContext"
const str: Record<string, Record<string, string>> = {
  en: { title: "Cancellation Policy", updated: "Last updated: April 4, 2026", intro: "At TripSathi, we understand that travel plans change. We enforce a transparent cancellation policy.", s1: "1. Tour Packages", s1a: "48+ Hours Before Departure: Free Cancellation (100% refund minus transaction fees).", s1b: "24 to 48 Hours Before Departure: 50% Penalty.", s1c: "Less than 24 Hours: No Show / No Refund.", s2: "2. Hotel Bookings", s2d: "Hotel cancellation policies vary per property and rate type. Generally, 24-hour notice is required to avoid a one-night charge penalty.", s3: "3. Train Tickets", s3d: "Train cancellations follow Indian Railways rules. E-tickets can be cancelled up to 4 hours before departure. Standard IRCTC deduction charges (₹60 to ₹240) apply.", s4: "4. How to Cancel", s4d: "Log in → My Trips → Select booking → Click 'Cancel Booking'." },
  hi: { title: "रद्दीकरण नीति", updated: "अंतिम अपडेट: 4 अप्रैल, 2026", intro: "ट्रिपसाथी में, हम समझते हैं कि यात्रा योजनाएं बदलती हैं।", s1: "1. टूर पैकेज", s1a: "प्रस्थान से 48+ घंटे पहले: निःशुल्क रद्दीकरण (लेनदेन शुल्क के अलावा 100% रिफंड)।", s1b: "प्रस्थान से 24 से 48 घंटे पहले: 50% जुर्माना।", s1c: "24 घंटे से कम: नो शो / कोई रिफंड नहीं।", s2: "2. होटल बुकिंग", s2d: "होटल रद्दीकरण नीतियां प्रत्येक संपत्ति और दर प्रकार के अनुसार भिन्न होती हैं।", s3: "3. ट्रेन टिकट", s3d: "ट्रेन रद्दीकरण भारतीय रेलवे नियमों का पालन करता है। ई-टिकट प्रस्थान से 4 घंटे पहले तक रद्द किए जा सकते हैं।", s4: "4. कैसे रद्द करें", s4d: "लॉगिन करें → मेरी यात्राएं → बुकिंग चुनें → 'बुकिंग रद्द करें' पर क्लिक करें।" },
  ta: { title: "ரத்து கொள்கை", updated: "கடைசி புதுப்பிப்பு: ஏப்ரல் 4, 2026", intro: "பயணத் திட்டங்கள் மாறும் என்பதை நாங்கள் புரிந்துகொள்கிறோம்.", s1: "1. டூர் பேக்கேஜ்கள்", s1a: "புறப்படுவதற்கு 48+ மணி: இலவச ரத்து (100% பணத்திருப்பு).", s1b: "24 முதல் 48 மணி: 50% அபராதம்.", s1c: "24 மணிக்கும் குறைவு: நோ ஷோ / பணத்திருப்பு இல்லை.", s2: "2. ஹோட்டல் புக்கிங்", s2d: "ஹோட்டல் ரத்து கொள்கைகள் ஒவ்வொரு சொத்து மற்றும் கட்டண வகையின் படி மாறுபடும்.", s3: "3. ரயில் டிக்கெட்டுகள்", s3d: "ரயில் ரத்துகள் இந்திய ரயில்வே விதிகளைப் பின்பற்றுகின்றன.", s4: "4. எவ்வாறு ரத்து செய்வது", s4d: "உள்நுழைக → எனது பயணங்கள் → புக்கிங் தேர்ந்தெடுக → 'புக்கிங் ரத்து' கிளிக் செய்யவும்." },
  te: { title: "రద్దు విధానం", updated: "చివరి అప్‌డేట్: ఏప్రిల్ 4, 2026", intro: "ప్రయాణ ప్రణాళికలు మారతాయని మేము అర్థం చేసుకుంటాము.", s1: "1. టూర్ ప్యాకేజీలు", s1a: "బయలుదేరడానికి 48+ గంటల ముందు: ఉచిత రద్దు (100% రీఫండ్).", s1b: "24 నుండి 48 గంటల ముందు: 50% పెనాల్టీ.", s1c: "24 గంటల కంటే తక్కువ: నో షో / రీఫండ్ లేదు.", s2: "2. హోటల్ బుకింగ్‌లు", s2d: "హోటల్ రద్దు విధానాలు ప్రతి ఆస్తి మరియు రేటు రకం ప్రకారం మారుతాయి.", s3: "3. రైలు టిక్కెట్లు", s3d: "రైలు రద్దులు భారతీయ రైల్వే నియమాలను అనుసరిస్తాయి.", s4: "4. ఎలా రద్దు చేయాలి", s4d: "లాగిన్ → నా ట్రిప్‌లు → బుకింగ్ ఎంచుకోండి → 'బుకింగ్ రద్దు చేయి' క్లిక్ చేయండి." },
  mr: { title: "रद्दीकरण धोरण", updated: "शेवटचे अपडेट: 4 एप्रिल, 2026", intro: "प्रवास योजना बदलत असतात हे आम्ही समजतो.", s1: "1. टूर पॅकेजेस", s1a: "निर्गमनापूर्वी 48+ तास: मोफत रद्दीकरण (100% रिफंड).", s1b: "24 ते 48 तास आधी: 50% दंड.", s1c: "24 तासांपेक्षा कमी: नो शो / रिफंड नाही.", s2: "2. हॉटेल बुकिंग", s2d: "हॉटेल रद्दीकरण धोरणे प्रत्येक मालमत्ता आणि दर प्रकारानुसार बदलतात.", s3: "3. ट्रेन तिकिटे", s3d: "ट्रेन रद्दीकरण भारतीय रेल्वे नियमांचे पालन करते.", s4: "4. कसे रद्द करावे", s4d: "लॉगिन करा → माझे प्रवास → बुकिंग निवडा → 'बुकिंग रद्द करा' वर क्लिक करा." },
}
export default function CancellationPage() {
  const { locale } = useLanguage()
  const t = str[locale] || str.en
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="font-display text-4xl font-bold text-surface-800 mb-2">{t.title}</h1>
        <p className="text-surface-500 mb-8 pb-4 border-b">{t.updated}</p>
        <div className="prose prose-surface max-w-none text-surface-600 space-y-6">
          <p>{t.intro}</p>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s1}</h2>
          <ul className="list-disc pl-5 space-y-2"><li><strong>{t.s1a}</strong></li><li><strong>{t.s1b}</strong></li><li><strong>{t.s1c}</strong></li></ul>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s2}</h2><p>{t.s2d}</p>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s3}</h2><p>{t.s3d}</p>
          <h2 className="text-xl font-bold text-surface-800 pt-4">{t.s4}</h2><p>{t.s4d}</p>
        </div>
      </div>
    </div>
  )
}
