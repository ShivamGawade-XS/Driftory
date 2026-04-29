"use client"
import { useState, useEffect } from "react"
import { useLanguage } from "@/context/LanguageContext"

interface Message { role: "user" | "bot"; text: string }

const chatStrings: Record<string, Record<string, string>> = {
  en: {
    title: "TripSathi Support",
    status: "Online • Replies instantly",
    placeholder: "Type a message...",
    greeting: "Namaste! 🙏 I'm TripSathi's virtual assistant. How can I help you plan your next adventure?",
    qr1: "How do I book a package?",
    qr2: "Cancel my booking",
    qr3: "Payment methods?",
    qr4: "I have a complaint",
    book: "You can browse our packages at /packages, select one, choose your dates and travelers, and complete the booking form. It's quick and easy! 🎉",
    cancel: "You can cancel your booking up to 48 hours before travel for a full refund. Go to your Dashboard → My Bookings → Cancel. For help, call +91 7218694977.",
    payment: "We accept UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, Paytm, and PhonePe. EMI available for bookings above ₹10,000.",
    complaint: "I'm sorry to hear that. Please email 24co35@aitdgoa.edu.in with your booking reference and details. Our team will respond within 2 hours.",
    hello: "Hello! 👋 How can I assist you with your travel plans?",
    price: "Our packages start from ₹6,999. Visit /packages to see all options with current discounts!",
    refund: "Refunds are processed within 5-7 business days. Full refund for cancellations 48+ hours before travel.",
    fallback: "Thanks for your message! For detailed assistance, please email 24co35@aitdgoa.edu.in or call +91 7218694977 (toll-free). Our team is available 24/7. 🌟",
  },
  hi: {
    title: "ट्रिपसाथी सहायता",
    status: "ऑनलाइन • तुरंत जवाब",
    placeholder: "संदेश लिखें...",
    greeting: "नमस्ते! 🙏 मैं ट्रिपसाथी का वर्चुअल सहायक हूँ। आपकी अगली यात्रा की योजना बनाने में कैसे मदद कर सकता हूँ?",
    qr1: "पैकेज कैसे बुक करें?",
    qr2: "बुकिंग रद्द करें",
    qr3: "भुगतान के तरीके?",
    qr4: "मुझे शिकायत है",
    book: "आप /packages पर हमारे पैकेज ब्राउज़ कर सकते हैं, एक चुनें, तारीख और यात्रियों का चयन करें, और बुकिंग फॉर्म भरें। यह आसान है! 🎉",
    cancel: "यात्रा से 48 घंटे पहले तक पूर्ण रिफंड के लिए बुकिंग रद्द कर सकते हैं। डैशबोर्ड → मेरी बुकिंग → रद्द करें पर जाएं। मदद के लिए +91 7218694977 पर कॉल करें।",
    payment: "हम UPI, क्रेडिट/डेबिट कार्ड (Visa, Mastercard, RuPay), नेट बैंकिंग, Paytm और PhonePe स्वीकार करते हैं। ₹10,000 से ऊपर की बुकिंग पर EMI उपलब्ध है।",
    complaint: "यह सुनकर दुख हुआ। कृपया अपनी बुकिंग संदर्भ संख्या के साथ 24co35@aitdgoa.edu.in पर ईमेल करें। हमारी टीम 2 घंटे में जवाब देगी।",
    hello: "नमस्ते! 👋 आपकी यात्रा योजनाओं में कैसे मदद कर सकता हूँ?",
    price: "हमारे पैकेज ₹6,999 से शुरू हैं। छूट देखने के लिए /packages पर जाएं!",
    refund: "रिफंड 5-7 कार्यदिवसों में प्रोसेस होता है। यात्रा से 48+ घंटे पहले रद्द करने पर पूर्ण रिफंड।",
    fallback: "आपके संदेश के लिए धन्यवाद! विस्तृत सहायता के लिए 24co35@aitdgoa.edu.in पर ईमेल करें या +91 7218694977 (टोल-फ्री) पर कॉल करें। हमारी टीम 24/7 उपलब्ध है। 🌟",
  },
  ta: {
    title: "டிரிப்சாதி உதவி",
    status: "ஆன்லைன் • உடனடி பதில்",
    placeholder: "செய்தி தட்டச்சு செய்யவும்...",
    greeting: "வணக்கம்! 🙏 நான் டிரிப்சாதியின் மெய்நிகர் உதவியாளர். உங்கள் அடுத்த பயணத்தை திட்டமிட எப்படி உதவ வேண்டும்?",
    qr1: "பேக்கேஜ் எப்படி புக் செய்வது?",
    qr2: "புக்கிங் ரத்து செய்ய",
    qr3: "கட்டண முறைகள்?",
    qr4: "எனக்கு புகார் உள்ளது",
    book: "/packages இல் எங்கள் பேக்கேஜ்களை பார்க்கலாம், ஒன்றைத் தேர்ந்தெடுக்கவும், தேதிகள் மற்றும் பயணிகளைத் தேர்ந்தெடுத்து, புக்கிங் படிவத்தை நிரப்பவும். இது எளிதானது! 🎉",
    cancel: "பயணத்திற்கு 48 மணி நேரத்திற்கு முன் முழு பணத்திற்குப் புக்கிங் ரத்து செய்யலாம். டாஷ்போர்டு → எனது புக்கிங்ஸ் → ரத்து செய்யவும்.",
    payment: "UPI, கிரெடிட்/டெபிட் கார்டுகள் (Visa, Mastercard, RuPay), நெட் பேங்கிங், Paytm மற்றும் PhonePe ஏற்றுக்கொள்கிறோம்.",
    complaint: "இதைக் கேட்டு வருந்துகிறேன். உங்கள் புக்கிங் குறிப்பு எண்ணுடன் 24co35@aitdgoa.edu.in க்கு மின்னஞ்சல் அனுப்பவும்.",
    hello: "வணக்கம்! 👋 உங்கள் பயணத் திட்டங்களில் எப்படி உதவ முடியும்?",
    price: "எங்கள் பேக்கேஜ்கள் ₹6,999 முதல் தொடங்குகின்றன. /packages பார்க்கவும்!",
    refund: "பணத்தைத் திருப்பி அளிப்பது 5-7 வணிக நாட்களில் செயல்படுத்தப்படும்.",
    fallback: "உங்கள் செய்திக்கு நன்றி! விரிவான உதவிக்கு 24co35@aitdgoa.edu.in அல்லது +91 7218694977 அழைக்கவும். 🌟",
  },
  te: {
    title: "ట్రిప్‌సాథీ సహాయం",
    status: "ఆన్‌లైన్ • వెంటనే సమాధానం",
    placeholder: "సందేశం టైప్ చేయండి...",
    greeting: "నమస్కారం! 🙏 నేను ట్రిప్‌సాథీ వర్చువల్ అసిస్టెంట్. మీ తదుపరి ప్రయాణాన్ని ప్లాన్ చేయడంలో ఎలా సహాయం చేయగలను?",
    qr1: "ప్యాకేజీ ఎలా బుక్ చేయాలి?",
    qr2: "బుకింగ్ రద్దు చేయండి",
    qr3: "చెల్లింపు పద్ధతులు?",
    qr4: "నాకు ఫిర్యాదు ఉంది",
    book: "/packages లో మా ప్యాకేజీలను బ్రౌజ్ చేయండి, ఒకటి ఎంచుకోండి, తేదీలు మరియు ప్రయాణికులను ఎంచుకుని, బుకింగ్ ఫారమ్ పూర్తి చేయండి. 🎉",
    cancel: "ప్రయాణానికి 48 గంటల ముందు పూర్తి రీఫండ్ కోసం బుకింగ్ రద్దు చేయవచ్చు. డ్యాష్‌బోర్డ్ → నా బుకింగ్‌లు → రద్దు చేయండి.",
    payment: "UPI, క్రెడిట్/డెబిట్ కార్డులు (Visa, Mastercard, RuPay), నెట్ బ్యాంకింగ్, Paytm మరియు PhonePe స్వీకరిస్తాము.",
    complaint: "అది విని బాధగా ఉంది. మీ బుకింగ్ రిఫరెన్స్ నంబర్‌తో 24co35@aitdgoa.edu.in కు ఇమెయిల్ పంపండి.",
    hello: "హలో! 👋 మీ ప్రయాణ ప్రణాళికల్లో ఎలా సహాయం చేయగలను?",
    price: "మా ప్యాకేజీలు ₹6,999 నుండి ప్రారంభం. /packages చూడండి!",
    refund: "రీఫండ్‌లు 5-7 వ్యాపార రోజుల్లో ప్రాసెస్ చేయబడతాయి.",
    fallback: "మీ సందేశానికి ధన్యవాదాలు! వివరమైన సహాయం కోసం 24co35@aitdgoa.edu.in లేదా +91 7218694977 కి కాల్ చేయండి. 🌟",
  },
  mr: {
    title: "ट्रिपसाथी मदत",
    status: "ऑनलाइन • लगेच उत्तर",
    placeholder: "संदेश लिहा...",
    greeting: "नमस्कार! 🙏 मी ट्रिपसाथीचा व्हर्च्युअल सहाय्यक आहे. तुमच्या पुढच्या प्रवासाचे नियोजन करण्यात कशी मदत करू शकतो?",
    qr1: "पॅकेज कसे बुक करायचे?",
    qr2: "बुकिंग रद्द करा",
    qr3: "पेमेंट पद्धती?",
    qr4: "मला तक्रार आहे",
    book: "/packages वर आमचे पॅकेजेस ब्राउझ करा, एक निवडा, तारखा आणि प्रवासी निवडा, आणि बुकिंग फॉर्म भरा. हे सोपे आहे! 🎉",
    cancel: "प्रवासाच्या 48 तास आधी पूर्ण रिफंडसाठी बुकिंग रद्द करता येते. डॅशबोर्ड → माझी बुकिंग → रद्द करा वर जा.",
    payment: "आम्ही UPI, क्रेडिट/डेबिट कार्ड (Visa, Mastercard, RuPay), नेट बँकिंग, Paytm आणि PhonePe स्वीकारतो.",
    complaint: "हे ऐकून वाईट वाटले. तुमच्या बुकिंग संदर्भ क्रमांकासह 24co35@aitdgoa.edu.in वर ईमेल करा.",
    hello: "नमस्कार! 👋 तुमच्या प्रवास योजनांमध्ये कशी मदत करू शकतो?",
    price: "आमचे पॅकेजेस ₹6,999 पासून सुरू. /packages पहा!",
    refund: "रिफंड 5-7 कार्यदिवसांत प्रक्रिया केला जातो.",
    fallback: "तुमच्या संदेशाबद्दल धन्यवाद! तपशीलवार मदतीसाठी 24co35@aitdgoa.edu.in वर ईमेल करा किंवा +91 7218694977 वर कॉल करा. 🌟",
  },
}

function getBotReply(msg: string, lang: string): string {
  const s = chatStrings[lang] || chatStrings.en
  const lower = msg.toLowerCase()
  if (lower.includes("book") || lower.includes("बुक") || lower.includes("புக்") || lower.includes("బుక్") || lower.includes("पॅकेज")) return s.book
  if (lower.includes("cancel") || lower.includes("रद्द") || lower.includes("ரத்து") || lower.includes("రద్దు")) return s.cancel
  if (lower.includes("payment") || lower.includes("pay") || lower.includes("भुगतान") || lower.includes("கட்டண") || lower.includes("చెల్లింపు") || lower.includes("पेमेंट")) return s.payment
  if (lower.includes("complaint") || lower.includes("शिकायत") || lower.includes("புகார்") || lower.includes("ఫిర్యాదు") || lower.includes("तक्रार")) return s.complaint
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("नमस्ते") || lower.includes("வணக்கம்") || lower.includes("నమస్కారం") || lower.includes("नमस्कार")) return s.hello
  if (lower.includes("price") || lower.includes("कीमत") || lower.includes("விலை") || lower.includes("ధర") || lower.includes("किंमत")) return s.price
  if (lower.includes("refund") || lower.includes("रिफंड") || lower.includes("பணம்") || lower.includes("రీఫండ్")) return s.refund
  return s.fallback
}

export default function ChatWidget() {
  const { locale } = useLanguage()
  const [open, setOpen] = useState(false)
  const s = chatStrings[locale] || chatStrings.en
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: s.greeting }
  ])
  const [input, setInput] = useState("")

  // Reset chat messages when language changes
  useEffect(() => {
    const str = chatStrings[locale] || chatStrings.en
    setMessages([{ role: "bot", text: str.greeting }])
  }, [locale])

  const quickReplies = [s.qr1, s.qr2, s.qr3, s.qr4]

  const send = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: "user", text }
    setMessages(prev => [...prev, userMsg])
    setInput("")

    try {
      // Localized check for super basic greetings
      const lower = text.toLowerCase()
      if (locale !== 'en' && (lower.includes("hello") || lower.includes("hi") || lower.includes("नमस्ते") || lower.includes("வணக்கம்") || lower.includes("నమస్కారం") || lower.includes("नमस्कार"))) {
        setMessages(prev => [...prev, { role: "bot", text: getBotReply(text, locale) }])
        return
      }

      // Hit Backend NLP Engine for transactional intents
      let sessionId = typeof window !== "undefined" ? localStorage.getItem("tripsathi_chat_id") : null
      if (!sessionId) {
        sessionId = "session_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("tripsathi_chat_id", sessionId)
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/whatsapp/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, phoneId: sessionId })
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: "bot", text: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: "bot", text: getBotReply(text, locale) }])
      }
    } catch {
      // Fallback to local dictionary if backend fails
      setMessages(prev => [...prev, { role: "bot", text: getBotReply(text, locale) }])
    }
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform animate-bounce-slow md:bottom-6 bottom-20"
          aria-label="Open chat">
          💬
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-surface-200 md:bottom-6 bottom-20" style={{ height: "500px", background: "var(--bg-card)" }}>
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
              <div>
                <h3 className="font-bold text-sm">{s.title}</h3>
                <p className="text-xs text-white/70">{s.status}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary-600 text-white rounded-br-md" : "text-surface-700 rounded-bl-md shadow-sm"}`} style={msg.role === "bot" ? { background: "var(--bg-card-hover)" } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 border-t border-surface-100" style={{ background: "var(--bg-card)" }}>
            <div className="flex flex-wrap gap-1 mb-2">
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => send(qr)} className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">{qr}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
                placeholder={s.placeholder} className="flex-1 px-4 py-3 rounded-xl bg-surface-100 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              <button onClick={() => send(input)} className="w-11 h-11 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors text-lg">→</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
