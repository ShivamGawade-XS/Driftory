"use client"
import { useState, useEffect } from "react"
import { useLanguage } from "@/context/LanguageContext"

interface FAQ { id: string; category: string; question: string; answer: string }

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const { locale } = useLanguage()

  const faqStrings: Record<string, Record<string, string>> = {
    en: { title: "How can we help?", subtitle: "Find answers to common questions", searchPh: "Search FAQs...", noMatch: "No matching FAQs found", stillQ: "Still have questions?", support: "Our support team is available 24/7", all: "All", booking: "Booking", payment: "Payment", travel: "Travel", supportCat: "Support", account: "Account" },
    hi: { title: "हम कैसे मदद कर सकते हैं?", subtitle: "सामान्य प्रश्नों के उत्तर खोजें", searchPh: "प्रश्न खोजें...", noMatch: "कोई मिलता-जुलता प्रश्न नहीं मिला", stillQ: "अभी भी सवाल हैं?", support: "हमारी सहायता टीम 24/7 उपलब्ध है", all: "सभी", booking: "बुकिंग", payment: "भुगतान", travel: "यात्रा", supportCat: "सहायता", account: "खाता" },
    ta: { title: "நாங்கள் எப்படி உதவலாம்?", subtitle: "பொதுவான கேள்விகளுக்கான பதில்களைக் கண்டறியுங்கள்", searchPh: "கேள்விகளைத் தேடுங்கள்...", noMatch: "பொருத்தமான கேள்விகள் இல்லை", stillQ: "இன்னும் கேள்விகள் உள்ளதா?", support: "எங்கள் ஆதரவு குழு 24/7 கிடைக்கும்", all: "அனைத்தும்", booking: "புக்கிங்", payment: "கட்டணம்", travel: "பயணம்", supportCat: "ஆதரவு", account: "கணக்கு" },
    te: { title: "మేము ఎలా సహాయం చేయగలము?", subtitle: "సాధారణ ప్రశ్నలకు సమాధానాలు కనుగొనండి", searchPh: "ప్రశ్నలు శోధించండి...", noMatch: "సరిపోలే ప్రశ్నలు కనుగొనబడలేదు", stillQ: "ఇంకా ప్రశ్నలు ఉన్నాయా?", support: "మా సపోర్ట్ టీమ్ 24/7 అందుబాటులో ఉంది", all: "అన్నీ", booking: "బుకింగ్", payment: "చెల్లింపు", travel: "ప్రయాణం", supportCat: "సహాయం", account: "ఖాతా" },
    mr: { title: "आम्ही कशी मदत करू शकतो?", subtitle: "सामान्य प्रश्नांची उत्तरे शोधा", searchPh: "प्रश्न शोधा...", noMatch: "जुळणारे प्रश्न सापडले नाहीत", stillQ: "अजून प्रश्न आहेत?", support: "आमची सहाय्य टीम 24/7 उपलब्ध आहे", all: "सर्व", booking: "बुकिंग", payment: "पेमेंट", travel: "प्रवास", supportCat: "सहाय्य", account: "खाते" },
  }
  const s = faqStrings[locale] || faqStrings.en

  const translations: Record<string, Record<string, { q: string; a: string }>> = {
    hi: { FAQ001: { q: "मैं टूर पैकेज कैसे बुक करूं?", a: "हमारे पैकेज ब्राउज़ करें, एक चुनें, तिथियां और यात्रियों की संख्या चुनें, फिर बुकिंग फॉर्म भरें।" }, FAQ002: { q: "क्या मैं अपनी बुकिंग रद्द या संशोधित कर सकता हूं?", a: "हां, 48 घंटे पहले तक पूर्ण रिफंड। 48 घंटे के भीतर 20% शुल्क। संशोधन के लिए समर्थन से संपर्क करें।" }, FAQ003: { q: "आप कौन से भुगतान तरीके स्वीकार करते हैं?", a: "UPI, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग और Paytm/PhonePe। ₹10,000+ पर EMI।" }, FAQ004: { q: "क्या ट्रिपसाथी पर ऑनलाइन भुगतान सुरक्षित है?", a: "हाँ। 256-बिट SSL एन्क्रिप्टेड, रेजरपे के माध्यम से।" }, FAQ005: { q: "अपनी यात्रा के लिए मुझे क्या पैक करना चाहिए?", a: "हम बुकिंग के बाद विस्तृत सूची भेजते हैं। सामान्यतः आरामदायक कपड़े और आईडी। " }, FAQ006: { q: "क्या पैकेज में भोजन शामिल है?", a: "यह पैकेज पर निर्भर करता है। 'समावेशन' विवरण जांचें।" }, FAQ007: { q: "मैं ग्राहक सहायता से कैसे संपर्क कर सकता हूं?", a: "लाइव चैट, support@tripsathi.com और 1800-TRIP-SAT पर 24/7।" }, FAQ008: { q: "यात्रा के दौरान कोई समस्या हो तो?", a: "समन्वयक और हमारा 24/7 आपातकालीन नंबर उपलब्ध है।" }, FAQ009: { q: "लॉयल्टी पॉइंट कैसे काम करते हैं?", a: "₹100 पर 1 बिंदु। भविष्य की बुकिंग पर भुनाएं (100 अंक = ₹50)।" }, FAQ010: { q: "मैं अपनी इच्छा सूची का प्रबंधन कैसे करूं?", a: "पसंदीदा पैकेज के लिए दिल आइकन पर क्लिक करें।" } },
    ta: { FAQ001: { q: "டூர் பேக்கேஜை நான் எப்படி முன்பதிவு செய்வது?", a: "எங்கள் பேக்கேஜ்களை உலாவவும், ஒன்றைத் தேர்ந்து, பயணிகளுக்கான படிவத்தை நிரப்பவும்." }, FAQ002: { q: "எனது முன்பதிவை ரத்து செய்ய முடியுமா?", a: "ஆம், 48 மணி நேரத்திற்கு முன் வரை முழுப் பணத்திருப்பு. 48 மணி நேரத்திற்குள் 20% கட்டணம்." }, FAQ003: { q: "நீங்கள் என்ன கட்டண முறைகளை ஏற்றுக்கொள்கிறீர்கள்?", a: "UPI, கார்டுகள் மற்றும் Paytm போன்ற வாலட்கள். ₹10,000+ க்கு EMI." }, FAQ004: { q: "ஆன்லைன் கட்டணம் பாதுகாப்பானதா?", a: "முற்றிலும். 256-bit SSL மூலம் பாதுகாக்கப்பட்டது." }, FAQ005: { q: "பயணத்திற்கு என்ன எடுத்துச் செல்ல வேண்டும்?", a: "முன்பதிவுக்குப் பின் ஒரு பட்டியலை அனுப்புகிறோம். ஐடி மற்றும் உடைகள்." }, FAQ006: { q: "உணவு உள்ளடக்கப்பட்டுள்ளதா?", a: "பேக்கேஜை பொறுத்து மாறும். விவரங்களைச் சரிபார்க்கவும்." }, FAQ007: { q: "வாடிக்கையாளர் ஆதரவை நான் எவ்வாறு தொடர்பு கொள்ள முடியும்?", a: "லைவ் சாட், மின்னஞ்சல் மற்றும் 1800-TRIP-SAT 24/7 கிடைக்கும்." }, FAQ008: { q: "பயணத்தின் போது சிக்கல்கள் வந்தால்?", a: "ஒருங்கிணைப்பாளர் மற்றும் 24/7 அவசர எண் உள்ளது." }, FAQ009: { q: "விசுவாச புள்ளிகள் எப்படி வேலை செய்யும்?", a: "₹100 க்கு 1 புள்ளி. பின்னர் மீட்டெடுக்கலாம் (100 புள்ளிகள் = ₹50)." }, FAQ010: { q: "விருப்பப்பட்டியலை எப்படி நிர்வகிப்பது?", a: "விருப்பப்பட்டியலில் சேர்க்க இதயம் ஐகானை கிளிக் செய்யவும்." } },
    te: { FAQ001: { q: "టూర్ ప్యాకేజీని నేను ఎలా బుక్ చేయాలి?", a: "ప్యాకేజీలను బ్రౌజ్ చేయండి, ఒకదాన్ని ఎంచుకోండి, ప్రయాణికులను ఎంచుకుని, బుకింగ్ పూర్తి చేయండి." }, FAQ002: { q: "నా బుకింగ్‌ని మార్చగలనా లేదా రద్దు చేయగలనా?", a: "అవును, 48 గంటల ముందు వరకు పూర్తి వాపసు. 48 గంటల లోపు 20% రుసుము." }, FAQ003: { q: "మీరు ఎలాంటి చెల్లింపు విధానాలను అంగీకరిస్తారు?", a: "UPI, క్రెడిట్ కార్డ్‌లు, మరియు Paytm/PhonePe. ₹10,000+ కి EMI సదుపాయం." }, FAQ004: { q: "ఆన్‌లైన్ చెల్లింపు సురక్షితమేనా?", a: "ఖచ్చితంగా. 256-bit SSL ఇన్క్రిప్షన్ ద్వారా సురక్షితమైన రేజర్‌పే వాడుతాము." }, FAQ005: { q: "నా ట్రిప్ కోసం నేను ఏమి ప్యాక్ చేయాలి?", a: "బుకింగ్ తర్వాత ప్యాకింగ్ జాబితాను పంపుతాము." }, FAQ006: { q: "ప్యాకేజీలో భోజనం ఉంటుందా?", a: "ఇది ప్యాకేజీని బట్టి మారుతుంది. 'చేరికలు' వివరాలను చూడండి." }, FAQ007: { q: "కస్టమర్ సపోర్ట్‌ని ఎలా సంప్రదించాలి?", a: "మా వెబ్‌సైట్ లైవ్ చాట్, లేదా 1800-TRIP-SAT ద్వారా 24/7 సంప్రదించవచ్చు." }, FAQ008: { q: "ప్రయాణంలో సమస్యలు వస్తే?", a: "మా కోఆర్డినేటర్ మరియు 24/7 ఎమర్జెన్సీ నంబర్ సహాయం చేస్తారు." }, FAQ009: { q: "లాయల్టీ పాయింట్లు ఎలా పనిచేస్తాయి?", a: "₹100 ఖర్చుకు 1 పాయింట్. (100 పాయింట్లు = ₹50 డిస్కౌంట్)." }, FAQ010: { q: "విష్ లిస్ట్ ఎలా మేనేజ్ చేయాలి?", a: "ప్యాకేజీపై ఉన్న హార్ట్ ఐకాన్‌ను క్లిక్ చేసి విష్ లిస్ట్‌లో చేర్చవచ్చు." } },
    mr: { FAQ001: { q: "मी टूर पॅकेज कसे बुक करू?", a: "आमचे पॅकेजेस ब्राउझ करा, एक निवडा, प्रवाशांची माहिती द्या आणि बुकिंग पूर्ण करा." }, FAQ002: { q: "मी माझे बुकिंग रद्द करू शकतो का?", a: "होय, 48 तास आधी पूर्ण परतावा. 48 तासांच्या आत 20% शुल्क." }, FAQ003: { q: "कोणते पेमेंट पर्याय उपलब्ध आहेत?", a: "UPI, कार्ड्स, नेट बँकिंग आणि Paytm. ₹10,000+ वर EMI." }, FAQ004: { q: "ऑनलाइन पेमेंट सुरक्षित आहे का?", a: "नक्कीच. 256-bit SSL ने सुरक्षित केलेले." }, FAQ005: { q: "सहलीत काय सोबत ठेवावे?", a: "आम्ही बुकिंगनंतर यादी पाठवतो. आईडी आणि आरामदायी कपडे." }, FAQ006: { q: "जेवणाचा समावेश आहे का?", a: "पॅकेजवर अवलंबून आहे. 'समाविष्ट' विभाग तपासा." }, FAQ007: { q: "ग्राहक सेवा कशी गाठावी?", a: "लाइव चॅट, ईमेल आणि 1800-TRIP-SAT वर 24/7 मदत." }, FAQ008: { q: "प्रवासातील समस्यांवर काय?", a: "आमचा समन्वयक आणि 24/7 आणीबाणी क्रमांक उपलबध आहे." }, FAQ009: { q: "लॉयल्टी पॉइंट्स कसे काम करतात?", a: "₹100 ला 1 पॉइंट. (100 पॉइंट्स = ₹50)." }, FAQ010: { q: "माझी विशलिस्ट कशी व्यवस्थापित करू?", a: "पॅकेजवरील हार्ट आयकॉनवर क्लिक करा." } }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/faqs?locale=${locale}`)
      .then(r => r.json())
      .then(d => { setFaqs(d.faqs); setCategories(d.categories) })
      .catch(() => {})
  }, [locale])

  const filtered = faqs.filter(f => {
    const matchCat = activeCategory === "all" || f.category === activeCategory
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const catLabels: Record<string, { icon: string; label: string }> = {
    booking: { icon: "📋", label: "Booking" },
    payment: { icon: "💳", label: "Payment" },
    travel: { icon: "✈️", label: "Travel" },
    support: { icon: "🎧", label: "Support" },
    account: { icon: "👤", label: "Account" },
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">{s.title}</h1>
          <p className="mt-3 text-white/80 text-lg">{s.subtitle}</p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <input type="text" placeholder={s.searchPh} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-6 py-4 pl-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 outline-none text-lg" />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setActiveCategory("all")} className={`px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all ${activeCategory === "all" ? "bg-primary-600 text-white" : "bg-white text-surface-600 hover:bg-surface-100"}`}>{s.all}</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all ${activeCategory === cat ? "bg-primary-600 text-white" : "bg-white text-surface-600 hover:bg-surface-100"}`}>
              {catLabels[cat]?.icon} {catLabels[cat]?.label || cat}
            </button>
          ))}
        </div>
        <div className="mt-8 space-y-3 pb-16">
          {filtered.length === 0 ? <p className="text-center text-surface-400 py-12">{s.noMatch}</p> : filtered.map(faq => {
            const trans = translations[locale]?.[faq.id] || { q: faq.question, a: faq.answer };
            return (
              <div key={faq.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full px-6 py-5 flex items-center justify-between text-left">
                  <span className="font-medium text-surface-800 pr-4">{trans.q}</span>
                  <span className={`text-primary-500 text-xl transition-transform ${openId === faq.id ? "rotate-45" : ""}`}>+</span>
                </button>
                {openId === faq.id && <div className="px-6 pb-5 text-surface-600 text-sm leading-relaxed border-t border-surface-100 pt-4">{trans.a}</div>}
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="font-display text-2xl font-bold">{s.stillQ}</h2>
          <p className="mt-2 text-white/80">{s.support}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="mailto:24co35@aitdgoa.edu.in" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors border border-white/10 shadow-sm backdrop-blur">📧 24co35@aitdgoa.edu.in</a>
            <a href="tel:+917218694977" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors border border-white/10 shadow-sm backdrop-blur">📞 +91 7218694977</a>
          </div>
        </div>
      </div>
    </div>
  )
}
