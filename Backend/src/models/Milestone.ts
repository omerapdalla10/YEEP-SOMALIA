import { Schema, model, type InferSchemaType } from 'mongoose'

const milestoneSchema = new Schema(
  {
    year: { type: String, required: true, trim: true, maxlength: 12 },
    event: { type: String, required: true, trim: true, maxlength: 400 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export type MilestoneAttrs = InferSchemaType<typeof milestoneSchema>
export const Milestone = model('Milestone', milestoneSchema)
