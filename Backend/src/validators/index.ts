import { z } from 'zod'
import { ROLES } from '../config/roles'
import { PROGRAM_STATUSES } from '../models/Program'
import { PROJECT_STATUSES } from '../models/Project'
import { EVENT_TYPES } from '../models/Event'
import { GALLERY_CATEGORIES } from '../models/GalleryItem'
import { VOLUNTEER_STATUSES } from '../models/Volunteer'
import { CONTACT_STATUSES } from '../models/ContactMessage'
import { TESTIMONIAL_PLACEMENTS } from '../models/Testimonial'

const str = z.string().trim()
const optStr = str.max(2000).optional()

/**
 * An image reference: an http(s) URL, a bare Unsplash photo id (e.g.
 * "photo-1509062522246-3755977927d7"), or an inline `data:image/...` URL from a
 * client-side upload (downscaled, well under the 2 MB body limit).
 */
const isImageRef = (v: string) =>
  v === '' ||
  v.startsWith('data:image/') ||
  v.startsWith('http://') ||
  v.startsWith('https://') ||
  /^photo-[\w-]+$/.test(v)

const IMAGE_MSG = 'Image must be a URL, an Unsplash photo id, or an uploaded image'
const image = str.max(2_500_000).refine(isImageRef, IMAGE_MSG).optional()
/** Same, but non-empty (for records where the image is required, e.g. gallery). */
const requiredImage = str.min(1).max(2_500_000).refine(isImageRef, IMAGE_MSG)

/** Accepts an image URL or an inline data: URL (resized client-side, ~a few hundred KB). */
const avatarValue = z
  .string()
  .trim()
  .max(3_000_000)
  .refine(
    (v) => v.startsWith('data:image/') || v.startsWith('http://') || v.startsWith('https://'),
    'Avatar must be an image URL or data URL',
  )
  .optional()
const isoDate = z.union([z.string().datetime(), z.coerce.date()])
const num = z.coerce.number()

/* ------------------------------- Auth ------------------------------- */

export const registerSchema = z.object({
  name: str.min(2).max(120),
  email: str.email().toLowerCase(),
  password: z.string().min(8).max(128),
  phone: str.max(40).optional(),
})

export const loginSchema = z.object({
  email: str.email().toLowerCase(),
  password: z.string().min(1),
})

export const updateMeSchema = z.object({
  name: str.min(2).max(120).optional(),
  phone: str.max(40).optional(),
  avatar: avatarValue,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
})

/* ----------------------------- Resources ---------------------------- */

export const programSchema = z.object({
  title: str.min(2).max(160),
  summary: str.max(300).optional(),
  description: optStr,
  category: str.min(2).max(60),
  status: z.enum(PROGRAM_STATUSES).optional(),
  image: image,
  beneficiaries: num.min(0).optional(),
  progress: num.min(0).max(100).optional(),
  duration: str.max(60).optional(),
  region: str.max(80).optional(),
  district: str.max(80).optional(),
  featured: z.coerce.boolean().optional(),
})

export const projectSchema = z.object({
  title: str.min(2).max(160),
  description: optStr,
  status: z.enum(PROJECT_STATUSES).optional(),
  category: str.max(60).optional(),
  location: str.max(120).optional(),
  region: str.max(80).optional(),
  district: str.max(80).optional(),
  image: image,
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  budget: num.min(0).optional(),
  raised: num.min(0).optional(),
  beneficiaries: num.min(0).optional(),
  progress: num.min(0).max(100).optional(),
  fundedBy: str.max(160).optional(),
  partners: str.max(300).optional(),
  featured: z.coerce.boolean().optional(),
})

export const eventSchema = z.object({
  title: str.min(2).max(160),
  description: optStr,
  startDate: isoDate,
  endDate: isoDate.optional(),
  dateLabel: str.max(80).optional(),
  timeLabel: str.max(80).optional(),
  month: str.max(40).optional(),
  location: str.max(160).optional(),
  region: str.max(80).optional(),
  type: z.enum(EVENT_TYPES).optional(),
  image: image,
  capacity: num.min(0).optional(),
  registered: num.min(0).optional(),
  registrationDeadline: isoDate.optional(),
  registrationUrl: str.max(500).optional(),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
})

export const articleSchema = z.object({
  title: str.min(2).max(220),
  excerpt: str.max(400).optional(),
  content: optStr,
  category: str.max(60).optional(),
  image: image,
  author: str.max(120).optional(),
  readTime: str.max(20).optional(),
  tags: z.array(str).optional(),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
  publishedAt: isoDate.optional(),
  views: num.min(0).optional(),
})

export const gallerySchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  image: requiredImage,
  videoUrl: str.max(500).optional(),
  category: z.enum(GALLERY_CATEGORIES),
  caption: str.max(240).optional(),
  span: str.max(60).optional(),
  order: num.optional(),
})

export const teamMemberSchema = z.object({
  name: str.min(2).max(120),
  role: str.min(2).max(120),
  image: image,
  bio: str.max(600).optional(),
  order: num.optional(),
  active: z.coerce.boolean().optional(),
})

export const milestoneSchema = z.object({
  year: str.min(1).max(12),
  event: str.min(2).max(400),
  order: num.optional(),
})

export const testimonialSchema = z.object({
  name: str.min(2).max(120),
  role: str.max(160).optional(),
  text: str.min(5).max(800),
  image: image,
  rating: num.min(1).max(5).optional(),
  placement: z.enum(TESTIMONIAL_PLACEMENTS).optional(),
  order: num.optional(),
})

export const partnerSchema = z.object({
  name: str.min(1).max(120),
  logo: image,
  website: str.max(500).optional(),
  order: num.optional(),
})

export const volunteerRoleSchema = z.object({
  role: str.min(2).max(120),
  commitment: str.max(80).optional(),
  location: str.max(120).optional(),
  skills: str.max(200).optional(),
  description: str.max(600).optional(),
  open: z.coerce.boolean().optional(),
  order: num.optional(),
})

/* --------------------------- Interactions --------------------------- */

export const volunteerApplicationSchema = z.object({
  name: str.min(2).max(120),
  email: str.email().toLowerCase(),
  phone: str.max(40).optional(),
  role: str.min(2),
  availability: str.max(80).optional(),
  motivation: str.max(2000).optional(),
})

export const volunteerStatusSchema = z.object({
  status: z.enum(VOLUNTEER_STATUSES),
  reviewNote: str.max(1000).optional(),
})

export const contactMessageSchema = z.object({
  name: str.min(2).max(120),
  email: str.email().toLowerCase(),
  subject: str.min(2).max(200),
  message: str.min(5).max(5000),
})

export const contactStatusSchema = z.object({
  status: z.enum(CONTACT_STATUSES),
})

export const newsletterSchema = z.object({
  email: str.email().toLowerCase(),
  source: str.max(60).optional(),
})

export const adminCreateUserSchema = z.object({
  name: str.min(2).max(120),
  email: str.email().toLowerCase(),
  password: z.string().min(8).max(128),
  phone: str.max(40).optional(),
  role: z.enum(ROLES).default('volunteer'),
  isActive: z.coerce.boolean().default(true),
})

export const adminUpdateUserSchema = z.object({
  name: str.min(2).max(120).optional(),
  phone: str.max(40).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.coerce.boolean().optional(),
})
