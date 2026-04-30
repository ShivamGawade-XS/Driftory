interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
}

export default function EmptyState({ title, description, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      {description && (
        <p className="text-surface-500 max-w-sm mx-auto">{description}</p>
      )}
    </div>
  )
}
