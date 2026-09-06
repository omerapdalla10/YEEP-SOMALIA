import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { done } from "@/lib/api/response";
import { fieldError } from "@/lib/api/errors";
import { requireUser } from "@/lib/api/auth";
import { changePasswordSchema } from "@/lib/validators";
import { User } from "@/models/User";

/** POST /api/auth/change-password — verifies the current password, then rotates it. */
export const POST = route(async (req: NextRequest) => {
  const current = await requireUser(req);
  const { currentPassword, newPassword } = await parseBody(req, changePasswordSchema);

  const user = await User.findById(current.id).select("+password");
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw fieldError(400, "Your current password is incorrect.", {
      currentPassword: "Your current password is incorrect.",
    });
  }
  if (await user.comparePassword(newPassword)) {
    throw fieldError(400, "Your new password must be different from your current one.", {
      newPassword: "Choose a password different from your current one.",
    });
  }

  user.password = newPassword;
  await user.save();
  return done("Your password has been changed.");
});
