import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { done } from "@/lib/api/response";
import { forgotPasswordSchema } from "@/lib/validators";
import { createResetToken } from "@/lib/api/reset-token";
import { sendMail } from "@/lib/api/mailer";
import { passwordResetEmail } from "@/lib/api/emails/password-reset";
import { appUrl } from "@/lib/env";
import { User } from "@/models/User";

const GENERIC =
  "If an account exists for that email address, we've sent a link to reset the password.";

/** POST /api/auth/forgot-password — start the reset flow. */
export const POST = route(async (req: NextRequest) => {
  const { email } = await parseBody(req, forgotPasswordSchema);

  const user = await User.findOne({ email }).select("+password name email authProvider");

  // Only local accounts with a password can reset. Never reveal which case we
  // hit — the response is identical whether or not the account exists.
  if (user && user.authProvider !== "google" && user.password) {
    const { token, hash, expires } = createResetToken();
    user.resetTokenHash = hash;
    user.resetTokenExpires = expires;
    await user.save({ validateBeforeSave: false });

    const url = `${appUrl}/reset-password?token=${token}`;
    void sendMail({ to: user.email, ...passwordResetEmail(user.name, url) });
  }

  return done(GENERIC);
});
