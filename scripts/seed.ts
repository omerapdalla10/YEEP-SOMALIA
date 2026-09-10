import mongoose from "mongoose";
import { dbConnect } from "../lib/mongodb";
import { User } from "../models/User";
import { Program } from "../models/Program";
import { Project } from "../models/Project";
import { Event } from "../models/Event";
import { Article } from "../models/Article";
import { GalleryItem } from "../models/GalleryItem";
import { TeamMember } from "../models/TeamMember";
import { Milestone } from "../models/Milestone";
import { Testimonial } from "../models/Testimonial";
import { Partner } from "../models/Partner";
import { Report } from "../models/Report";
import { VolunteerRole } from "../models/VolunteerRole";
import { Volunteer } from "../models/Volunteer";
import { ContactMessage } from "../models/ContactMessage";
import { Subscriber } from "../models/Subscriber";

// YEEP Somalia — Youth Engagement and Empowerment Platform.
// A registered, youth-led NGO in Mogadishu empowering Somali youth to lead,
// innovate, and build peaceful, inclusive and resilient communities.
// Sample content below — real figures (beneficiaries, progress) are entered
// through the admin dashboard.

const seedAdmin = {
  name: process.env.SEED_ADMIN_NAME ?? "YEEP Somalia Admin",
  email: process.env.SEED_ADMIN_EMAIL ?? "admin@yeep.org.so",
  password: process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345",
};

const programs = [
  { title: "Leadership & Youth Empowerment", category: "Leadership", description: "Empowers youth through leadership workshops, mentorship with professionals, and support for youth-led community projects to foster strong, capable leaders.", image: "photo-1529156069898-49953e39b3ac", beneficiaries: 0, duration: "Ongoing", progress: 0, status: "Active", region: "Banadir", featured: true },
  { title: "Civic Education & Advocacy", category: "Civic Education", description: "Educates youth on civic rights, governance, and policymaking, providing platforms for dialogue, advocacy, and community participation.", image: "photo-1507003211169-0a1dd7228f2d", beneficiaries: 0, duration: "Ongoing", progress: 0, status: "Active", region: "Banadir", featured: true },
  { title: "Economic Empowerment & Skills Development", category: "Entrepreneurship", description: "Equips youth with entrepreneurship training, vocational skills, and access to funding and mentorship to build businesses and enhance employability.", image: "photo-1556761175-b413da4baf72", beneficiaries: 0, duration: "Ongoing", progress: 0, status: "Active", region: "Banadir", featured: true },
  { title: "Community Development & Volunteerism", category: "Community", description: "Encourages youth-led initiatives, volunteer projects, and public awareness campaigns to improve local services and promote social responsibility.", image: "photo-1542601906897-f85ee4bf1a17", beneficiaries: 0, duration: "Ongoing", progress: 0, status: "Active", region: "Banadir" },
  { title: "Preventing Violent Extremism (PCVE)", category: "Peacebuilding", description: "Promotes critical thinking, digital literacy, and peacebuilding initiatives to counter misinformation, resolve conflicts, and foster unity.", image: "photo-1576091160399-112ba8d25d1d", beneficiaries: 0, duration: "Ongoing", progress: 0, status: "Active", region: "Banadir" },
  { title: "Psychosocial Support (MHPSS)", category: "Wellbeing", description: "Provides peer-to-peer and community-based support systems that strengthen mental wellbeing, resilience, and emotional recovery among young people and communities.", image: "photo-1531123897727-8f129e1688ce", beneficiaries: 0, duration: "Ongoing", progress: 0, status: "Active", region: "Banadir" },
];

// Sample only — add real projects (with funders and figures) through the admin.
const projects = [
  { title: "Leadership Workshops & Mentorship", location: "Mogadishu, Somalia", region: "Banadir", budget: 0, raised: 0, progress: 0, status: "Ongoing", image: "photo-1529156069898-49953e39b3ac", beneficiaries: 0, description: "Leadership workshops and mentorship with professionals, plus support for youth-led community projects." },
  { title: "Youth Entrepreneurship & Skills", location: "Mogadishu, Somalia", region: "Banadir", budget: 0, raised: 0, progress: 0, status: "Ongoing", image: "photo-1556761175-b413da4baf72", beneficiaries: 0, description: "Entrepreneurship training, vocational skills, and access to funding and mentorship to build businesses and improve employability." },
];

// Sample only — add real events through the admin dashboard.
const events = [
  { title: "Youth Leadership Workshop", startDate: "2026-11-11T09:00:00Z", endDate: "2026-11-13T17:00:00Z", dateLabel: "November 11–13, 2026", timeLabel: "9:00 AM – 5:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Workshop", capacity: 80, registered: 0, description: "Three days of training in leadership, communication and community project design for young people.", image: "photo-1531123897727-8f129e1688ce", month: "November 2026", featured: true },
  { title: "Community Dialogue on Peace & Resilience", startDate: "2026-11-26T10:00:00Z", dateLabel: "November 26, 2026", timeLabel: "10:00 AM – 3:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Forum", capacity: 70, registered: 0, description: "A facilitated dialogue bringing youth and community members together on shared challenges and solutions.", image: "photo-1507003211169-0a1dd7228f2d", month: "November 2026" },
  { title: "Volunteer & Partner Networking Evening", startDate: "2026-12-10T15:00:00Z", dateLabel: "December 10, 2026", timeLabel: "3:00 PM – 6:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Networking", capacity: 100, registered: 0, description: "An informal gathering connecting YEEP Somalia volunteers, alumni and partner organisations.", image: "photo-1511578314322-379afb476865", month: "December 2026" },
];

// Sample only — publish real news through the admin dashboard.
const articles: {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: string;
  image: string;
  featured?: boolean;
  readTime: string;
  views: number;
}[] = [];

// Sample only — replace with real photos and captions through the admin.
const gallery = [
  { type: "image", image: "photo-1529156069898-49953e39b3ac", category: "Events", caption: "Youth gathering", span: "col-span-2 row-span-2", order: 1 },
  { type: "image", image: "photo-1531123897727-8f129e1688ce", category: "Programs", caption: "Leadership workshop", span: "", order: 2 },
  { type: "image", image: "photo-1542601906897-f85ee4bf1a17", category: "Community", caption: "Community dialogue", span: "", order: 3 },
  { type: "image", image: "photo-1507003211169-0a1dd7228f2d", category: "Programs", caption: "Training session", span: "", order: 4 },
  { type: "image", image: "photo-1529390079861-591de354faf5", category: "Programs", caption: "Group discussion", span: "col-span-2", order: 5 },
  { type: "image", image: "photo-1576091160399-112ba8d25d1d", category: "Community", caption: "Youth engagement workshop", span: "", order: 6 },
  { type: "image", image: "photo-1488521787991-ed7bbaae773c", category: "Volunteers", caption: "Volunteers in training", span: "", order: 7 },
  { type: "image", image: "photo-1511578314322-379afb476865", category: "Events", caption: "Networking evening", span: "", order: 8 },
  { type: "image", image: "photo-1556761175-b413da4baf72", category: "Programs", caption: "Skills development session", span: "", order: 9 },
  { type: "image", image: "photo-1438761681033-6461ffad8d80", category: "Volunteers", caption: "Community mobilisers", span: "", order: 10 },
];

// Real YEEP Somalia team — upload each member's photo through the admin.
const team = [
  { name: "Hamdi Abdi Adow", role: "Executive Director", image: "", order: 1 },
  { name: "Abdishakur Moalim Shiimaay", role: "Vice Executive Director", image: "", order: 2 },
  { name: "Nasteho Sheikh Abdirahman", role: "Administration & Finance", image: "", order: 3 },
  { name: "Amran Farah", role: "Program & Partnership", image: "", order: 4 },
  { name: "Salma Mohyadeen", role: "Case Management", image: "", order: 5 },
  { name: "Hassan Ahmed Jakuulla", role: "Grants", image: "", order: 6 },
  { name: "Deeqsan Ahmed", role: "Human Resource", image: "", order: 7 },
  { name: "Deka Omar", role: "MEAL", image: "", order: 8 },
  { name: "Hodo Garad", role: "Communication", image: "", order: 9 },
];

// Sample only — add real dated milestones through the admin dashboard.
const milestones = [
  { year: "Origin", event: "Founded by Somali youth who were trained and engaged through the UNOCT Youth Engagement and Empowerment Program (YEEP).", order: 1 },
  { year: "Today", event: "A registered, youth-led NGO based in Mogadishu running six programs across leadership, civic education, economic empowerment, community development, PCVE and psychosocial support.", order: 2 },
];

// Sample only — replace with real testimonials through the admin dashboard.
const testimonials: {
  name: string;
  role: string;
  text: string;
  image: string;
  rating: number;
  placement: string;
  order: number;
}[] = [];

// Sample only — add real partners (with logos) through the admin dashboard.
const partners: { name: string; order: number }[] = [];

const volunteerRoles = [
  { role: "Peace Education Facilitator", commitment: "4 hrs/week", location: "Mogadishu", skills: "Facilitation, Training", order: 1 },
  { role: "Youth Mentor", commitment: "3 hrs/week", location: "Field", skills: "Coaching, Leadership", order: 2 },
  { role: "Research & Advocacy Volunteer", commitment: "5 hrs/week", location: "Remote + Mogadishu", skills: "Research, Writing", order: 3 },
  { role: "Communications & Media Volunteer", commitment: "3 hrs/week", location: "Remote", skills: "Media, Design", order: 4 },
  { role: "Event Coordinator", commitment: "Project-based", location: "Mogadishu", skills: "Logistics, Comms", order: 5 },
  { role: "Community Mobiliser", commitment: "5 hrs/week", location: "Field", skills: "Outreach, Communication", order: 6 },
];

const reports = [
  {
    kind: "Annual Report",
    title: "YEEP Somalia Annual Report 2025",
    year: "2025",
    summary:
      "A full year of youth-led peacebuilding — programmes, partnerships, reach and financials.",
    fileUrl: "https://example.org/yeep-somalia-annual-report-2025.pdf",
    fileSize: "3.1 MB",
    order: 1,
  },
  {
    kind: "Strategy",
    title: "Strategic Plan 2025–2027",
    year: "2025",
    summary: "Our three-year direction on Youth, Peace and Security.",
    fileUrl: "https://example.org/yeep-somalia-strategy-2025-2027.pdf",
    fileSize: "1.4 MB",
    order: 2,
  },
];

async function seed() {
  await dbConnect();

  // Guard: never wipe a database that already has data unless explicitly forced.
  const force = process.argv.includes("--force") || process.env.SEED_FORCE === "1";
  const existingUsers = await User.estimatedDocumentCount();
  if (existingUsers > 0 && !force) {
    console.log(
      `[seed] database already has ${existingUsers} user(s) — skipping.\n` +
        "[seed] run `npm run seed -- --force` (or SEED_FORCE=1) to wipe and re-seed.",
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log("[seed] clearing collections...");
  await Promise.all([
    User.deleteMany({}),
    Program.deleteMany({}),
    Project.deleteMany({}),
    Event.deleteMany({}),
    Article.deleteMany({}),
    GalleryItem.deleteMany({}),
    TeamMember.deleteMany({}),
    Milestone.deleteMany({}),
    Testimonial.deleteMany({}),
    Partner.deleteMany({}),
    Report.deleteMany({}),
    VolunteerRole.deleteMany({}),
    Volunteer.deleteMany({}),
    ContactMessage.deleteMany({}),
    Subscriber.deleteMany({}),
  ]);

  // The only account the seeder creates. Every other user is a real sign-up.
  const admin = await User.create({
    name: seedAdmin.name,
    email: seedAdmin.email,
    password: seedAdmin.password,
    role: "admin",
    avatar: "photo-1531123897727-8f129e1688ce",
    emailVerified: true,
  });

  // Public site content only — no fake users, applications, messages or subscribers.
  for (const p of programs) await new Program(p).save();
  for (const p of projects) await new Project(p).save();
  for (const e of events) await new Event(e).save();
  for (const a of articles) await new Article(a).save();
  await GalleryItem.create(gallery);
  await TeamMember.create(team);
  await Milestone.create(milestones);
  await Testimonial.create(testimonials);
  await Partner.create(partners);
  await Report.create(reports);
  await VolunteerRole.create(volunteerRoles);

  console.log("[seed] done — 1 admin user + site content.");
  console.log(`[seed] admin login: ${admin.email} / ${seedAdmin.password}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
