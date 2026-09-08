import { appUrl } from "@/lib/env";
import { createOneTimeToken } from "@/lib/api/one-time-token";
import { sendMail } from "@/lib/api/mailer";
import { verifyEmailEmail } from "@/lib/api/emails/verify-email";
import type { UserDocument } from "@/models/User";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Issue a fresh email-verification token for `user`, persist its hash, and
 * send the confirmation email (fire-and-forget). No-op for already-verified
 * accounts.
 */
export async function sendVerificationEmail(user: UserDocument): Promise<void> {
  if (user.emailVerified) return;

  const { token, hash, expires } = createOneTimeToken(VERIFY_TTL_MS);
  user.verifyTokenHash = hash;
  user.verifyTokenExpires = expires;
  await user.save({ validateBeforeSave: false });

  const url = `${appUrl}/verify-email?token=${token}`;
  void sendMail({ to: user.email, ...verifyEmailEmail(user.name, url) });
}
