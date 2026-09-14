import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";
import { ROLES, type Role } from "@/lib/roles";

export type UserRole = Role;

/**
 * Staff/admin accounts only — created by an admin from the console (see
 * `POST /api/users`). There is no public sign-up.
 */
export interface UserAttrs {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  /** SHA-256 of the active password-reset token; cleared once used. */
  resetTokenHash?: string;
  resetTokenExpires?: Date;
  /** Last time they cleared the admin console notifications feed. */
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
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, required: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
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
    delete r.resetTokenHash;
    delete r.resetTokenExpires;
    return ret;
  },
});

export const User =
  (models.User as UserModel) || model<UserAttrs, UserModel>("User", userSchema);
