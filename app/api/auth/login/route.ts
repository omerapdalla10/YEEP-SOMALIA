import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { signToken } from "@/lib/api/token";
import { setAuthCookie } from "@/lib/api/auth";
import { loginSchema } from "@/lib/validators";
import { User } from "@/models/User";

/** POST /api/auth/login — email + password sign-in. */
export const POST = route(async (req: NextRequest) => {
  const { email, password } = await parseBody(req, loginSchema);

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("The email or password you entered is incorrect.");
  }
  if (!user.isActive) {
    throw ApiError.forbidden("Your account has been disabled. Please contact an administrator.");
  }

  const token = signToken({ sub: user.id, role: user.role });
  user.password = undefined;

  const res = ok({ user, token });
  setAuthCookie(res, token);
  return res;
});
