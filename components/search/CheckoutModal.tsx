"use client"
import { useState, useEffect } from "react"
import { TransportResult, HotelResult } from "@/lib/api"
import { useRouter } from "next/navigation"
import PaymentGateway, { TransactionResult } from "@/components/payment/PaymentGateway"

interface CheckoutModalProps {
  item: TransportResult | HotelResult | null
  type: "transport" | "hotel" | null
  onClose: () => void
}

export default function CheckoutModal({ item, type, onClose }: CheckoutModalProps) {
  const router = useRouter()
  const [passengerName, setPassengerName] = useState("")
  const [passengerAge, setPassengerAge] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (item && type === "hotel") {
      const today = new Date()
      setCheckIn(today.toISOString().split("T")[0])
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setCheckOut(tomorrow.toISOString().split("T")[0])
    }
  }, [item, type])

  if (!item || !type) return null

  const isTransport = type === "transport"
  const payloadItem = item as any
  const amount = isTransport ? payloadItem.price : payloadItem.pricePerNight

  const buildPayload = () => {
    const payload: any = {
      type: type,
      travelDate: isTransport ? new Date().toISOString() : checkIn,
      totalAmount: amount,
    }
    if (isTransport) {
      payload.transport = { type: payloadItem.type, name: payloadItem.name, provider: payloadItem.provider, class: payloadItem.class }
      payload.from = payloadItem.from
      payload.to = payloadItem.to
      payload.passengers = [{ name: passengerName, age: Number(passengerAge), gender: "male" }]
    } else {
      payload.hotel = { name: payloadItem.name, checkIn: new Date(checkIn), checkOut: new Date(checkOut), rooms: 1 }
      payload.to = payloadItem.city
    }
    return payload
  }

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("tripsathi_token")
    if (!token) { router.push("/login"); return }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (txn: TransactionResult) => {
    router.push("/dashboard")
  }

  if (showPayment) {
    return (
      <PaymentGateway
        amount={amount}
        itemName={payloadItem.name}
        itemType={type}
        bookingPayload={buildPayload()}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
        <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Checkout {isTransport ? "Ticket" : "Stay"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleProceed} className="p-6">
          <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 mb-6">
            <h3 className="font-bold text-surface-900 mb-1">{payloadItem.name}</h3>
            <p className="text-sm text-surface-500">{payloadItem.provider || payloadItem.city}</p>
            <div className="mt-3 flex justify-between items-center pt-3 border-t border-surface-200">
              <span className="text-surface-600 font-medium">Total Price</span>
              <span className="text-xl font-bold text-primary-600">₹{amount}</span>
            </div>
          </div>

          {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

          {isTransport ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Passenger Name</label>
                <input required type="text" value={passengerName} onChange={e=>setPassengerName(e.target.value)} className="w-full border border-surface-300 rounded-lg p-2.5 outline-none focus:border-primary-500" placeholder="Full name as on ID proof" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Age</label>
                <input required type="number" min="1" max="120" value={passengerAge} onChange={e=>setPassengerAge(e.target.value)} className="w-full border border-surface-300 rounded-lg p-2.5 outline-none focus:border-primary-500" placeholder="Years" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Check In</label>
                <input required type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} className="w-full border border-surface-300 rounded-lg p-2 outline-none focus:border-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Check Out</label>
                <input required type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} className="w-full border border-surface-300 rounded-lg p-2 outline-none focus:border-primary-500 text-sm" />
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-surface-300 font-bold text-surface-700 hover:bg-surface-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 btn-primary py-3">
              Proceed to Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
