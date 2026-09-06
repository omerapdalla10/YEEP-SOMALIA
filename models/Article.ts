import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { slugify } from "@/lib/slug";

export const ARTICLE_CATEGORIES = [
  "Education",
  "Impact",
  "Events",
  "Partnerships",
  "Stories",
  "Funding",
  "Programs",
  "News",
] as const;

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 220 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 400 },
    content: { type: String, trim: true },
    category: { type: String, default: "Stories" },
    /** Unsplash photo id or full image URL. */
    image: { type: String, trim: true },
    author: { type: String, trim: true, default: "YEEP Somalia" },
    /** Human display string, e.g. "5 min". */
    readTime: { type: String, trim: true, default: "4 min" },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: () => new Date() },
    views: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

articleSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) this.slug = slugify(this.title);
  next();
});

export type ArticleAttrs = InferSchemaType<typeof articleSchema>;
export const Article =
  (models.Article as Model<ArticleAttrs>) || model<ArticleAttrs>("Article", articleSchema);
