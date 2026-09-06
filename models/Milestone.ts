import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const milestoneSchema = new Schema(
  {
    year: { type: String, required: true, trim: true, maxlength: 12 },
    event: { type: String, required: true, trim: true, maxlength: 400 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type MilestoneAttrs = InferSchemaType<typeof milestoneSchema>;
export const Milestone =
  (models.Milestone as Model<MilestoneAttrs>) ||
  model<MilestoneAttrs>("Milestone", milestoneSchema);
