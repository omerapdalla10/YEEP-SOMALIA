/** "July 1, 2026" */
export function formatDate(value: string | undefined | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/** 12400 → "12,400+" */
export function formatCountPlus(n: number | undefined | null): string {
  return `${(n ?? 0).toLocaleString()}+`
}

/** 2400000 → "$2.4M", 500000 → "$500K", 800 → "$800" */
export function formatMoneyCompact(n: number | undefined | null): string {
  const v = n ?? 0
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`
  return `$${v}`
}

/** "Jul 1, 2026" */
export function formatDateShort(value: string | undefined | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
