const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'
const TOKEN_KEY = 'yeep_token'

/** Absolute base URL of the API — needed for full-page redirects (OAuth). */
export const API_BASE_URL = BASE_URL

export class ApiError extends Error {
  status: number
  /** Per-field messages, e.g. { email: 'Enter a valid email address.' }. */
  fields?: Record<string, string>
  details?: unknown
  constructor(
    message: string,
    status: number,
    opts: { fields?: Record<string, string>; details?: unknown } = {},
  ) {
    super(message)
    this.status = status
    this.fields = opts.fields
    this.details = opts.details
  }
}

/** Human sentence for a failed request that returned no usable JSON body. */
function statusFallback(status: number): string {
  switch (status) {
    case 0:
      return 'Could not reach the server. Check your connection and try again.'
    case 400:
      return "That request wasn't quite right. Please check your input and try again."
    case 401:
      return 'Your session has expired. Please sign in again.'
    case 403:
      return "You don't have permission to do that."
    case 404:
      return "We couldn't find what you were looking for."
    case 409:
      return 'That conflicts with something that already exists.'
    case 413:
      return 'That upload is too large. Please use a smaller file.'
    case 429:
      return 'You are doing that too quickly. Please wait a moment and try again.'
    default:
      return status >= 500
        ? 'Something went wrong on our end. Please try again in a moment.'
        : 'Something went wrong. Please try again.'
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable — token stays in memory only for this session */
  }
}

export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
  pagination?: { page: number; limit: number; total: number; pages: number }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken()
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) }
  if (init.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(statusFallback(0), 0)
  }

  const body = await res.json().catch(() => null)

  if (!res.ok || !body?.success) {
    if (res.status === 401) setToken(null)
    throw new ApiError(body?.message || statusFallback(res.status), res.status, {
      fields: body?.fields,
      details: body?.details,
    })
  }

  return body as ApiResponse<T>
}

function toQuery(params?: Record<string, unknown>): string {
  if (!params) return ''
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(`${path}${toQuery(params)}`),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
