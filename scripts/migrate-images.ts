/**
 * One-off: move every inline `data:` image already in the database up to
 * ImageKit and replace it with the delivery URL. Safe to re-run — anything
 * that isn't a data URL (Unsplash ids, existing http URLs) is left alone.
 *
 *   npm run migrate:images            # do it
 *   npm run migrate:images -- --dry   # just report what would change
 */
import mongoose from "mongoose";
import { dbConnect } from "../lib/mongodb";
import { imageUploadsReady, uploadImage } from "../lib/api/imagekit";
import { Program } from "../models/Program";
import { Project } from "../models/Project";
import { Event } from "../models/Event";
import { Article } from "../models/Article";
import { GalleryItem } from "../models/GalleryItem";
import { TeamMember } from "../models/TeamMember";
import { Testimonial } from "../models/Testimonial";
import { Partner } from "../models/Partner";
import { User } from "../models/User";

const DRY = process.argv.includes("--dry");

type Target = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: mongoose.Model<any>;
  field: string;
  kind: "avatar" | "content";
};

const TARGETS: Target[] = [
  { name: "Program", model: Program, field: "image", kind: "content" },
  { name: "Project", model: Project, field: "image", kind: "content" },
  { name: "Event", model: Event, field: "image", kind: "content" },
  { name: "Article", model: Article, field: "image", kind: "content" },
  { name: "GalleryItem", model: GalleryItem, field: "image", kind: "content" },
  { name: "TeamMember", model: TeamMember, field: "image", kind: "content" },
  { name: "Testimonial", model: Testimonial, field: "image", kind: "content" },
  { name: "Partner", model: Partner, field: "logo", kind: "content" },
  { name: "User", model: User, field: "avatar", kind: "avatar" },
];

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string } {
  const m = /^data:image\/([a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!m) throw new Error("not a base64 image data URL");
  const ext = m[1] === "jpeg" ? "jpg" : m[1];
  return { buffer: Buffer.from(m[2], "base64"), ext };
}

async function main() {
  if (!imageUploadsReady && !DRY) {
    console.error("ImageKit is not configured — set IMAGEKIT_* in .env.local first.");
    process.exit(1);
  }
  await dbConnect();

  let moved = 0;
  let skipped = 0;

  for (const t of TARGETS) {
    const docs = await t.model
      .find({ [t.field]: { $regex: "^data:image/" } })
      .select(`${t.field}`);
    if (docs.length === 0) continue;
    console.log(`\n${t.name}.${t.field}: ${docs.length} inline image(s)`);

    for (const doc of docs) {
      const current: string = doc.get(t.field);
      try {
        const { buffer, ext } = dataUrlToBuffer(current);
        const kb = Math.round(buffer.length / 1024);
        if (DRY) {
          console.log(`  [dry] ${doc.id} — ${kb} KB -> would upload`);
          moved++;
          continue;
        }
        const { url } = await uploadImage(buffer, `${t.name.toLowerCase()}-${doc.id}.${ext}`, t.kind);
        doc.set(t.field, url);
        await doc.save({ validateBeforeSave: false });
        console.log(`  ${doc.id} — ${kb} KB -> ${url}`);
        moved++;
      } catch (err) {
        console.warn(`  ${doc.id} — SKIPPED: ${err instanceof Error ? err.message : err}`);
        skipped++;
      }
    }
  }

  console.log(`\nDone. ${moved} image(s) ${DRY ? "to migrate" : "migrated"}, ${skipped} skipped.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
