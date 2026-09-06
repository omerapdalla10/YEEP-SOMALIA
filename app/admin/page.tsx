import type { Metadata } from "next";
import ProtectedRoute from "@/components/protected-route";
import AdminDashboard from "@/components/pages/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Console",
  robots: { index: false },
};

export default function Page() {
  return (
    <ProtectedRoute role="staff">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
