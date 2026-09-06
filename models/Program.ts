import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { slugify } from "@/lib/slug";

export const PROGRAM_CATEGORIES = [
  "Education",
  "Skills",
  "Leadership",
  "Health",
  "Arts",
  "Vocational",
  "Digital Literacy",
  "Entrepreneurship",
] as const;
export const PROGRAM_STATUSES = ["Active", "Enrolling", "Completed", "Paused"] as const;

const programSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, index: true },
    summary: { type: String, trim: true, maxlength: 300 },
    description: { type: String, trim: true },
    category: { type: String, required: true },
    status: { type: String, enum: PROGRAM_STATUSES, default: "Active" },
    /** Unsplash photo id or full image URL. */
    image: { type: String, trim: true },
    beneficiaries: { type: Number, min: 0, default: 0 },
    /** Completion percentage 0-100. */
    progress: { type: Number, min: 0, max: 100, default: 0 },
    duration: { type: String, trim: true },
    region: { type: String, trim: true },
    district: { type: String, trim: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

programSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) this.slug = slugify(this.title);
  next();
});

export type ProgramAttrs = InferSchemaType<typeof programSchema>;
export const Program =
  (models.Program as Model<ProgramAttrs>) || model<ProgramAttrs>("Program", programSchema);
