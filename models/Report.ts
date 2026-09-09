import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** Downloadable publications shown on the About page (annual reports, etc.). */
export const REPORT_KINDS = [
  "Annual Report",
  "Financial Statement",
  "Strategy",
  "Policy",
  "Research",
  "Other",
] as const;

const reportSchema = new Schema(
  {
    kind: { type: String, enum: REPORT_KINDS, default: "Annual Report" },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    /** Reporting period label, e.g. "2025" or "2024–2025". */
    year: { type: String, trim: true, maxlength: 12 },
    /** Public link to the PDF (ImageKit, Drive, Dropbox, …). */
    fileUrl: { type: String, required: true, trim: true, maxlength: 1000 },
    summary: { type: String, trim: true, maxlength: 400 },
    /** Human-readable size shown next to the download, e.g. "2.4 MB". */
    fileSize: { type: String, trim: true, maxlength: 20 },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

reportSchema.index({ order: 1, createdAt: -1 });

export type ReportAttrs = InferSchemaType<typeof reportSchema>;
export const Report =
  (models.Report as Model<ReportAttrs>) || model<ReportAttrs>("Report", reportSchema);
