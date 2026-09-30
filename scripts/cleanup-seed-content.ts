import mongoose from "mongoose";
import { dbConnect } from "../lib/mongodb";
import { Program } from "../models/Program";
import { Project } from "../models/Project";
import { Event } from "../models/Event";
import { Article } from "../models/Article";
import { GalleryItem } from "../models/GalleryItem";
import { Milestone } from "../models/Milestone";
import { Testimonial } from "../models/Testimonial";
import { Partner } from "../models/Partner";
import { VolunteerRole } from "../models/VolunteerRole";

// The stray Kenya-themed demo seed run — every doc from it lands in this
// narrow window and is never touched again unless staff edited it.
const SEED_WINDOW_START = new Date("2026-09-03T11:05:04.000Z");
const SEED_WINDOW_END = new Date("2026-09-03T11:05:05.000Z");

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous models, ops script only
type AnyModel = mongoose.Model<any>;

const COLLECTIONS: { name: string; Model: AnyModel; field: string }[] = [
  { name: "Programs", Model: Program, field: "title" },
  { name: "Projects", Model: Project, field: "title" },
  { name: "Events", Model: Event, field: "title" },
  { name: "News", Model: Article, field: "title" },
  { name: "Gallery", Model: GalleryItem, field: "caption" },
  { name: "Milestones", Model: Milestone, field: "event" },
  { name: "Testimonials", Model: Testimonial, field: "name" },
  { name: "Partners", Model: Partner, field: "name" },
  { name: "VolunteerRoles", Model: VolunteerRole, field: "role" },
];

// A duplicate created today by an edit-that-became-a-create — keep the one
// with real edit history, drop the untouched twin.
const DUPLICATE_TO_DELETE = {
  Model: Program,
  title: "Abdishakur Represents YEEP Somalia at UNESCO Conference in Nairobi",
  keepCreatedAt: new Date("2026-09-07T17:39:33.547Z"),
};

async function run() {
  await dbConnect();
  const force = process.argv.includes("--force");
  let totalToDelete = 0;

  for (const { name, Model, field } of COLLECTIONS) {
    const seedDocs = await Model.find({
      createdAt: { $gte: SEED_WINDOW_START, $lt: SEED_WINDOW_END },
      $expr: { $eq: ["$createdAt", "$updatedAt"] },
    }).select(`${field} createdAt`);
    console.log(`\n=== ${name}: ${seedDocs.length} untouched seed doc(s) ===`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ops script only
    for (const d of seedDocs) console.log(`  - ${(d as any)[field]}`);
    totalToDelete += seedDocs.length;
    if (force && seedDocs.length) {
      const ids = seedDocs.map((d: { _id: unknown }) => d._id);
      await Model.deleteMany({ _id: { $in: ids } });
    }
  }

  const dupe = await DUPLICATE_TO_DELETE.Model.findOne({
    title: DUPLICATE_TO_DELETE.title,
    createdAt: { $ne: DUPLICATE_TO_DELETE.keepCreatedAt },
  });
  console.log(`\n=== Duplicate program ===`);
  if (dupe) {
    console.log(`  - will delete duplicate created ${dupe.createdAt.toISOString()}`);
    totalToDelete += 1;
    if (force) await DUPLICATE_TO_DELETE.Model.deleteOne({ _id: dupe._id });
  } else {
    console.log("  - none found");
  }

  console.log(`\nTotal: ${totalToDelete} document(s) ${force ? "deleted" : "would be deleted (dry run)"}.`);
  if (!force) console.log("Re-run with --force to apply.");
  await mongoose.disconnect();
  process.exit(0);
}
run().catch((err) => { console.error(err); process.exit(1); });
