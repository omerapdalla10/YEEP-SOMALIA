import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { created } from "@/lib/api/response";
import { optionalUser } from "@/lib/api/auth";
import { volunteerApplicationSchema } from "@/lib/validators";
import { Volunteer } from "@/models/Volunteer";

/** POST /api/volunteers/apply — public (or signed-in) application submission. */
export const POST = route(async (req: NextRequest) => {
  const user = await optionalUser(req);
  const body = await parseBody(req, volunteerApplicationSchema);
  const application = await Volunteer.create({ ...body, user: user?.id });
  return created(application);
});
