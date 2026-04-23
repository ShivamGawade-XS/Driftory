"use client"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">📡</div>
        <h1 className="font-display text-3xl font-bold text-surface-800 mb-3">You&apos;re Offline</h1>
        <p className="text-surface-500 mb-6 leading-relaxed">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry — your saved trip details are still available below.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 text-left">
          <h2 className="font-bold text-surface-800 mb-3">📋 Saved Trip Details</h2>
          <p className="text-surface-500 text-sm mb-4">Your recently viewed trips are cached and accessible offline:</p>
          <div className="space-y-2">
            <div className="bg-surface-50 rounded-lg p-3">
              <p className="font-medium text-surface-700">🚆 Last searched route</p>
              <p className="text-surface-400 text-sm">Cached from your last session</p>
            </div>
            <div className="bg-surface-50 rounded-lg p-3">
              <p className="font-medium text-surface-700">🏨 Viewed hotel details</p>
              <p className="text-surface-400 text-sm">Available for quick reference</p>
            </div>
            <div className="bg-surface-50 rounded-lg p-3">
              <p className="font-medium text-surface-700">🎫 Booking confirmations</p>
              <p className="text-surface-400 text-sm">Your booking references are saved locally</p>
            </div>
          </div>
        </div>

        <button onClick={() => window.location.reload()} className="btn-primary py-3 px-8 mb-3 w-full">
          🔄 Try Again
        </button>
        <p className="text-surface-400 text-xs">TripSathi works offline so you never lose your trip info in no-signal zones.</p>
      </div>
    </div>
  )
}
