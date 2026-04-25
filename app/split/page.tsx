"use client"
import { useState, useEffect, useCallback } from "react"

interface Traveler { id: string; name: string }
interface Expense { id: string; desc: string; amount: number; paidBy: string }
interface SplitGroup {
  code: string; name: string; travelers: Traveler[]; expenses: Expense[]
  total: number; perPerson: number
  settlements: { from: string; to: string; amount: number }[]
}

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/split`

export default function GroupSplitPage() {
  const [group, setGroup] = useState<SplitGroup | null>(null)
  const [groupName, setGroupName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [newName, setNewName] = useState("")
  const [expForm, setExpForm] = useState({ desc: "", amount: "", paidBy: "" })
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Check URL for existing code
  useEffect(() => {
    const saved = localStorage.getItem("tripsathi-split-code")
    if (saved) fetchGroup(saved)
  }, [])

  const fetchGroup = useCallback(async (code: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/${code}`)
      if (res.ok) {
        const data = await res.json()
        setGroup(data)
        localStorage.setItem("tripsathi-split-code", code)
      }
    } catch {}
    setLoading(false)
  }, [])

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return
    setLoading(true)
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName, travelers: [{ id: "T1", name: "You" }] }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem("tripsathi-split-code", data.code)
        await fetchGroup(data.code)
      }
    } catch {}
    setLoading(false)
  }

  const joinGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) return
    await fetchGroup(joinCode.trim().toUpperCase())
  }

  const addTraveler = async () => {
    if (!newName.trim() || !group) return
    try {
      const res = await fetch(`${API}/${group.code}/traveler`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      })
      if (res.ok) { await fetchGroup(group.code); setNewName("") }
    } catch {}
  }

  const removeTraveler = async (id: string) => {
    if (!group || id === "T1") return
    try {
      await fetch(`${API}/${group.code}/traveler/${id}`, { method: "DELETE" })
      await fetchGroup(group.code)
    } catch {}
  }

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!group) return
    try {
      const res = await fetch(`${API}/${group.code}/expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desc: expForm.desc, amount: Number(expForm.amount), paidBy: expForm.paidBy || group.travelers[0]?.id }),
      })
      if (res.ok) { await fetchGroup(group.code); setExpForm({ desc: "", amount: "", paidBy: "" }) }
    } catch {}
  }

  const removeExpense = async (expId: string) => {
    if (!group) return
    try {
      await fetch(`${API}/${group.code}/expense/${expId}`, { method: "DELETE" })
      await fetchGroup(group.code)
    } catch {}
  }

  const copyShareLink = () => {
    if (!group) return
    navigator.clipboard.writeText(`${window.location.origin}/split?code=${group.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const leaveGroup = () => {
    localStorage.removeItem("tripsathi-split-code")
    setGroup(null)
  }

  // Landing: create or join
  if (!group) {
    return (
      <div className="min-h-screen bg-surface-50 py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-surface-800">💰 Group Travel Split</h1>
            <p className="text-surface-500 mt-2">Split costs across co-travelers. No awkward math.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="font-bold text-lg text-surface-800 mb-4">Create New Group</h2>
            <form onSubmit={createGroup} className="flex gap-3">
              <input required value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. Goa Trip 2026" className="flex-1 px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none" />
              <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6">{loading ? "..." : "Create"}</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-lg text-surface-800 mb-4">Join Existing Group</h2>
            <form onSubmit={joinGroup} className="flex gap-3">
              <input required value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="Enter 6-digit code" maxLength={6} className="flex-1 px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none font-mono text-center tracking-widest" />
              <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6">{loading ? "..." : "Join"}</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Active group view
  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-surface-800">💰 {group.name}</h1>
            <p className="text-surface-500 mt-1">Code: <code className="bg-surface-100 px-2 py-0.5 rounded font-mono font-bold text-primary-600">{group.code}</code></p>
          </div>
          <div className="flex gap-2">
            <button onClick={copyShareLink} className="btn-secondary py-2 px-4 text-sm">
              {copied ? "✅ Copied!" : "🔗 Share"}
            </button>
            <button onClick={leaveGroup} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Leave</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Travelers */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-lg text-surface-800 mb-4">👥 Travelers ({group.travelers.length})</h2>
            <div className="space-y-2 mb-4">
              {group.travelers.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-surface-50 rounded-lg px-3 py-2">
                  <span className="font-medium text-surface-700">{t.name}</span>
                  {t.id !== "T1" && (
                    <button onClick={() => removeTraveler(t.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addTraveler()} placeholder="Add traveler name" className="flex-1 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              <button onClick={addTraveler} className="btn-primary py-2 px-3 text-sm">Add</button>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
            <h2 className="font-bold text-lg text-surface-800 mb-4">🧾 Expenses</h2>
            <form onSubmit={addExpense} className="flex flex-wrap gap-3 mb-4 pb-4 border-b">
              <input required value={expForm.desc} onChange={e => setExpForm({...expForm, desc: e.target.value})} placeholder="What for? e.g. Hotel" className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              <input required type="number" min="1" value={expForm.amount} onChange={e => setExpForm({...expForm, amount: e.target.value})} placeholder="₹ Amount" className="w-28 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              <select value={expForm.paidBy || group.travelers[0]?.id} onChange={e => setExpForm({...expForm, paidBy: e.target.value})} className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                {group.travelers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button type="submit" className="btn-primary py-2 px-4 text-sm">+ Add</button>
            </form>

            {group.expenses.length === 0 ? (
              <p className="text-surface-400 text-center py-8">No expenses added yet. Start adding above!</p>
            ) : (
              <div className="space-y-2">
                {group.expenses.map(exp => (
                  <div key={exp.id} className="flex items-center justify-between bg-surface-50 rounded-lg px-4 py-3">
                    <div>
                      <span className="font-medium text-surface-700">{exp.desc}</span>
                      <span className="text-surface-400 text-sm ml-2">paid by {group.travelers.find(t => t.id === exp.paidBy)?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-surface-800">₹{exp.amount.toLocaleString()}</span>
                      <button onClick={() => removeExpense(exp.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {group.expenses.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">📊 Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-white/80">Total Expenses</span><span className="font-bold text-xl">₹{group.total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/80">Per Person</span><span className="font-bold text-xl">₹{group.perPerson.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/80">Travelers</span><span className="font-bold">{group.travelers.length}</span></div>
              </div>
              <button onClick={copyShareLink} className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors font-medium">
                {copied ? "✅ Link Copied!" : "🔗 Share Split Link"}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-lg text-surface-800 mb-4">🔄 Settlements</h3>
              {group.settlements.length === 0 ? (
                <p className="text-green-600 font-medium text-center py-4">✅ All settled! No payments needed.</p>
              ) : (
                <div className="space-y-3">
                  {group.settlements.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-surface-800">{s.from}</span>
                        <span className="text-surface-400">→</span>
                        <span className="font-medium text-surface-800">{s.to}</span>
                      </div>
                      <span className="font-bold text-amber-700">₹{s.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
