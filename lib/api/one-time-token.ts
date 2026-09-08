import { randomBytes, createHash } from "node:crypto";

/**
 * Mint a single-use token. The raw token goes in the email link; only its
 * SHA-256 hash is stored, so a database leak can't be replayed.
 */
export function createOneTimeToken(ttlMs: number): {
  token: string;
  hash: string;
  expires: Date;
} {
  const token = randomBytes(32).toString("hex");
  return { token, hash: hashOneTimeToken(token), expires: new Date(Date.now() + ttlMs) };
}

export function hashOneTimeToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
