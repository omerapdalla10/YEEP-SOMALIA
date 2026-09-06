import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const GALLERY_CATEGORIES = ["Programs", "Events", "Community", "Volunteers"] as const;

const galleryItemSchema = new Schema(
  {
    type: { type: String, enum: ["image", "video"], default: "image" },
    image: { type: String, required: true, trim: true },
    videoUrl: { type: String, trim: true },
    category: { type: String, enum: GALLERY_CATEGORIES, required: true },
    caption: { type: String, trim: true, maxlength: 240 },
    span: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type GalleryItemAttrs = InferSchemaType<typeof galleryItemSchema>;
export const GalleryItem =
  (models.GalleryItem as Model<GalleryItemAttrs>) ||
  model<GalleryItemAttrs>("GalleryItem", galleryItemSchema);
