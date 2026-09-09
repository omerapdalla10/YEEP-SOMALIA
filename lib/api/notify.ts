import { Notification, type NotificationAttrs } from "@/models/Notification";

type Kind = NotificationAttrs["kind"];

/**
 * Record a staff-facing activity notification. Fire-and-forget — a failure
 * here must never break the action that triggered it.
 */
export function notify(
  kind: Kind,
  message: string,
  opts: { link?: string; actorName?: string } = {},
): void {
  void Notification.create({ kind, message, link: opts.link, actorName: opts.actorName }).catch(
    (err) => console.error("[notify] could not record notification:", err),
  );
}
