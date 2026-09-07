import { randomBytes, createHash } from "node:crypto";

/** How long a password-reset link stays valid. */
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Mint a reset token. The raw token goes in the email link; only its SHA-256
 * hash is stored, so a database leak can't be used to reset anyone's password.
 */
export function createResetToken(): { token: string; hash: string; expires: Date } {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    hash: hashResetToken(token),
    expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  };
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
