import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";
import { ROLES, DEFAULT_ROLE, type Role } from "@/lib/roles";

export type UserRole = Role;
export type AuthProvider = "local" | "google";

export interface UserAttrs {
  name: string;
  email: string;
  /** Optional: Google-only accounts have no password. */
  password?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  authProvider: AuthProvider;
  /** Google's stable account id (`sub` claim), when linked. */
  googleId?: string;
  /** SHA-256 of the active password-reset token; cleared once used. */
  resetTokenHash?: string;
  resetTokenExpires?: Date;
  /** Email ownership confirmed (true for Google accounts). */
  emailVerified: boolean;
  verifyTokenHash?: string;
  verifyTokenExpires?: Date;
  /** Staff/admin: last time they cleared the notifications feed. */
  notificationsSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<UserAttrs, UserMethods>;
type UserModel = Model<UserAttrs, Record<string, never>, UserMethods>;

const userSchema = new Schema<UserAttrs, UserModel, UserMethods>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      // Required for local sign-ups; Google accounts authenticate via OAuth.
      required: [
        function (this: UserAttrs) {
          return this.authProvider !== "google";
        },
        "Password is required",
      ],
    },
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, default: DEFAULT_ROLE },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, unique: true, sparse: true },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
    emailVerified: { type: Boolean, default: false },
    verifyTokenHash: { type: String, select: false },
    verifyTokenExpires: { type: Date, select: false },
    notificationsSeenAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcryptHash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  if (!this.password) return Promise.resolve(false);
  return bcryptCompare(candidate, this.password);
};

// `password` uses `select: false` so queries never return it, but a freshly
// created document still holds it in memory — strip it from any serialisation.
userSchema.set("toJSON", {
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    delete r.password;
    delete r.googleId;
    delete r.resetTokenHash;
    delete r.resetTokenExpires;
    delete r.verifyTokenHash;
    delete r.verifyTokenExpires;
    return ret;
  },
});

export const User =
  (models.User as UserModel) || model<UserAttrs, UserModel>("User", userSchema);
