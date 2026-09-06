import { Schema, model, type InferSchemaType } from 'mongoose'

/** Where the testimonial is shown: home = success stories, volunteer = volunteer voices. */
export const TESTIMONIAL_PLACEMENTS = ['home', 'volunteer'] as const

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, trim: true, maxlength: 160 },
    text: { type: String, required: true, trim: true, maxlength: 800 },
    /** Unsplash photo id or full image URL. */
    image: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    placement: { type: String, enum: TESTIMONIAL_PLACEMENTS, default: 'home' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export type TestimonialAttrs = InferSchemaType<typeof testimonialSchema>
export const Testimonial = model('Testimonial', testimonialSchema)
