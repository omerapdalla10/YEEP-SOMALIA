import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { roleAtLeast, type Role } from '../lib/roles'

/**
 * Guards a route. Redirects to /login when signed out, and to /dashboard when a
 * minimum role is required and the current user does not meet it. Roles are
 * ranked: volunteer < staff < admin.
 */
export default function ProtectedRoute({
  role,
  children,
}: {
  role?: Role
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 size={28} className="animate-spin text-[#0f766e]" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && !roleAtLeast(user.role, role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
