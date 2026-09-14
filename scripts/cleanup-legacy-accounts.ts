import mongoose from "mongoose";
import { dbConnect } from "../lib/mongodb";
import { User } from "../models/User";

/**
 * One-off migration for the "no public accounts" redesign:
 *  - Deletes every User whose role isn't staff/admin (old self-registered
 *    "volunteer" accounts — there's no more public sign-up, so these can't be
 *    recreated and aren't needed).
 *  - Drops the `volunteerhours` collection (the feature was removed).
 *  - Drops the old `eventregistrations` collection (the RSVP model changed
 *    from account-based to a public name/email/phone form — old rows don't
 *    match the new schema and the live attendee counts should start fresh).
 *
 * Run once: `npm run cleanup:legacy-accounts` (or `-- --force` to skip the
 * confirmation-by-dry-run step).
 */
async function run() {
  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connection.");

  const dryRun = !process.argv.includes("--force");

  const staleUsers = await User.find({ role: { $nin: ["staff", "admin"] } }).select(
    "name email role",
  );
  const hoursCount = await db
    .collection("volunteerhours")
    .countDocuments()
    .catch(() => 0);
  const regCount = await db
    .collection("eventregistrations")
    .countDocuments()
    .catch(() => 0);

  console.log(`[cleanup] ${staleUsers.length} non-staff/admin user(s) to delete:`);
  for (const u of staleUsers) console.log(`  - ${u.name} <${u.email}> (${u.role})`);
  console.log(`[cleanup] volunteerhours collection: ${hoursCount} document(s)`);
  console.log(`[cleanup] eventregistrations collection: ${regCount} document(s) (legacy shape)`);

  if (dryRun) {
    console.log("\n[cleanup] dry run — nothing changed. Re-run with --force to apply.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const { deletedCount } = await User.deleteMany({ role: { $nin: ["staff", "admin"] } });
  await db.collection("volunteerhours").drop().catch(() => {});
  await db.collection("eventregistrations").drop().catch(() => {});

  console.log(`\n[cleanup] deleted ${deletedCount} user(s).`);
  console.log("[cleanup] dropped volunteerhours + eventregistrations collections.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[cleanup] failed:", err);
  process.exit(1);
});
