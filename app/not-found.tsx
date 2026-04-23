import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🗺️</div>
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-900 mb-3">Page not found</h2>
        <p className="text-surface-500 mb-8 max-w-md mx-auto">
          Looks like this route doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/search" className="btn-secondary">Search Trips</Link>
        </div>
      </div>
    </div>
  )
}
