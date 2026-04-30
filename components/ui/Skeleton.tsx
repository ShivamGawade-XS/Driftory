interface SkeletonProps {
  className?: string
  variant?: "text" | "card" | "avatar"
}

export default function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full",
    card: "h-48 w-full rounded-2xl",
    avatar: "h-10 w-10 rounded-full",
  }

  return (
    <div className={`animate-pulse bg-surface-200 rounded-lg ${variantClasses[variant]} ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card space-y-4">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-16" />
      </div>
    </div>
  )
}
