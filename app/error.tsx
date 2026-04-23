"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-3xl font-bold text-surface-900 mb-3">Something went wrong</h1>
        <p className="text-surface-500 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  )
}
