import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** An open volunteer position shown on the Volunteer page. */
const volunteerRoleSchema = new Schema(
  {
    role: { type: String, required: true, trim: true, maxlength: 120 },
    commitment: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 600 },
    open: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type VolunteerRoleAttrs = InferSchemaType<typeof volunteerRoleSchema>;
export const VolunteerRole =
  (models.VolunteerRole as Model<VolunteerRoleAttrs>) ||
  model<VolunteerRoleAttrs>("VolunteerRole", volunteerRoleSchema);
