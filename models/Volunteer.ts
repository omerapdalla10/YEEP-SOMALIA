import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const VOLUNTEER_STATUSES = ["Pending", "Under Review", "Approved", "Rejected"] as const;

const volunteerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    phone: { type: String, trim: true },
    role: { type: String, required: true, trim: true },
    availability: { type: String, trim: true },
    motivation: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: VOLUNTEER_STATUSES, default: "Pending" },
    reviewNote: { type: String, trim: true },
  },
  { timestamps: true },
);

export type VolunteerAttrs = InferSchemaType<typeof volunteerSchema>;
export const Volunteer =
  (models.Volunteer as Model<VolunteerAttrs>) ||
  model<VolunteerAttrs>("Volunteer", volunteerSchema);
