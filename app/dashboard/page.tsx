import type { Metadata } from "next";
import ProtectedRoute from "@/components/protected-route";
import UserDashboard from "@/components/pages/user-dashboard";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default function Page() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
}
