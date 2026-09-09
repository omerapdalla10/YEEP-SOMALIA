import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A single document holding editable images that used to be hardcoded in the
 * page components. Always addressed by the fixed key "site".
 */
export const SITE_CONTENT_KEY = "site";

const siteContentSchema = new Schema(
  {
    key: { type: String, default: SITE_CONTENT_KEY, unique: true },
    /** Home page hero background. */
    heroImage: { type: String, trim: true },
    /** "Our Impact" photo on the home page. */
    homeImpactImage: { type: String, trim: true },
    /** "Who We Are" photo on the About page. */
    aboutImage: { type: String, trim: true },
  },
  { timestamps: true },
);

export type SiteContentAttrs = InferSchemaType<typeof siteContentSchema>;
export const SiteContent =
  (models.SiteContent as Model<SiteContentAttrs>) ||
  model<SiteContentAttrs>("SiteContent", siteContentSchema);
