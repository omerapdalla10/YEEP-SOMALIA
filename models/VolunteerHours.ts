import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const HOURS_STATUSES = ["Pending", "Approved", "Rejected"] as const;

/** One entry in a member's volunteer time log, reviewed by staff. */
const volunteerHoursSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Optional — hours tied to a specific event. */
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    activity: { type: String, required: true, trim: true, maxlength: 300 },
    hours: { type: Number, required: true, min: 0.5, max: 24 },
    /** The day the work was done. */
    date: { type: Date, required: true },
    status: { type: String, enum: HOURS_STATUSES, default: "Pending", index: true },
    reviewNote: { type: String, trim: true, maxlength: 500 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

export type VolunteerHoursAttrs = InferSchemaType<typeof volunteerHoursSchema>;
export const VolunteerHours =
  (models.VolunteerHours as Model<VolunteerHoursAttrs>) ||
  model<VolunteerHoursAttrs>("VolunteerHours", volunteerHoursSchema);
