import { Schema, model, type InferSchemaType } from 'mongoose'

const partnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    logo: { type: String, trim: true },
    website: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export type PartnerAttrs = InferSchemaType<typeof partnerSchema>
export const Partner = model('Partner', partnerSchema)
