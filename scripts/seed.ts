/* eslint-disable no-console */
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

// YEEP Somalia — Youth Engagement and Empowerment Programme.
// A youth-led NGO in Mogadishu advancing Youth, Peace and Security (YPS),
// youth leadership, civic engagement, and community resilience across Somalia.

const seedAdmin = {
  name: process.env.SEED_ADMIN_NAME ?? "YEEP Somalia Admin",
  email: process.env.SEED_ADMIN_EMAIL ?? "admin@yeep.org.so",
  password: process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345",
};

const programs = [
  { title: "Youth Leadership Academy", category: "Leadership", description: "Intensive leadership and peacebuilding training for young Somalis — covering dialogue facilitation, conflict analysis, community organising, and project design.", image: "photo-1529156069898-49953e39b3ac", beneficiaries: 320, duration: "4 months", progress: 70, status: "Active", region: "Banadir", featured: true },
  { title: "Youth, Peace & Security (YPS) Fellowship", category: "Leadership", description: "A fellowship equipping young leaders to advance the national YPS agenda — pairing mentorship with real advocacy engagements alongside government and civil society.", image: "photo-1507003211169-0a1dd7228f2d", beneficiaries: 140, duration: "6 months", progress: 55, status: "Active", region: "Banadir", featured: true },
  { title: "Community Peace Dialogues", category: "Leadership", description: "Facilitated spaces where youth, elders, women and local authorities discuss shared challenges and lead local peace initiatives together.", image: "photo-1542601906897-f85ee4bf1a17", beneficiaries: 480, duration: "Ongoing", progress: 62, status: "Active", region: "South West", featured: true },
  { title: "Preventing Violent Extremism through Youth Engagement", category: "Leadership", description: "Youth-led activities that strengthen community resilience and address local drivers of violent extremism through positive engagement and alternatives.", image: "photo-1576091160399-112ba8d25d1d", beneficiaries: 260, duration: "8 months", progress: 48, status: "Active", region: "Jubaland" },
  { title: "Civic Engagement & Advocacy Lab", category: "Leadership", description: "Hands-on training in civic participation, campaign design, and evidence-based advocacy so young people can raise their priorities with decision-makers.", image: "photo-1531123897727-8f129e1688ce", beneficiaries: 190, duration: "3 months", progress: 65, status: "Enrolling", region: "Banadir" },
  { title: "Digital Storytelling for Peace", category: "Digital Literacy", description: "Media and digital-skills training that helps youth document their communities, counter harmful narratives, and share stories of peace and resilience.", image: "photo-1509062522246-3755977927d7", beneficiaries: 150, duration: "10 weeks", progress: 40, status: "Enrolling", region: "Puntland" },
  { title: "Young Women in Peacebuilding", category: "Leadership", description: "A targeted programme building the leadership, negotiation and networking skills of young women so they take part in peace and security decision-making.", image: "photo-1529390079861-591de354faf5", beneficiaries: 210, duration: "5 months", progress: 58, status: "Active", region: "Hirshabelle" },
  { title: "Youth Livelihoods & Resilience", category: "Entrepreneurship", description: "Enterprise and employability training that gives at-risk youth economic alternatives, linking livelihoods to community stability.", image: "photo-1556761175-b413da4baf72", beneficiaries: 170, duration: "4 months", progress: 45, status: "Active", region: "Galmudug" },
];

const projects = [
  { title: "Youth Leadership Academy — Banadir", location: "Mogadishu, Somalia", region: "Banadir", budget: 42000, raised: 30000, progress: 71, status: "Ongoing", image: "photo-1529156069898-49953e39b3ac", beneficiaries: 320, description: "Delivering three cohorts of the Youth Leadership Academy in Mogadishu, training young leaders in dialogue facilitation, conflict analysis and community project design.", fundedBy: "GCERF", partners: "Elman Peace and Human Rights Centre" },
  { title: "Community Peace Dialogues — South West State", location: "Baidoa, Somalia", region: "South West", budget: 28000, raised: 19600, progress: 60, status: "Ongoing", image: "photo-1542601906897-f85ee4bf1a17", beneficiaries: 480, description: "A rolling series of community dialogues bringing youth together with elders, women and local authorities to identify and act on local drivers of conflict.", fundedBy: "U.S. Embassy Mogadishu", partners: "Ministry of Youth and Sports" },
  { title: "Youth in Policy: National YPS Agenda", location: "Mogadishu, Somalia", region: "Banadir", budget: 24000, raised: 16800, progress: 55, status: "Ongoing", image: "photo-1507003211169-0a1dd7228f2d", beneficiaries: 140, description: "Supporting young Somalis to contribute to the national Youth, Peace and Security agenda through structured consultations with government and civil society.", fundedBy: "GCERF", partners: "Federal Government of Somalia — Ministry of Youth and Sports" },
  { title: "PVE Youth Innovation Fund", location: "Kismayo, Somalia", region: "Jubaland", budget: 18000, raised: 0, progress: 0, status: "Planned", image: "photo-1576091160399-112ba8d25d1d", beneficiaries: 260, description: "Small grants for youth-led initiatives that strengthen community resilience and offer positive alternatives to violent extremism.", fundedBy: "GCERF", partners: "Elman Peace and Human Rights Centre" },
  { title: "Digital Storytelling for Peace", location: "Garowe, Somalia", region: "Puntland", budget: 15000, raised: 15000, progress: 100, status: "Completed", image: "photo-1509062522246-3755977927d7", beneficiaries: 150, description: "Trained 150 young people to document their communities and share stories of peace and resilience across social and local media.", fundedBy: "U.S. Embassy Mogadishu", partners: "YEEP Somalia" },
  { title: "Young Women in Peacebuilding", location: "Beledweyne, Somalia", region: "Hirshabelle", budget: 26000, raised: 15600, progress: 58, status: "Ongoing", image: "photo-1529390079861-591de354faf5", beneficiaries: 210, description: "Building the leadership and negotiation skills of young women so they take part in peace and security decision-making at community and state level.", fundedBy: "GCERF", partners: "Ministry of Youth and Sports" },
];

const events = [
  { title: "National Youth, Peace & Security Forum", startDate: "2026-10-14T09:00:00Z", endDate: "2026-10-15T17:00:00Z", dateLabel: "October 14–15, 2026", timeLabel: "9:00 AM – 5:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Conference", capacity: 300, registered: 210, description: "A two-day forum bringing young leaders together with government, civil society and partners to advance the national YPS agenda.", image: "photo-1529156069898-49953e39b3ac", month: "October 2026", featured: true },
  { title: "Community Peace Dialogue — Baidoa", startDate: "2026-09-24T08:00:00Z", dateLabel: "September 24, 2026", timeLabel: "8:00 AM – 1:00 PM", location: "Baidoa, Somalia", region: "South West", type: "Community", capacity: 90, registered: 61, description: "A facilitated dialogue between youth, elders and local authorities on shared community challenges and joint solutions.", image: "photo-1542601906897-f85ee4bf1a17", month: "September 2026", featured: true },
  { title: "Preventing Violent Extremism Youth Workshop", startDate: "2026-10-08T09:00:00Z", dateLabel: "October 8, 2026", timeLabel: "9:00 AM – 4:00 PM", location: "Kismayo, Somalia", region: "Jubaland", type: "Workshop", capacity: 60, registered: 38, description: "A hands-on workshop on community resilience and youth-led alternatives to violent extremism.", image: "photo-1576091160399-112ba8d25d1d", month: "October 2026" },
  { title: "Youth Leadership Bootcamp", startDate: "2026-11-11T09:00:00Z", endDate: "2026-11-13T17:00:00Z", dateLabel: "November 11–13, 2026", timeLabel: "9:00 AM – 5:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Workshop", capacity: 80, registered: 52, description: "Three days of intensive training in leadership, dialogue facilitation and project design for the next Academy cohort.", image: "photo-1531123897727-8f129e1688ce", month: "November 2026" },
  { title: "YPS Policy Roundtable", startDate: "2026-11-26T10:00:00Z", dateLabel: "November 26, 2026", timeLabel: "10:00 AM – 3:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Forum", capacity: 70, registered: 44, description: "A closed roundtable where youth representatives and the Ministry of Youth and Sports review progress on the national YPS roadmap.", image: "photo-1507003211169-0a1dd7228f2d", month: "November 2026" },
  { title: "Volunteer & Partner Networking Evening", startDate: "2026-12-10T15:00:00Z", dateLabel: "December 10, 2026", timeLabel: "3:00 PM – 6:00 PM", location: "Mogadishu, Somalia", region: "Banadir", type: "Networking", capacity: 100, registered: 57, description: "An informal gathering connecting YEEP Somalia volunteers, alumni and partner organisations.", image: "photo-1511578314322-379afb476865", month: "December 2026" },
];

const articles = [
  { title: "YEEP Somalia Launches National Youth, Peace and Security Forum", excerpt: "Young leaders from across Somalia will gather in Mogadishu with government and civil society to advance the national YPS agenda.", category: "Events", publishedAt: "2026-08-20", author: "Ayaan Abdi", image: "photo-1529156069898-49953e39b3ac", featured: true, readTime: "4 min", views: 640 },
  { title: "YEEP Somalia and GCERF Partner to Expand Youth-Led Peacebuilding", excerpt: "A new partnership with the Global Community Engagement and Resilience Fund will scale up community dialogues and the PVE Youth Innovation Fund.", category: "Partnerships", publishedAt: "2026-07-30", author: "Abdirahman Yusuf", image: "photo-1542601906897-f85ee4bf1a17", readTime: "5 min", views: 910 },
  { title: "From Mogadishu to the Policy Table: Young Somalis Shape the YPS Agenda", excerpt: "Fellows describe taking youth priorities directly to policymakers for the first time through YEEP Somalia's YPS Fellowship.", category: "Stories", publishedAt: "2026-07-12", author: "Hodan Mohamed", image: "photo-1507003211169-0a1dd7228f2d", readTime: "6 min", views: 720 },
  { title: "First Youth Leadership Academy Cohort Graduates in Mogadishu", excerpt: "More than 100 young leaders completed four months of training in dialogue facilitation, conflict analysis and community project design.", category: "Impact", publishedAt: "2026-06-25", author: "Fadumo Ali", image: "photo-1531123897727-8f129e1688ce", readTime: "4 min", views: 830 },
  { title: "Community Dialogues in Baidoa Tackle Local Drivers of Conflict", excerpt: "Youth, elders and local authorities in South West State are turning tension into joint action through YEEP Somalia's facilitated dialogues.", category: "Programs", publishedAt: "2026-06-05", author: "Ismail Warsame", image: "photo-1509062522246-3755977927d7", readTime: "5 min", views: 560 },
  { title: "YEEP Somalia Joins Ministry of Youth and Sports on National YPS Roadmap", excerpt: "The Federal Government of Somalia and youth-led organisations are working together to embed young people's voices in peace and security policy.", category: "Partnerships", publishedAt: "2026-05-18", author: "Khadija Nur", image: "photo-1576091160399-112ba8d25d1d", readTime: "4 min", views: 690 },
];

const gallery = [
  { type: "image", image: "photo-1529156069898-49953e39b3ac", category: "Events", caption: "Youth, Peace & Security Forum — Mogadishu", span: "col-span-2 row-span-2", order: 1 },
  { type: "image", image: "photo-1531123897727-8f129e1688ce", category: "Programs", caption: "Youth Leadership Academy cohort", span: "", order: 2 },
  { type: "image", image: "photo-1542601906897-f85ee4bf1a17", category: "Community", caption: "Community peace dialogue in South West State", span: "", order: 3 },
  { type: "video", image: "photo-1509062522246-3755977927d7", category: "Programs", caption: "Digital Storytelling for Peace showcase", span: "", order: 4 },
  { type: "image", image: "photo-1507003211169-0a1dd7228f2d", category: "Programs", caption: "YPS Fellows meeting policymakers", span: "", order: 5 },
  { type: "image", image: "photo-1529390079861-591de354faf5", category: "Programs", caption: "Young Women in Peacebuilding session", span: "col-span-2", order: 6 },
  { type: "image", image: "photo-1576091160399-112ba8d25d1d", category: "Community", caption: "PVE youth engagement workshop — Kismayo", span: "", order: 7 },
  { type: "image", image: "photo-1488521787991-ed7bbaae773c", category: "Volunteers", caption: "Volunteer facilitators in training", span: "", order: 8 },
  { type: "image", image: "photo-1511578314322-379afb476865", category: "Events", caption: "Volunteer & partner networking evening", span: "", order: 9 },
  { type: "image", image: "photo-1556761175-b413da4baf72", category: "Programs", caption: "Youth Livelihoods & Resilience training", span: "", order: 10 },
  { type: "video", image: "photo-1529156069898-49953e39b3ac", category: "Events", caption: "Highlights from the YPS Forum", span: "col-span-2", order: 11 },
  { type: "image", image: "photo-1438761681033-6461ffad8d80", category: "Volunteers", caption: "Community mobilisers in Beledweyne", span: "", order: 12 },
];

const team = [
  { name: "Abdirahman Yusuf", role: "Executive Director", image: "photo-1507003211169-0a1dd7228f2d", order: 1 },
  { name: "Fadumo Ali", role: "Programmes Coordinator", image: "photo-1494790108377-be9c29b29330", order: 2 },
  { name: "Hodan Mohamed", role: "YPS & Advocacy Lead", image: "photo-1438761681033-6461ffad8d80", order: 3 },
  { name: "Ismail Warsame", role: "Community Engagement Officer", image: "photo-1500648767791-00dcc994a43e", order: 4 },
  { name: "Ayaan Abdi", role: "Communications Officer", image: "photo-1531123897727-8f129e1688ce", order: 5 },
  { name: "Khadija Nur", role: "Monitoring & Learning Officer", image: "photo-1472099645785-5658abf4ff4e", order: 6 },
];

const milestones = [
  { year: "2024", event: "YEEP Somalia founded in Mogadishu as a youth-led initiative on Youth, Peace and Security", order: 1 },
  { year: "2024", event: "First Youth Leadership Academy cohort trained in Banadir", order: 2 },
  { year: "2025", event: "Partnerships established with GCERF and Elman Peace and Human Rights Centre", order: 3 },
  { year: "2025", event: "Community peace dialogues launched in South West State", order: 4 },
  { year: "2026", event: "Youth input into the national YPS agenda with the Ministry of Youth and Sports", order: 5 },
  { year: "2026", event: "Programmes active across multiple federal member states with 10+ partners", order: 6 },
];

const testimonials = [
  { name: "Amina Farah", role: "Youth Leadership Academy Graduate", text: "The academy gave me the confidence and the skills to lead a peace initiative in my own neighbourhood.", image: "photo-1531123897727-8f129e1688ce", rating: 5, placement: "home", order: 1 },
  { name: "Mohamed Aden", role: "YPS Fellow", text: "Through YEEP Somalia I took youth priorities directly to policymakers for the first time.", image: "photo-1507003211169-0a1dd7228f2d", rating: 5, placement: "home", order: 2 },
  { name: "Sagal Ibrahim", role: "Community Dialogue Facilitator", text: "Our dialogues turned tension between young people and elders into joint action for the community.", image: "photo-1438761681033-6461ffad8d80", rating: 5, placement: "home", order: 3 },
  { name: "Yasin Omar", role: "Peace Education Facilitator — 2 years", text: "Volunteering with YEEP Somalia, I have trained dozens of young people in dialogue and conflict resolution.", image: "photo-1472099645785-5658abf4ff4e", rating: 5, placement: "volunteer", order: 1 },
  { name: "Halima Abdullahi", role: "Research & Advocacy Volunteer", text: "I help turn what youth tell us in the field into evidence that policymakers can actually act on.", image: "photo-1494790108377-be9c29b29330", rating: 5, placement: "volunteer", order: 2 },
];

const partners = [
  "U.S. Embassy Mogadishu",
  "Elman Peace and Human Rights Centre",
  "GCERF",
  "Ministry of Youth and Sports (FGS)",
].map((name, i) => ({ name, order: i + 1 }));

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
