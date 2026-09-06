import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { listQuery } from "@/lib/api/list-query";
import { ok, created } from "@/lib/api/response";
import { fieldError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { adminCreateUserSchema } from "@/lib/validators";
import { User } from "@/models/User";

/** GET /api/users — admin list with search + role/active filters. */
export const GET = route(async (req: NextRequest) => {
  await requireRole(req, "admin");
  const { data, pagination } = await listQuery(User, req.nextUrl.searchParams, {
    filterable: ["role", "isActive"],
    searchable: ["name", "email"],
  });
  return ok(data, { pagination });
});

/** POST /api/users — admin creates a user account. */
export const POST = route(async (req: NextRequest) => {
  await requireRole(req, "admin");
  const body = await parseBody(req, adminCreateUserSchema);

  const existing = await User.findOne({ email: body.email });
  if (existing) {
    throw fieldError(409, "An account with that email address already exists.", {
      email: "This email address is already registered.",
    });
  }

  const user = await User.create(body);
  return created(user);
});
