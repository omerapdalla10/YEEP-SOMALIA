/**
 * Resolve an image reference to a URL. Values may be a full URL or a bare
 * Unsplash photo id (e.g. "photo-1509062522246-3755977927d7"), which is how
 * the API stores image references.
 */
export function img(
  ref: string | undefined | null,
  params = 'w=600&h=400&fit=crop&auto=format',
): string {
  if (!ref) return ''
  if (ref.startsWith('data:') || ref.startsWith('http://') || ref.startsWith('https://')) return ref
  return `https://images.unsplash.com/${ref}?${params}`
}
