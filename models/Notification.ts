import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const NOTIFICATION_KINDS = [
  "signup",
  "hours",
  "event_rsvp",
  "volunteer_application",
  "contact_message",
] as const;

/**
 * A staff-facing activity item. One row per event of interest; "read" state
 * is tracked per admin via `User.notificationsSeenAt`, so no per-row flags.
 */
const notificationSchema = new Schema(
  {
    kind: { type: String, enum: NOTIFICATION_KINDS, required: true },
    /** Human sentence shown in the feed. */
    message: { type: String, required: true, trim: true, maxlength: 300 },
    /** Admin-console tab id this points at (e.g. "hours", "volunteers"). */
    link: { type: String, trim: true },
    /** Name of the person who triggered it, if any. */
    actorName: { type: String, trim: true },
  },
  { timestamps: true },
);

notificationSchema.index({ createdAt: -1 });

export type NotificationAttrs = InferSchemaType<typeof notificationSchema>;
export const Notification =
  (models.Notification as Model<NotificationAttrs>) ||
  model<NotificationAttrs>("Notification", notificationSchema);
