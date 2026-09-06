"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { roleAtLeast, type Role } from "@/lib/roles";

/**
 * Guards a client route. Redirects to /login when signed out, and to /dashboard
 * when a minimum role is required and the current user does not meet it. Roles
 * are ranked: volunteer < staff < admin. `proxy.ts` already blocks signed-out
 * visitors server-side; this adds the loading state and the role check.
 */
export default function ProtectedRoute({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const denied = !loading && (!user || (role && !roleAtLeast(user.role, role)));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    } else if (role && !roleAtLeast(user.role, role)) {
      router.replace("/dashboard");
    }
  }, [loading, user, role, router, pathname]);

  if (loading || denied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 size={28} className="animate-spin text-[#2D8FCE]" />
      </div>
    );
  }

  return <>{children}</>;
}
