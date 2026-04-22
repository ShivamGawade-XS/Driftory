"use client"
import { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"

const s: Record<string, Record<string, string>> = {
  en: { title: "Contact Us", subtitle: "We're here to help and answer any questions you might have.", send: "Send a Message", firstName: "First Name", lastName: "Last Name", email: "Email Address", message: "Message", submit: "Send Message", success: "Message sent successfully!", successDesc: "Our team will get back to you within 24 hours.", hq: "Headquarters", phone: "Phone Support", callUs: "Call us toll-free:", available: "Available 24/7", emailSupport: "Email Support", general: "For general queries:" },
  hi: { title: "संपर्क करें", subtitle: "हम आपके किसी भी सवाल का जवाब देने के लिए यहां हैं।", send: "संदेश भेजें", firstName: "पहला नाम", lastName: "अंतिम नाम", email: "ईमेल पता", message: "संदेश", submit: "संदेश भेजें", success: "संदेश सफलतापूर्वक भेजा गया!", successDesc: "हमारी टीम 24 घंटे में आपसे संपर्क करेगी।", hq: "मुख्यालय", phone: "फोन सहायता", callUs: "टोल-फ्री कॉल करें:", available: "24/7 उपलब्ध", emailSupport: "ईमेल सहायता", general: "सामान्य प्रश्नों के लिए:" },
  ta: { title: "எங்களை தொடர்பு கொள்க", subtitle: "உங்கள் கேள்விகளுக்கு பதிலளிக்க நாங்கள் இங்கே இருக்கிறோம்.", send: "செய்தி அனுப்பு", firstName: "முதல் பெயர்", lastName: "கடைசி பெயர்", email: "மின்னஞ்சல்", message: "செய்தி", submit: "செய்தி அனுப்பு", success: "செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!", successDesc: "எங்கள் குழு 24 மணி நேரத்தில் உங்களை தொடர்பு கொள்ளும்.", hq: "தலைமையகம்", phone: "தொலைபேசி ஆதரவு", callUs: "கட்டணமில்லா அழைப்பு:", available: "24/7 கிடைக்கும்", emailSupport: "மின்னஞ்சல் ஆதரவு", general: "பொது கேள்விகளுக்கு:" },
  te: { title: "మమ్మల్ని సంప్రదించండి", subtitle: "మీ ప్రశ్నలకు సమాధానం ఇవ్వడానికి మేము ఇక్కడ ఉన్నాము.", send: "సందేశం పంపండి", firstName: "మొదటి పేరు", lastName: "చివరి పేరు", email: "ఇమెయిల్", message: "సందేశం", submit: "సందేశం పంపు", success: "సందేశం విజయవంతంగా పంపబడింది!", successDesc: "మా బృందం 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తుంది.", hq: "ప్రధాన కార్యాలయం", phone: "ఫోన్ సపోర్ట్", callUs: "టోల్-ఫ్రీ కాల్:", available: "24/7 అందుబాటులో", emailSupport: "ఇమెయిల్ సపోర్ట్", general: "సాధారణ ప్రశ్నల కోసం:" },
  mr: { title: "संपर्क साधा", subtitle: "तुमच्या कोणत्याही प्रश्नांची उत्तरे देण्यासाठी आम्ही येथे आहोत.", send: "संदेश पाठवा", firstName: "पहिले नाव", lastName: "आडनाव", email: "ईमेल", message: "संदेश", submit: "संदेश पाठवा", success: "संदेश यशस्वीरित्या पाठवला!", successDesc: "आमची टीम 24 तासांत तुमच्याशी संपर्क साधेल.", hq: "मुख्यालय", phone: "फोन सहाय्य", callUs: "टोल-फ्री कॉल:", available: "24/7 उपलब्ध", emailSupport: "ईमेल सहाय्य", general: "सामान्य प्रश्नांसाठी:" },
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { locale } = useLanguage()
  const t = s[locale] || s.en

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-surface-800">{t.title}</h1>
          <p className="mt-2 text-surface-500">{t.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-surface-800 mb-6">{t.send}</h2>
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
                <span className="text-3xl block mb-2">✅</span>
                <p className="font-bold">{t.success}</p>
                <p className="text-sm mt-1">{t.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-surface-700 mb-1">{t.firstName}</label><input required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-surface-700 mb-1">{t.lastName}</label><input required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                </div>
                <div><label className="block text-sm font-medium text-surface-700 mb-1">{t.email}</label><input type="email" required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                <div><label className="block text-sm font-medium text-surface-700 mb-1">{t.message}</label><textarea required rows={4} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea></div>
                <button type="submit" className="btn-primary w-full py-3">{t.submit}</button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl">📍</div>
              <div><h3 className="font-bold text-surface-800 text-lg">{t.hq}</h3><p className="text-surface-500 mt-1">TripSathi Tower, Mandrem, Pernem<br />North Goa, Goa</p></div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl">📞</div>
              <div><h3 className="font-bold text-surface-800 text-lg">{t.phone}</h3><p className="text-surface-500 mt-1">{t.callUs}<br /><strong>+91 7218694977</strong><br />{t.available}</p></div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl">✉️</div>
              <div><h3 className="font-bold text-surface-800 text-lg">{t.emailSupport}</h3><p className="text-surface-500 mt-1">{t.general}<br /><strong>24co35@aitdgoa.edu.in</strong></p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
