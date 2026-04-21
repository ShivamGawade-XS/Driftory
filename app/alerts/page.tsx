"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

interface Alert {
  id: string; route: string; from: string; to: string; mode: string
  quota: string; threshold: number; currentPrice: number; status: string; createdAt: string
}

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/alerts`

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ from: "", to: "", mode: "Train", quota: "Regular", threshold: "" })

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setAlerts(data.alerts || [])
    } catch { setAlerts([]) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAlerts() }, [fetchAlerts])

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, threshold: Number(form.threshold) }),
      })
      if (res.ok) {
        await fetchAlerts()
        setShowForm(false)
        setForm({ from: "", to: "", mode: "Train", quota: "Regular", threshold: "" })
      }
    } catch {}
    setSubmitting(false)
  }

  const deleteAlert = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" })
      setAlerts(alerts.filter(a => a.id !== id))
    } catch {}
  }

  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-800">🔔 Price Alerts</h1>
            <p className="text-surface-500 mt-1">Get notified when fares drop below your target price. Prices refresh every 30s.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-5">
            {showForm ? "Cancel" : "+ New Alert"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-md p-6 mb-8 animate-slide-down">
            <h2 className="font-bold text-lg text-surface-800 mb-4">Create Price Alert</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-600 mb-1">From City</label>
                <input required value={form.from} onChange={e => setForm({...form, from: e.target.value})} placeholder="e.g. Delhi" className="w-full px-4 py-2.5 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-600 mb-1">To City</label>
                <input required value={form.to} onChange={e => setForm({...form, to: e.target.value})} placeholder="e.g. Mumbai" className="w-full px-4 py-2.5 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-600 mb-1">Transport Mode</label>
                <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option>Train</option><option>Bus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-600 mb-1">Quota</label>
                <select value={form.quota} onChange={e => setForm({...form, quota: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option>Regular</option><option>Tatkal</option><option>Ladies</option><option>Premium Tatkal</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-600 mb-1">Alert me when price drops below (₹)</label>
                <input required type="number" min="100" value={form.threshold} onChange={e => setForm({...form, threshold: e.target.value})} placeholder="e.g. 1500" className="w-full px-4 py-2.5 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full py-3 disabled:opacity-50">
              {submitting ? "Creating..." : "🔔 Set Price Alert"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20"><span className="text-4xl animate-pulse">⏳</span><p className="text-surface-500 mt-4">Loading alerts...</p></div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 ${alert.status === "triggered" ? "border-green-500" : "border-amber-400"} hover:shadow-md transition-shadow`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-surface-800">{alert.route}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${alert.status === "triggered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {alert.status === "triggered" ? "🎉 Price Dropped!" : "👁️ Watching"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-surface-500">
                      <span className="bg-surface-100 px-2 py-0.5 rounded">{alert.mode}</span>
                      <span className="bg-surface-100 px-2 py-0.5 rounded">{alert.quota} Quota</span>
                      <span>Target: <strong className="text-primary-600">₹{alert.threshold}</strong></span>
                      <span>Current: <strong className={alert.currentPrice <= alert.threshold ? "text-green-600" : "text-surface-800"}>₹{alert.currentPrice}</strong></span>
                      <span className="text-surface-400">Set on {alert.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === "triggered" && (
                      <Link href={`/search?from=${alert.from}&to=${alert.to}`} className="btn-primary py-2 px-4 text-sm">Book Now</Link>
                    )}
                    <button onClick={() => deleteAlert(alert.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" title="Delete alert">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && alerts.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔕</span>
            <h3 className="text-xl font-bold text-surface-700">No alerts yet</h3>
            <p className="text-surface-500 mt-2">Create your first price alert to never miss a fare drop!</p>
          </div>
        )}
      </div>
    </div>
  )
}
