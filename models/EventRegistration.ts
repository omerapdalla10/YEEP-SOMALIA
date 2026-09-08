import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const REGISTRATION_STATUSES = ["Registered", "Cancelled"] as const;

/**
 * One member's RSVP to one event. A `{ event, user }` pair is unique — a
 * cancelled row is reused (status flipped back to "Registered") if the member
 * signs up again, so the live attendee count is `countDocuments({ event,
 * status: "Registered" })` and mirrors `Event.registered`.
 */
const eventRegistrationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: REGISTRATION_STATUSES, default: "Registered" },
    /** Set once a "your event is soon" reminder has been emailed. */
    reminderSentAt: { type: Date },
  },
  { timestamps: true },
);

eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export type EventRegistrationAttrs = InferSchemaType<typeof eventRegistrationSchema>;
export const EventRegistration =
  (models.EventRegistration as Model<EventRegistrationAttrs>) ||
  model<EventRegistrationAttrs>("EventRegistration", eventRegistrationSchema);
