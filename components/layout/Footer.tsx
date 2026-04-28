"use client"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import Logo from "@/components/ui/Logo"

const destinations = [
  { name: "Delhi", href: "/packages?search=Delhi" },
  { name: "Mumbai", href: "/packages?search=Mumbai" },
  { name: "Goa", href: "/packages?search=Goa" },
  { name: "Jaipur", href: "/packages?search=Jaipur" },
  { name: "Kerala", href: "/packages?search=Kerala" },
  { name: "Manali", href: "/packages?search=Manali" },
]

const footerStrings: Record<string, Record<string, string>> = {
  en: { desc: "India's unified travel companion. Compare trains, buses, hotels — all in one place. Plan smarter, travel better.", company: "Company", about: "About Us", careers: "Careers", faqs: "FAQs", contact: "Contact", destinations: "Destinations", tools: "Tools", alerts: "Price Alerts", whatsapp: "WhatsApp Bot", split: "Group Split", legal: "Legal", privacy: "Privacy Policy", terms: "Terms of Service", refund: "Refund Policy", cancellation: "Cancellation Policy", copyright: "All rights reserved. Made with ❤️ in India.", ssl: "256-bit SSL Secured", pci: "PCI-DSS Compliant", indian: "100% Indian" },
  hi: { desc: "भारत का एकीकृत यात्रा साथी। ट्रेन, बस, होटल — सब एक जगह। स्मार्ट प्लानिंग, बेहतर यात्रा।", company: "कंपनी", about: "हमारे बारे में", careers: "करियर", faqs: "सामान्य प्रश्न", contact: "संपर्क", destinations: "गंतव्य", tools: "टूल्स", alerts: "मूल्य अलर्ट", whatsapp: "व्हाट्सएप बॉट", split: "ग्रुप स्प्लिट", legal: "कानूनी", privacy: "गोपनीयता नीति", terms: "सेवा की शर्तें", refund: "रिफंड नीति", cancellation: "रद्दीकरण नीति", copyright: "सर्वाधिकार सुरक्षित। भारत में ❤️ से बनाया।", ssl: "256-बिट SSL सुरक्षित", pci: "PCI-DSS अनुरूप", indian: "100% भारतीय" },
  ta: { desc: "இந்தியாவின் ஒருங்கிணைந்த பயண தோழன். ரயில், பேருந்து, ஹோட்டல் — அனைத்தும் ஒரே இடத்தில்.", company: "நிறுவனம்", about: "எங்களைப் பற்றி", careers: "வேலைவாய்ப்புகள்", faqs: "அடிக்கடி கேட்கப்படும் கேள்விகள்", contact: "தொடர்பு", destinations: "சேருமிடங்கள்", tools: "கருவிகள்", alerts: "விலை எச்சரிக்கைகள்", whatsapp: "வாட்ஸ்அப் பாட்", split: "குழு பிரிப்பு", legal: "சட்டப்பூர்வ", privacy: "தனியுரிமை கொள்கை", terms: "சேவை விதிமுறைகள்", refund: "பணத்திருப்பு கொள்கை", cancellation: "ரத்து கொள்கை", copyright: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. இந்தியாவில் ❤️ உடன் உருவாக்கப்பட்டது.", ssl: "256-பிட் SSL பாதுகாப்பு", pci: "PCI-DSS இணக்கமானது", indian: "100% இந்தியன்" },
  te: { desc: "భారతదేశ ఏకీకృత ప్రయాణ సహచరుడు. రైళ్లు, బస్సులు, హోటళ్లు — అన్నీ ఒకే చోట.", company: "కంపెనీ", about: "మా గురించి", careers: "కెరీర్లు", faqs: "తరచుగా అడిగే ప్రశ్నలు", contact: "సంప్రదింపు", destinations: "గమ్యస్థానాలు", tools: "సాధనాలు", alerts: "ధర హెచ్చరికలు", whatsapp: "వాట్సాప్ బాట్", split: "గ్రూప్ స్ప్లిట్", legal: "చట్టపరమైన", privacy: "గోప్యతా విధానం", terms: "సేవా నిబంధనలు", refund: "రీఫండ్ విధానం", cancellation: "రద్దు విధానం", copyright: "అన్ని హక్కులు రిజర్వు చేయబడ్డాయి. భారతదేశంలో ❤️ తో తయారు చేయబడింది.", ssl: "256-బిట్ SSL సురక్షితం", pci: "PCI-DSS కంప్లైంట్", indian: "100% భారతీయం" },
  mr: { desc: "भारताचा एकीकृत प्रवास साथी. ट्रेन, बस, हॉटेल — सगळं एकाच ठिकाणी.", company: "कंपनी", about: "आमच्याबद्दल", careers: "करिअर", faqs: "सामान्य प्रश्न", contact: "संपर्क", destinations: "गंतव्ये", tools: "साधने", alerts: "किंमत अलर्ट", whatsapp: "व्हाट्सअप बॉट", split: "ग्रुप स्प्लिट", legal: "कायदेशीर", privacy: "गोपनीयता धोरण", terms: "सेवा अटी", refund: "रिफंड धोरण", cancellation: "रद्दीकरण धोरण", copyright: "सर्व हक्क राखीव. भारतात ❤️ ने बनवलेले.", ssl: "256-बिट SSL सुरक्षित", pci: "PCI-DSS अनुरूप", indian: "100% भारतीय" },
}

export default function EnhancedFooter() {
  const { locale } = useLanguage()
  const s = footerStrings[locale] || footerStrings.en

  return (
    <footer className="bg-surface-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-xl mb-1">
              <Logo className="h-12 w-auto" variant="footer" />
            </Link>
            <p className="mt-4 text-surface-400 text-sm leading-relaxed">{s.desc}</p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: "𝕏", url: "https://x.com/tripsathi", label: "X" },
                { icon: "📘", url: "https://facebook.com/tripsathi", label: "Facebook" },
                { icon: "📸", url: "https://instagram.com/tripsathi", label: "Instagram" },
                { icon: "🔗", url: "https://linkedin.com/company/tripsathi", label: "LinkedIn" }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                  className="w-10 h-10 bg-surface-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-colors text-sm">{social.icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-surface-300 mb-4">{s.company}</h3>
            <nav className="space-y-3">
              <Link href="/about" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.about}</Link>
              <Link href="/careers" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.careers}</Link>
              <Link href="/faq" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.faqs}</Link>
              <Link href="/contact" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.contact}</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-surface-300 mb-4">{s.destinations}</h3>
            <nav className="space-y-3">
              {destinations.map(d => (
                <Link key={d.name} href={d.href} className="block text-sm text-surface-400 hover:text-white transition-colors">{d.name}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-surface-300 mb-4">{s.tools}</h3>
            <nav className="space-y-3">
              <Link href="/alerts" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.alerts}</Link>
              <Link href="/whatsapp" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.whatsapp}</Link>
              <Link href="/split" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.split}</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-surface-300 mb-4">{s.legal}</h3>
            <nav className="space-y-3">
              <Link href="/privacy" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.privacy}</Link>
              <Link href="/terms" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.terms}</Link>
              <Link href="/refund" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.refund}</Link>
              <Link href="/cancellation" className="block text-sm text-surface-400 hover:text-white transition-colors">{s.cancellation}</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-500">© {new Date().getFullYear()} TripSathi. {s.copyright}</p>
            <div className="flex items-center gap-4 text-surface-500 text-xs">
              <span>🔒 {s.ssl}</span>
              <span>💳 {s.pci}</span>
              <span>🇮🇳 {s.indian}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
