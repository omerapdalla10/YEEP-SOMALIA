import { Schema, model, type InferSchemaType } from 'mongoose'
import { slugify } from '../utils/slug'

export const EVENT_TYPES = [
  'Conference',
  'Community',
  'Fundraiser',
  'Workshop',
  'Forum',
  'Networking',
] as const

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    /** Human display string, e.g. "August 15–17, 2026". */
    dateLabel: { type: String, trim: true },
    /** Human display string, e.g. "9:00 AM – 5:00 PM". */
    timeLabel: { type: String, trim: true },
    /** Grouping label, e.g. "August 2026". */
    month: { type: String, trim: true },
    location: { type: String, trim: true },
    region: { type: String, trim: true },
    type: { type: String, enum: EVENT_TYPES, default: 'Community' },
    /** Unsplash photo id or full image URL. */
    image: { type: String, trim: true },
    capacity: { type: Number, min: 0, default: 0 },
    registered: { type: Number, min: 0, default: 0 },
    registrationDeadline: { type: Date },
    registrationUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
)

eventSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) this.slug = slugify(this.title)
  next()
})

export type EventAttrs = InferSchemaType<typeof eventSchema>
export const Event = model('Event', eventSchema)
