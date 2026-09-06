import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import GoogleButton from './GoogleButton'

const DISMISS_KEY = 'yeep_google_prompt_dismissed'
/** Routes where the prompt would be redundant or in the way. */
const HIDDEN_ON = ['/login', '/register', '/admin', '/dashboard', '/auth']
/** Delay before the prompt appears, so it doesn't fight the first paint. */
const SHOW_AFTER_MS = 1500

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function rememberDismissed() {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1')
  } catch {
    /* storage unavailable — prompt may reappear on next navigation */
  }
}

/**
 * Auto-appearing modal that nudges signed-out visitors to sign in with Google.
 * Mounted once at the router level; it decides for itself when to show.
 */
export default function GoogleSignInPrompt() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const hiddenHere = HIDDEN_ON.some((p) => location.pathname.startsWith(p))
  const eligible = !loading && !user && !hiddenHere && !wasDismissed()

  useEffect(() => {
    if (!eligible) {
      setOpen(false)
      return
    }
    const t = setTimeout(() => setOpen(true), SHOW_AFTER_MS)
    return () => clearTimeout(t)
  }, [eligible])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  function dismiss() {
    rememberDismissed()
    setOpen(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-prompt-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#0f766e] flex items-center justify-center">
          <span className="text-white font-black text-xl">Y</span>
        </div>

        <h2 id="google-prompt-title" className="text-lg font-bold text-gray-900 mb-1.5">
          Sign in with your Google account
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Sign in to apply for programs, track your volunteer activities, and stay updated.
        </p>

        <GoogleButton from={location.pathname} onClick={rememberDismissed} />

        <button
          onClick={dismiss}
          className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
