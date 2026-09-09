import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { Notification } from "@/models/Notification";

/** GET /api/notifications — staff activity feed + unread count. */
export const GET = route(async (req: NextRequest) => {
  const user = await requireRole(req, "staff");
  const seenAt = user.notificationsSeenAt;

  const [items, unread] = await Promise.all([
    Notification.find().sort("-createdAt").limit(30).lean(),
    Notification.countDocuments(seenAt ? { createdAt: { $gt: seenAt } } : {}),
  ]);

  return ok({ items, unread });
});

/** PATCH /api/notifications — mark the whole feed as seen. */
export const PATCH = route(async (req: NextRequest) => {
  const user = await requireRole(req, "staff");
  user.notificationsSeenAt = new Date();
  await user.save({ validateBeforeSave: false });
  return ok({ unread: 0 });
});
