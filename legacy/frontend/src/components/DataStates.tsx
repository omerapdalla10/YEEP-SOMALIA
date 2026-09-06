import { AlertCircle, CheckCircle2, Inbox, Loader2 } from 'lucide-react'

/** Inline spinner for sections that are loading API data. */
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <Loader2 size={26} className="animate-spin text-[#0f766e]" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

/** Inline error panel with an optional retry action. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <p className="text-sm text-gray-500 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 px-4 py-2 text-sm font-semibold text-[#0f766e] border border-[#0f766e] rounded-xl hover:bg-teal-50 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

/** Inline empty-state message when a collection has no items. */
export function EmptyState({ label = 'Nothing here yet.' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <Inbox size={26} />
      <span className="text-sm">{label}</span>
    </div>
  )
}

/**
 * Compact inline alert for form submit results. `tone` picks the colour;
 * pass `error` (a caught value → message) or `success` text.
 */
export function FormAlert({
  error,
  success,
}: {
  error?: string | null
  success?: string | null
}) {
  if (!error && !success) return null
  if (success) {
    return (
      <p className="flex items-center gap-2 text-sm text-[#16a34a] bg-green-50 rounded-lg px-3 py-2">
        <CheckCircle2 size={15} className="shrink-0" />
        <span>{success}</span>
      </p>
    )
  }
  return (
    <p className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
      <AlertCircle size={15} className="shrink-0 mt-0.5" />
      <span>{error}</span>
    </p>
  )
}

/** A single field-level validation message shown under an input. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-1">{message}</p>
}

/**
 * Renders one of loading / error / empty for a collection, or `children` when
 * there is data. Keeps page markup tidy.
 */
export function QueryBoundary({
  loading,
  error,
  empty,
  onRetry,
  emptyLabel,
  loadingLabel,
  children,
}: {
  loading: boolean
  error: string | null
  empty: boolean
  onRetry?: () => void
  emptyLabel?: string
  loadingLabel?: string
  children: React.ReactNode
}) {
  if (loading) return <LoadingState label={loadingLabel} />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (empty) return <EmptyState label={emptyLabel} />
  return <>{children}</>
}
