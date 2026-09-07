import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { done } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { resetPasswordSchema } from "@/lib/validators";
import { hashResetToken } from "@/lib/api/reset-token";
import { User } from "@/models/User";

const INVALID = "This reset link is invalid or has expired. Please request a new one.";

/** POST /api/auth/reset-password — finish the reset flow. */
export const POST = route(async (req: NextRequest) => {
  const { token, password } = await parseBody(req, resetPasswordSchema);
  const tokenHash = hashResetToken(token);

  const user = await User.findOne({ resetTokenHash: tokenHash }).select(
    "+password +resetTokenHash +resetTokenExpires",
  );

  // Re-check in code, not just via the query: a token must match exactly and
  // still be within its window.
  const valid =
    !!user &&
    user.resetTokenHash === tokenHash &&
    !!user.resetTokenExpires &&
    user.resetTokenExpires.getTime() > Date.now();

  if (!user || !valid) throw ApiError.badRequest(INVALID);

  user.password = password; // hashed by the pre-save hook
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return done("Your password has been reset. You can now sign in with the new password.");
});
