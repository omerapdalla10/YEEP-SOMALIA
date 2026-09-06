import { route, type IdContext } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { adminUpdateUserSchema } from "@/lib/validators";
import { User } from "@/models/User";

const NOT_FOUND = "That user account could not be found.";

export const GET = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "admin");
  const { id } = await ctx.params;
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound(NOT_FOUND);
  return ok(user);
});

export const PATCH = route<IdContext>(async (req, ctx) => {
  const admin = await requireRole(req, "admin");
  const { id } = await ctx.params;
  const body = await parseBody(req, adminUpdateUserSchema);

  const isSelf = id === admin.id;
  if (isSelf && body.role && body.role !== "admin") {
    throw ApiError.badRequest(
      "You can't change your own role. Ask another administrator to do it.",
    );
  }
  if (isSelf && body.isActive === false) {
    throw ApiError.badRequest("You can't deactivate your own account.");
  }

  const user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw ApiError.notFound(NOT_FOUND);
  return ok(user);
});

export const DELETE = route<IdContext>(async (req, ctx) => {
  const admin = await requireRole(req, "admin");
  const { id } = await ctx.params;
  if (id === admin.id) {
    throw ApiError.badRequest("You can't delete your own account.");
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) throw ApiError.notFound(NOT_FOUND);
  return ok({ id });
});
