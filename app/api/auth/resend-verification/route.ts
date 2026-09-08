import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { done } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { sendVerificationEmail } from "@/lib/api/verification";

/** POST /api/auth/resend-verification — re-send the confirmation email. */
export const POST = route(async (req: NextRequest) => {
  const user = await requireUser(req);

  if (user.emailVerified) {
    return done("Your email is already confirmed.");
  }

  await sendVerificationEmail(user);
  return done("We've sent a fresh confirmation link to your email address.");
});
