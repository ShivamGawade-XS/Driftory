interface ErrorCardProps {
  message: string
  onRetry?: () => void
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="card border-red-200 bg-red-50 text-center py-10">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
      <p className="text-red-600 text-sm mb-4 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary bg-red-600 hover:bg-red-700 shadow-red-600/25 hover:shadow-red-600/30 text-sm py-2 px-6">
          Try Again
        </button>
      )}
    </div>
  )
}
