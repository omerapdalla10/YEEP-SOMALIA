import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { created } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { signToken } from "@/lib/api/token";
import { setAuthCookie } from "@/lib/api/auth";
import { registerSchema } from "@/lib/validators";
import { User } from "@/models/User";

/** POST /api/auth/register — public sign-up. */
export const POST = route(async (req: NextRequest) => {
  const { name, email, password, phone } = await parseBody(req, registerSchema);

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict(
      "An account with that email address already exists. Try signing in instead.",
    );
  }

  const user = await User.create({ name, email, password, phone });
  const token = signToken({ sub: user.id, role: user.role });

  const res = created({ user, token });
  setAuthCookie(res, token);
  return res;
});
