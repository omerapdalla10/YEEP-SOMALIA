import { Schema, model, type InferSchemaType } from 'mongoose'

export const CONTACT_STATUSES = ['New', 'Read', 'Replied', 'Archived'] as const

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: CONTACT_STATUSES, default: 'New' },
  },
  { timestamps: true },
)

export type ContactMessageAttrs = InferSchemaType<typeof contactMessageSchema>
export const ContactMessage = model('ContactMessage', contactMessageSchema)
