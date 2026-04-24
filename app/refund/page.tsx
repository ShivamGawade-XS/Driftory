"use client"
import { useLanguage } from "@/context/LanguageContext"
const str: Record<string, Record<string, string>> = {
  en: { title: "Refund Policy", updated: "Last updated: April 4, 2026", intro: "This Refund Policy outlines how financial returns are processed when a booking is modified, cancelled, or fails during payment.", s1: "1. Payment Gateway Failures", s1d: "If your booking fails but money was deducted, it will be auto-refunded to your original payment method within 3 to 5 business days.", s2: "2. Successful Cancellations", s2d: "If you cancel within the allowable window, your refund will be deposited to your original payment method within 5 to 7 business days. Convenience fees are non-refundable.", s3: "3. Operator-Initiated Cancellations", s3d: "If an operator cancels due to weather, strikes, or faults, you are entitled to a 100% full refund including convenience fees." },
  hi: { title: "रिफंड नीति", updated: "अंतिम अपडेट: 4 अप्रैल, 2026", intro: "यह रिफंड नीति बताती है कि बुकिंग संशोधित, रद्द या भुगतान विफल होने पर वित्तीय रिटर्न कैसे प्रोसेस किया जाता है।", s1: "1. भुगतान गेटवे विफलताएं", s1d: "अगर बुकिंग विफल हो जाती है लेकिन पैसा कट जाता है, तो 3 से 5 कार्यदिवसों में स्वचालित रूप से रिफंड हो जाएगा।", s2: "2. सफल रद्दीकरण", s2d: "अनुमत अवधि में रद्द करने पर 5 से 7 कार्यदिवसों में रिफंड। सुविधा शुल्क अ-वापसीयोग्य हैं।", s3: "3. ऑपरेटर-प्रारंभित रद्दीकरण", s3d: "मौसम, हड़ताल या दोषों के कारण ऑपरेटर रद्द करता है तो सुविधा शुल्क सहित 100% पूर्ण रिफंड।" },
  ta: { title: "பணத்திருப்பு கொள்கை", updated: "கடைசி புதுப்பிப்பு: ஏப்ரல் 4, 2026", intro: "புக்கிங் மாற்றப்படும், ரத்து செய்யப்படும் அல்லது கட்டணம் தோல்வியடையும் போது நிதித் திருப்பங்கள் எவ்வாறு செயல்படுத்தப்படுகின்றன.", s1: "1. கட்டண நுழைவாயில் தோல்விகள்", s1d: "புக்கிங் தோல்வியடைந்தால் ஆனால் பணம் கழிக்கப்பட்டால், 3 முதல் 5 வணிக நாட்களில் தானாக திருப்பியளிக்கப்படும்.", s2: "2. வெற்றிகரமான ரத்துகள்", s2d: "அனுமதிக்கப்பட்ட காலத்திற்குள் ரத்து செய்தால் 5 முதல் 7 வணிக நாட்களில் பணம் திருப்பியளிக்கப்படும்.", s3: "3. ஆபரேட்டர் ரத்துகள்", s3d: "வானிலை, வேலைநிறுத்தம் காரணமாக ஆபரேட்டர் ரத்து செய்தால் கட்டணம் உட்பட 100% முழுப் பணத்திருப்பு." },
  te: { title: "రీఫండ్ విధానం", updated: "చివరి అప్‌డేట్: ఏప్రిల్ 4, 2026", intro: "బుకింగ్ మార్చబడినప్పుడు, రద్దు చేయబడినప్పుడు లేదా చెల్లింపు విఫలమైనప్పుడు ఆర్థిక రాబడులు ఎలా ప్రాసెస్ చేయబడతాయి.", s1: "1. చెల్లింపు గేట్‌వే వైఫల్యాలు", s1d: "బుకింగ్ విఫలమైతే కానీ డబ్బు తీసివేయబడితే, 3 నుండి 5 వ్యాపార రోజుల్లో ఆటోమేటిక్‌గా రీఫండ్ చేయబడుతుంది.", s2: "2. విజయవంతమైన రద్దులు", s2d: "అనుమతించబడిన కాలంలో రద్దు చేస్తే 5 నుండి 7 వ్యాపార రోజుల్లో రీఫండ్.", s3: "3. ఆపరేటర్ రద్దులు", s3d: "వాతావరణం, సమ్మెల కారణంగా ఆపరేటర్ రద్దు చేస్తే ఫీజు సహా 100% పూర్తి రీఫండ్." },
  mr: { title: "रिफंड धोरण", updated: "शेवटचे अपडेट: 4 एप्रिल, 2026", intro: "बुकिंग बदलल्यावर, रद्द केल्यावर किंवा पेमेंट अयशस्वी झाल्यावर आर्थिक परतावे कसे प्रक्रिया केले जातात.", s1: "1. पेमेंट गेटवे अपयश", s1d: "बुकिंग अयशस्वी झाली पण पैसे कापले गेले तर 3 ते 5 कार्यदिवसांत स्वयंचलितपणे रिफंड होईल.", s2: "2. यशस्वी रद्दीकरण", s2d: "अनुमत कालावधीत रद्द केल्यास 5 ते 7 कार्यदिवसांत रिफंड.", s3: "3. ऑपरेटर रद्दीकरण", s3d: "हवामान, संप किंवा दोषांमुळे ऑपरेटर रद्द केल्यास शुल्कासह 100% पूर्ण रिफंड." },
}
export default function RefundPage() {
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
