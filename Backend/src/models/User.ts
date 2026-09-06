import { Schema, model, type HydratedDocument, type Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES, DEFAULT_ROLE, type Role } from '../config/roles'

export type UserRole = Role

export type AuthProvider = 'local' | 'google'

export interface UserAttrs {
  name: string
  email: string
  /** Optional: Google-only accounts have no password. */
  password?: string
  phone?: string
  role: UserRole
  avatar?: string
  isActive: boolean
  authProvider: AuthProvider
  /** Google's stable account id (`sub` claim), when linked. */
  googleId?: string
}

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>
}

export type UserDocument = HydratedDocument<UserAttrs, UserMethods>
type UserModel = Model<UserAttrs, {}, UserMethods>

const userSchema = new Schema<UserAttrs, UserModel, UserMethods>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      // Required for local sign-ups; Google accounts authenticate via OAuth.
      required: [
        function (this: UserAttrs) {
          return this.authProvider !== 'google'
        },
        'Password is required',
      ],
    },
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, default: DEFAULT_ROLE },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate: string) {
  if (!this.password) return Promise.resolve(false)
  return bcrypt.compare(candidate, this.password)
}

// `password` uses `select: false` so queries never return it, but a freshly
// created document still holds it in memory — strip it from any serialisation.
userSchema.set('toJSON', {
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>
    delete r.password
    delete r.googleId
    return ret
  },
})

export const User = model<UserAttrs, UserModel>('User', userSchema)
