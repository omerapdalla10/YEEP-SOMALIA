import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { slugify } from "@/lib/slug";

export const PROJECT_STATUSES = ["Ongoing", "Completed", "Planned"] as const;

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true },
    status: { type: String, enum: PROJECT_STATUSES, default: "Planned" },
    category: { type: String, trim: true },
    location: { type: String, trim: true },
    region: { type: String, trim: true },
    district: { type: String, trim: true },
    /** Unsplash photo id or full image URL. */
    image: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number, min: 0, default: 0 },
    raised: { type: Number, min: 0, default: 0 },
    beneficiaries: { type: Number, min: 0, default: 0 },
    /** Completion percentage 0-100. */
    progress: { type: Number, min: 0, max: 100, default: 0 },
    fundedBy: { type: String, trim: true },
    partners: { type: String, trim: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) this.slug = slugify(this.title);
  next();
});

export type ProjectAttrs = InferSchemaType<typeof projectSchema>;
export const Project =
  (models.Project as Model<ProjectAttrs>) || model<ProjectAttrs>("Project", projectSchema);
