"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setToken } from "@/lib/client/api";
import type { Role } from "@/lib/roles";

/** Staff/admin account — the only kind of account this site has. */
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The session cookie alone is enough to authenticate `/auth/me`; the bearer
    // token is a fallback. Try the request regardless of local token state.
    api
      .get<AuthUser>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const res = await api.post<{ user: AuthUser; token: string }>("/auth/login", {
          email,
          password,
        });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      logout() {
        void api.post("/auth/logout").catch(() => {});
        setToken(null);
        setUser(null);
      },
      async refresh() {
        const res = await api.get<AuthUser>("/auth/me");
        setUser(res.data);
      },
      updateUser(patch) {
        setUser((u) => (u ? { ...u, ...patch } : u));
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
