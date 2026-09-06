import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, getToken, setToken } from '../lib/api'
import type { Role } from '../lib/roles'

export interface AuthUser {
  _id: string
  name: string
  email: string
  phone?: string
  role: Role
  avatar?: string
  isActive: boolean
  createdAt: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  loginWithToken: (token: string) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  logout: () => void
  refresh: () => Promise<void>
  updateUser: (patch: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    api
      .get<AuthUser>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    async function handleAuth(res: { data: { user: AuthUser; token: string } }) {
      setToken(res.data.token)
      setUser(res.data.user)
      return res.data.user
    }
    return {
      user,
      loading,
      async login(email, password) {
        const res = await api.post<{ user: AuthUser; token: string }>('/auth/login', {
          email,
          password,
        })
        return handleAuth(res)
      },
      async loginWithToken(token) {
        setToken(token)
        try {
          const res = await api.get<AuthUser>('/auth/me')
          setUser(res.data)
          return res.data
        } catch (err) {
          setToken(null)
          setUser(null)
          throw err
        }
      },
      async register(payload) {
        const res = await api.post<{ user: AuthUser; token: string }>('/auth/register', payload)
        return handleAuth(res)
      },
      logout() {
        setToken(null)
        setUser(null)
      },
      async refresh() {
        const res = await api.get<AuthUser>('/auth/me')
        setUser(res.data)
      },
      updateUser(patch) {
        setUser((u) => (u ? { ...u, ...patch } : u))
      },
    }
  }, [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
