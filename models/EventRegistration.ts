import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const GENDERS = ["Male", "Female"] as const;

/**
 * One public RSVP to one event — submitted directly through the event page,
 * no account required. A `{ event, email }` pair is unique so the same
 * person can't double-book a seat.
 */
const eventRegistrationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    whatsapp: { type: String, required: true, trim: true, maxlength: 40 },
    gender: { type: String, enum: GENDERS, required: true },
    educationLevel: { type: String, required: true, trim: true, maxlength: 60 },
    organization: { type: String, required: true, trim: true, maxlength: 160 },
    position: { type: String, required: true, trim: true, maxlength: 120 },
    district: { type: String, required: true, trim: true, maxlength: 60 },
    /** Confirmed they can attend at the scheduled date/time. */
    confirmAvailability: { type: Boolean, required: true },
    /** Opted in to hear about future YEEP Somalia events. */
    wantsUpdates: { type: Boolean, default: false },
    /** Set once a "your event is soon" reminder has been emailed. */
    reminderSentAt: { type: Date },
  },
  { timestamps: true },
);

eventRegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

export type EventRegistrationAttrs = InferSchemaType<typeof eventRegistrationSchema>;
export const EventRegistration =
  (models.EventRegistration as Model<EventRegistrationAttrs>) ||
  model<EventRegistrationAttrs>("EventRegistration", eventRegistrationSchema);
