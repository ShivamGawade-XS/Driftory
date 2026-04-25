"use client"
import { useState, useRef, useEffect } from "react"

export default function WhatsAppBotPage() {
  const [phone, setPhone] = useState("")
  const [linked, setLinked] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm TripSathi Bot.\n\nI can help you search and book travel packages, check PNR status, or answer questions.\n\nTry saying: *'Delhi to Mumbai'* or *'Search packages'*" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 10) setLinked(true)
  }

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !linked) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { from: "user", text: userMsg }])
    setIsTyping(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/whatsapp/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, phoneId: phone })
      })
      const data = await res.json()
      
      // Artificial delay to simulate real typing speed
      setTimeout(() => {
        setMessages(prev => [...prev, { from: "bot", text: data.reply }])
        setIsTyping(false)
      }, 1000)
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { from: "bot", text: "⚠️ Server is unreachable. Please make sure the backend is running." }])
        setIsTyping(false)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-surface-800">💬 WhatsApp Bot</h1>
          <p className="text-surface-500 mt-3 text-lg max-w-2xl mx-auto">Search trains, buses & hotels directly from WhatsApp. Zero app downloads. Zero friction.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Phone interactive Simulator */}
          <div className="bg-surface-800 rounded-3xl p-3 shadow-2xl max-w-sm mx-auto lg:mx-0 relative">
            <div className="bg-[#075E54] rounded-t-2xl p-4 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">TS</div>
              <div>
                <p className="text-white font-bold text-sm">TripSathi Bot</p>
                <p className="text-green-300 text-xs">{isTyping ? "typing..." : "online"}</p>
              </div>
            </div>
            
            {!linked && (
              <div className="absolute inset-0 z-20 bg-black/60 rounded-3xl flex items-center justify-center p-6 text-center backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl w-full">
                  <h3 className="font-bold mb-2">Link Account to Chat</h3>
                  <p className="text-sm text-surface-500 mb-4">You must link a mobile number in the right panel to use the simulator.</p>
                </div>
              </div>
            )}

            <div 
              ref={scrollRef}
              className="bg-[#ECE5DD] p-4 space-y-3 h-[450px] overflow-y-auto"
            >
              <div className="text-center text-xs text-surface-400 bg-black/5 rounded-full mx-auto px-3 py-1 inline-block mb-4">
                Messages and calls are end-to-end encrypted.
              </div>
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-[#DCF8C6] text-surface-800 rounded-tr-none"
                        : "bg-white text-surface-700 rounded-tl-none shadow-sm"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(/\*(.*?)\*/g, "<strong>$1</strong>")
                    }}
                  />
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-surface-700 px-3 py-2 rounded-xl rounded-tl-none shadow-sm text-sm italic">
                    typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={sendMessage} className="bg-[#f0f0f0] p-3 rounded-b-2xl flex gap-2 items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none"
                disabled={!linked}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || !linked}
                className="w-10 h-10 bg-[#00A884] text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </form>
          </div>

          {/* Features + Link */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-surface-800 mb-4">How It Works</h2>
              <div className="space-y-4">
                {[
                  { step: "1", icon: "📱", title: "Save Our Number", desc: "Add +91-XXXXX-XXXXX to your contacts as 'TripSathi'" },
                  { step: "2", icon: "💬", title: "Send a Message", desc: "Type your search like 'Delhi to Goa bus tomorrow'" },
                  { step: "3", icon: "🎫", title: "Book Instantly", desc: "Select, confirm, and receive your e-ticket on WhatsApp" },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">{s.step}</div>
                    <div>
                      <h3 className="font-bold text-surface-800">{s.icon} {s.title}</h3>
                      <p className="text-surface-500 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-surface-800 mb-4">Supported Commands</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Delhi to Mumbai",
                  "Bangalore to Chennai",
                  "PNR status",
                  "Search packages",
                  "reset"
                ].map((cmd, i) => (
                  <code key={i} className="bg-surface-100 px-3 py-2 rounded-lg text-sm text-surface-700 font-mono">{cmd}</code>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-green-800 mb-3">🔗 Link Your Account</h2>
              {linked ? (
                <div className="text-center py-4">
                  <span className="text-4xl block mb-2">✅</span>
                  <p className="font-bold text-green-700">WhatsApp linked successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Check the simulator panel to start booking.</p>
                </div>
              ) : (
                <form onSubmit={handleLink} className="flex gap-3">
                  <input
                    type="tel"
                    required
                    minLength={10}
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
                    Link
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
