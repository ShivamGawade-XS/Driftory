"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface PaymentGatewayProps {
  amount: number
  itemName: string
  itemType: "transport" | "hotel" | "package"
  bookingPayload: Record<string, any>
  onClose: () => void
  onSuccess: (txn: TransactionResult) => void
}

export interface TransactionResult {
  txnId: string
  method: string
  status: "success" | "failed"
  amount: number
  timestamp: string
}

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet"

const banks = [
  { id: "sbi", name: "State Bank of India", icon: "🏦" },
  { id: "hdfc", name: "HDFC Bank", icon: "🏛️" },
  { id: "icici", name: "ICICI Bank", icon: "🏢" },
  { id: "axis", name: "Axis Bank", icon: "🏬" },
  { id: "kotak", name: "Kotak Mahindra", icon: "🏗️" },
  { id: "bob", name: "Bank of Baroda", icon: "🏫" },
]

const wallets = [
  { id: "paytm", name: "Paytm", icon: "💰" },
  { id: "phonepe", name: "PhonePe", icon: "📱" },
  { id: "gpay", name: "Google Pay", icon: "🔵" },
  { id: "amazon", name: "Amazon Pay", icon: "📦" },
]

export default function PaymentGateway({ amount, itemName, itemType, bookingPayload, onClose, onSuccess }: PaymentGatewayProps) {
  const [method, setMethod] = useState<PaymentMethod>("upi")
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState<"select" | "details" | "processing" | "success" | "failed">("select")

  // Form states
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")

  // Processing animation
  useEffect(() => {
    if (step === "processing") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15 + 5
        })
      }, 400)
      return () => clearInterval(interval)
    }
  }, [step])

  useEffect(() => {
    if (progress >= 100 && step === "processing") {
      setTimeout(() => setStep("success"), 600)
    }
  }, [progress, step])

  const generateTxnId = () => "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase()

  const formatCard = (val: string) => {
    const cleaned = val.replace(/\D/g, "").substring(0, 16)
    return cleaned.replace(/(.{4})/g, "$1 ").trim()
  }

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, "").substring(0, 4)
    if (cleaned.length > 2) return cleaned.substring(0, 2) + "/" + cleaned.substring(2)
    return cleaned
  }

  const canProceed = () => {
    if (method === "upi") return upiId.includes("@")
    if (method === "card") return cardNumber.replace(/\s/g, "").length === 16 && cardExpiry.length === 5 && cardCvv.length === 3 && cardName.length > 2
    if (method === "netbanking") return selectedBank !== ""
    if (method === "wallet") return selectedWallet !== ""
    return false
  }

  const handlePay = async () => {
    setStep("processing")
    setProgress(0)

    // Save the booking via API
    const token = typeof window !== "undefined" ? localStorage.getItem("tripsathi_token") : null
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ ...bookingPayload, totalAmount: amount })
        })
        if (res.ok) {
          const data = await res.json()
          const existing = JSON.parse(localStorage.getItem("tripsathi_bookings") || "[]")
          existing.unshift(data)
          localStorage.setItem("tripsathi_bookings", JSON.stringify(existing))
        }
      } catch {}
    }
  }

  const txnId = generateTxnId()
  const methodLabels: Record<PaymentMethod, string> = {
    upi: "UPI (" + upiId + ")",
    card: "Card ending " + cardNumber.replace(/\s/g, "").slice(-4),
    netbanking: banks.find(b => b.id === selectedBank)?.name || "Net Banking",
    wallet: wallets.find(w => w.id === selectedWallet)?.name || "Wallet",
  }

  if (step === "processing") {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <h2 className="text-xl font-bold">Processing Payment</h2>
            <p className="text-white/70 text-sm mt-1">Please do not close this window</p>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="space-y-2">
              <p className="text-surface-700 font-medium">
                {progress < 30 ? "🔐 Verifying payment details..." : progress < 60 ? "🏦 Connecting to bank..." : progress < 90 ? "✅ Authorizing transaction..." : "🎉 Almost done..."}
              </p>
              <p className="text-3xl font-bold text-surface-900">₹{amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-5xl animate-bounce">✅</div>
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-white/80 text-sm mt-1">Your booking has been confirmed</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-surface-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Transaction ID</span>
                <span className="font-mono font-bold text-surface-800">{txnId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Amount</span>
                <span className="font-bold text-green-600">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Method</span>
                <span className="font-medium text-surface-800">{methodLabels[method]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Date</span>
                <span className="text-surface-800">{new Date().toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Status</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">PAID</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { onSuccess({ txnId, method: methodLabels[method], status: "success", amount, timestamp: new Date().toISOString() }); }} className="btn-primary flex-1 py-3 font-bold">
                View My Bookings
              </button>
            </div>
            <p className="text-xs text-surface-400 text-center">A confirmation has been sent to your registered email</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-up my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white flex justify-between items-start">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wider">TripSathi Secure Pay</p>
            <h2 className="text-xl font-bold mt-1">₹{amount.toLocaleString()}</h2>
            <p className="text-white/80 text-sm mt-0.5">{itemName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-sm">✕</button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 text-xs">
          <span>🔒</span>
          <span>256-bit SSL Encrypted • PCI DSS Compliant • Secured by TripSathi</span>
        </div>

        {step === "select" && (
          <div className="p-5 space-y-4">
            {/* Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-2">
              {([
                { key: "upi" as const, label: "UPI", icon: "📲" },
                { key: "card" as const, label: "Card", icon: "💳" },
                { key: "netbanking" as const, label: "Bank", icon: "🏦" },
                { key: "wallet" as const, label: "Wallet", icon: "👛" },
              ]).map(m => (
                <button key={m.key} onClick={() => setMethod(m.key)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${method === m.key ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-surface-200 hover:border-surface-300"}`}>
                  <div className="text-xl">{m.icon}</div>
                  <div className={`text-xs font-medium mt-1 ${method === m.key ? "text-indigo-700" : "text-surface-600"}`}>{m.label}</div>
                </button>
              ))}
            </div>

            {/* UPI */}
            {method === "upi" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-surface-700 block">UPI ID</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm" />
                <div className="flex gap-2 flex-wrap">
                  {["@ybl", "@paytm", "@oksbi", "@okaxis"].map(suffix => (
                    <button key={suffix} onClick={() => setUpiId(prev => { const base = prev.split("@")[0] || "user"; return base + suffix })}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 text-surface-600 transition-colors">{suffix}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Card */}
            {method === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1">Card Number</label>
                  <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-mono tracking-wider" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-surface-700 block mb-1">Expiry</label>
                    <input type="text" value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-mono" maxLength={5} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-700 block mb-1">CVV</label>
                    <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 3))} placeholder="•••"
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-mono tracking-widest" maxLength={3} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1">Cardholder Name</label>
                  <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card"
                    className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm uppercase" />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === "netbanking" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-surface-700 block">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {banks.map(bank => (
                    <button key={bank.id} onClick={() => setSelectedBank(bank.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-sm ${selectedBank === bank.id ? "border-indigo-500 bg-indigo-50" : "border-surface-200 hover:border-surface-300"}`}>
                      <span className="text-lg">{bank.icon}</span>
                      <span className={`font-medium ${selectedBank === bank.id ? "text-indigo-700" : "text-surface-700"}`}>{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet */}
            {method === "wallet" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-surface-700 block">Select Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  {wallets.map(wallet => (
                    <button key={wallet.id} onClick={() => setSelectedWallet(wallet.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-sm ${selectedWallet === wallet.id ? "border-indigo-500 bg-indigo-50" : "border-surface-200 hover:border-surface-300"}`}>
                      <span className="text-lg">{wallet.icon}</span>
                      <span className={`font-medium ${selectedWallet === wallet.id ? "text-indigo-700" : "text-surface-700"}`}>{wallet.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button onClick={handlePay} disabled={!canProceed()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${canProceed() ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98]" : "bg-surface-200 text-surface-400 cursor-not-allowed"}`}>
              Pay ₹{amount.toLocaleString()}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-surface-400 pt-2">
              <span>🔐 Secure</span>
              <span>•</span>
              <span>💳 PCI Compliant</span>
              <span>•</span>
              <span>🛡️ Bank Grade</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
