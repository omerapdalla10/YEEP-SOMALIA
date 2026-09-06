import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    source: { type: String, trim: true, default: "website" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type SubscriberAttrs = InferSchemaType<typeof subscriberSchema>;
export const Subscriber =
  (models.Subscriber as Model<SubscriberAttrs>) ||
  model<SubscriberAttrs>("Subscriber", subscriberSchema);
