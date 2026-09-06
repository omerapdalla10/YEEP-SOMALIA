import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { updateMeSchema } from "@/lib/validators";

/** GET /api/auth/me — the current signed-in user. */
export const GET = route(async (req: NextRequest) => {
  const user = await requireUser(req);
  return ok(user);
});

/** PATCH /api/auth/me — update the current user's own profile. */
export const PATCH = route(async (req: NextRequest) => {
  const user = await requireUser(req);
  const patch = await parseBody(req, updateMeSchema);
  Object.assign(user, patch);
  await user.save();
  return ok(user);
});
