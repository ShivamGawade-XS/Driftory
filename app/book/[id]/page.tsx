"use client"
import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import PaymentGateway, { TransactionResult } from "@/components/payment/PaymentGateway"

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [bookingRef, setBookingRef] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const router = useRouter()
  const [form, setForm] = useState({
    passengers: [{ name: "", age: "", gender: "male" }],
    contactEmail: "", contactPhone: "", specialRequests: "",
    seatPreference: "window", class: "3AC",
  })

  const travelers = parseInt(searchParams.get("travelers") || "2")
  const date = searchParams.get("date") || ""

  useState(() => {
    const pax = Array.from({ length: travelers }, () => ({ name: "", age: "", gender: "male" }))
    setForm(prev => ({ ...prev, passengers: pax }))
  })

  const updatePassenger = (idx: number, field: string, value: string) => {
    const updated = [...form.passengers]
    updated[idx] = { ...updated[idx], [field]: value }
    setForm(prev => ({ ...prev, passengers: updated }))
  }

  const packageName = String(params.id).replace(/-/g, " ")
  const estimatedPrice = 15999 * travelers

  const buildPayload = () => ({
    type: "package",
    packageId: String(params.id),
    travelDate: date || new Date().toISOString(),
    totalAmount: estimatedPrice,
    passengers: form.passengers,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    specialRequests: form.specialRequests,
    transport: { type: "package", name: packageName, provider: "TripSathi Packages", class: form.class },
    to: packageName,
  })

  const handleSubmit = () => {
    const token = localStorage.getItem("tripsathi_token")
    if (!token) { router.push("/login"); return }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (txn: TransactionResult) => {
    setBookingRef(txn.txnId)
    setShowPayment(false)
    setStep(4)
  }

  return (
    <>
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href={`/packages/${params.id}`} className="text-primary-600 hover:underline text-sm mb-6 inline-block">← Back to Package</Link>
        <div className="flex items-center gap-4 mb-8">
          {[1,2,3,4].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? "bg-primary-600 text-white" : "bg-surface-200 text-surface-500"}`}>{s}</div>
              <span className={`text-sm hidden sm:block ${step >= s ? "text-primary-600 font-medium" : "text-surface-400"}`}>{["Travelers","Contact","Review","Confirmed"][s-1]}</span>
              {s < 4 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary-500" : "bg-surface-200"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold">Traveler Details</h2>
            <p className="text-surface-500">Date: <strong>{date || "Not selected"}</strong> • {travelers} traveler(s)</p>
            <div className="space-y-4">
              <label className="text-sm font-medium text-surface-700 block">Seat / Class Preference</label>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.class} onChange={e => setForm({...form, class: e.target.value})} className="px-4 py-3 rounded-xl border border-surface-200 text-sm">
                  <option value="SL">Sleeper (SL)</option><option value="3AC">AC 3 Tier</option><option value="2AC">AC 2 Tier</option><option value="CC">Chair Car</option>
                </select>
                <select value={form.seatPreference} onChange={e => setForm({...form, seatPreference: e.target.value})} className="px-4 py-3 rounded-xl border border-surface-200 text-sm">
                  <option value="window">Window</option><option value="aisle">Aisle</option><option value="any">No Preference</option>
                </select>
              </div>
            </div>
            {form.passengers.map((pax, i) => (
              <div key={i} className="p-4 bg-surface-50 rounded-xl space-y-3">
                <h3 className="font-medium text-surface-700">Traveler {i + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input placeholder="Full Name" value={pax.name} onChange={e => updatePassenger(i, "name", e.target.value)} className="px-4 py-3 rounded-xl border border-surface-200 text-sm" />
                  <input type="number" placeholder="Age" value={pax.age} onChange={e => updatePassenger(i, "age", e.target.value)} className="px-4 py-3 rounded-xl border border-surface-200 text-sm" />
                  <select value={pax.gender} onChange={e => updatePassenger(i, "gender", e.target.value)} className="px-4 py-3 rounded-xl border border-surface-200 text-sm">
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
            ))}
            <button onClick={() => setStep(2)} className="btn-primary w-full py-4 text-lg font-bold">Continue to Contact</button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold">Contact Information</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-surface-700 block mb-1">Email</label><input type="email" placeholder="you@email.com" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm" /></div>
              <div><label className="text-sm font-medium text-surface-700 block mb-1">Phone</label><input type="tel" placeholder="+91 98765 43210" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm" /></div>
              <div><label className="text-sm font-medium text-surface-700 block mb-1">Special Requests</label><textarea placeholder="Any dietary restrictions, accessibility needs, etc." value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm h-24 resize-none" /></div>
            </div>
            <div className="flex gap-3"><button onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">Back</button><button onClick={() => setStep(3)} className="btn-primary flex-1 py-4 font-bold">Review Booking</button></div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold">Review & Confirm</h2>
            <div className="bg-surface-50 rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-surface-800">Package: {String(params.id).replace(/-/g, " ")}</h3>
              <p className="text-sm text-surface-500">📅 {date || "TBD"} • 👥 {travelers} travelers • 🎫 {form.class} ({form.seatPreference})</p>
              {form.passengers.map((p, i) => <p key={i} className="text-sm text-surface-600">Traveler {i+1}: {p.name || "—"}, Age {p.age || "—"}, {p.gender}</p>)}
              <p className="text-sm text-surface-600">📧 {form.contactEmail || "—"} • 📱 {form.contactPhone || "—"}</p>
              {form.specialRequests && <p className="text-sm text-surface-600">💬 {form.specialRequests}</p>}
            </div>
            <div className="flex gap-3"><button onClick={() => setStep(2)} className="btn-secondary flex-1 py-4">Back</button><button onClick={handleSubmit} className="btn-primary flex-1 py-4 font-bold text-lg">💳 Proceed to Pay</button></div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center text-4xl">✅</div>
            <h2 className="font-display text-3xl font-bold text-green-700">Booking Confirmed!</h2>
            <p className="text-surface-600">Your booking reference is</p>
            <p className="text-2xl font-mono font-bold text-primary-600 bg-primary-50 inline-block px-6 py-3 rounded-xl">{bookingRef}</p>
            <p className="text-sm text-surface-400">A confirmation email has been sent. You can track your booking in your dashboard.</p>
            <div className="flex gap-3 justify-center"><Link href="/dashboard" className="btn-primary px-8 py-3">My Bookings</Link><Link href="/packages" className="btn-secondary px-8 py-3">Browse More</Link></div>
          </div>
        )}
      </div>
    </div>

    {showPayment && (
      <PaymentGateway
        amount={estimatedPrice}
        itemName={packageName}
        itemType="package"
        bookingPayload={buildPayload()}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    )}
    </>
  )
}
