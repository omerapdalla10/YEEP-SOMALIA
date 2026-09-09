import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A single document holding editable content that used to be hardcoded in the
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
    /** Volunteer page hero background. */
    volunteerImage: { type: String, trim: true },

    /* --- Contact details --- */
    contactEmail: { type: String, trim: true, maxlength: 160 },
    contactPhone: { type: String, trim: true, maxlength: 40 },
    /** Digits only, no "+" — used to build a wa.me link. */
    contactWhatsapp: { type: String, trim: true, maxlength: 20 },
    officeAddress: { type: String, trim: true, maxlength: 200 },
    officeHours: { type: String, trim: true, maxlength: 200 },
    /** src for an embedded map iframe (OpenStreetMap / Google Maps). */
    mapEmbedSrc: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

export type SiteContentAttrs = InferSchemaType<typeof siteContentSchema>;
export const SiteContent =
  (models.SiteContent as Model<SiteContentAttrs>) ||
  model<SiteContentAttrs>("SiteContent", siteContentSchema);
