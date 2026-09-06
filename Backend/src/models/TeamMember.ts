import { Schema, model, type InferSchemaType } from 'mongoose'

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    /** Unsplash photo id or full image URL. */
    image: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 600 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type TeamMemberAttrs = InferSchemaType<typeof teamMemberSchema>
export const TeamMember = model('TeamMember', teamMemberSchema)
