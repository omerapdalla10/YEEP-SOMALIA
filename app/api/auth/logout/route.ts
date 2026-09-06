import { done } from "@/lib/api/response";
import { clearAuthCookie } from "@/lib/api/auth";

/** POST /api/auth/logout — clears the session cookie. No DB needed. */
export async function POST() {
  const res = done("You have been signed out.");
  clearAuthCookie(res);
  return res;
}
