import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { done } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { tokenSchema } from "@/lib/validators";
import { hashOneTimeToken } from "@/lib/api/one-time-token";
import { User } from "@/models/User";

const INVALID = "This confirmation link is invalid or has expired. Request a new one from your dashboard.";

/** POST /api/auth/verify-email — confirm an email address from the link token. */
export const POST = route(async (req: NextRequest) => {
  const { token } = await parseBody(req, tokenSchema);
  const tokenHash = hashOneTimeToken(token);

  const user = await User.findOne({ verifyTokenHash: tokenHash }).select(
    "+verifyTokenHash +verifyTokenExpires",
  );

  const valid =
    !!user &&
    user.verifyTokenHash === tokenHash &&
    !!user.verifyTokenExpires &&
    user.verifyTokenExpires.getTime() > Date.now();

  if (!user || !valid) {
    // Re-confirming an already-verified account should feel like success.
    if (user?.emailVerified) return done("Your email is already confirmed.");
    throw ApiError.badRequest(INVALID);
  }

  user.emailVerified = true;
  user.verifyTokenHash = undefined;
  user.verifyTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return done("Thanks — your email address is confirmed.");
});
