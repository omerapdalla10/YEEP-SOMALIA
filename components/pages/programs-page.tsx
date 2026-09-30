import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ChevronRight,
  Target,
  Globe,
  Wrench,
  Handshake,
  TrendingUp,
  Building2,
  Users,
  Landmark,
  GraduationCap,
  UserCheck,
  Network,
  HandHeart,
  Sprout,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { PILLAR_PROGRAMS } from "@/lib/data/pillar-programs";

const APPROACH = [
  {
    title: "Youth-Centered",
    icon: Target,
    text: "We place young people at the center of our programs. Their experiences, needs, ideas, and priorities inform our activities.",
  },
  {
    title: "Inclusive",
    icon: Globe,
    text: "We promote meaningful participation and create opportunities for young people from different backgrounds and communities.",
  },
  {
    title: "Practical",
    icon: Wrench,
    text: "Our programs focus on practical knowledge, skills, and experiences that young people can apply in their daily lives.",
  },
  {
    title: "Community-Based",
    icon: Building2,
    text: "We work with communities and local stakeholders to ensure our programs respond to real community needs.",
  },
  {
    title: "Collaborative",
    icon: Handshake,
    text: "We work with partners, youth groups, institutions, and community stakeholders to strengthen the reach and sustainability of our programs.",
  },
  {
    title: "Impact-Focused",
    icon: TrendingUp,
    text: "We focus on measurable outcomes and meaningful changes in the lives of young people and their communities.",
  },
];

const IMPACT_FLOW = [
  "Youth gain knowledge and practical skills.",
  "Youth participate in leadership and community activities.",
  "Young people identify challenges and develop local solutions.",
  "Communities benefit from stronger youth participation and collaboration.",
  "Young people contribute to peaceful, inclusive, and resilient communities.",
];

const STAKEHOLDERS = [
  { label: "Young people and youth groups", icon: Users },
  { label: "Community organizations", icon: Building2 },
  { label: "Civil society organizations", icon: Landmark },
  { label: "Educational institutions", icon: GraduationCap },
  { label: "Local community leaders", icon: UserCheck },
  { label: "Government institutions", icon: Landmark },
  { label: "Development partners", icon: Network },
  { label: "International organizations", icon: Globe },
  { label: "Volunteers", icon: HandHeart },
  { label: "Community-based initiatives", icon: Sprout },
];

const GET_INVOLVED = [
  {
    title: "Join a Program",
    icon: BookOpen,
    text: "Take part in YEEP Somalia training, workshops, dialogues, and youth activities.",
    href: "/volunteer",
    cta: "Join now",
  },
  {
    title: "Volunteer",
    icon: HandHeart,
    text: "Contribute your time, skills, and ideas to community initiatives.",
    href: "/volunteer",
    cta: "Become a volunteer",
  },
  {
    title: "Partner With Us",
    icon: Handshake,
    text: "Work with YEEP Somalia to design and implement programs that respond to youth and community needs.",
    href: "/contact",
    cta: "Start a partnership",
  },
  {
    title: "Support Youth-Led Initiatives",
    icon: Lightbulb,
    text: "Help create opportunities for young people to develop and implement solutions within their communities.",
    href: "/contact",
    cta: "Get in touch",
  },
];

export default function ProgramsPage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-[#1F6BA0]">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Programs
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Our Programs</h1>
          <p className="text-lg lg:text-xl text-white/85 font-medium">
            Building Skills. Creating Opportunities. Strengthening Communities.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 leading-relaxed mb-5">
            YEEP Somalia implements practical and impactful programs designed to equip young
            people with the skills, knowledge, confidence, and opportunities they need to
            contribute positively to their communities and country.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Our programs respond to the needs and experiences of young people across Somalia. We
            create opportunities for youth to develop leadership skills, participate in civic
            life, build livelihoods, support their communities, promote peace, and access
            psychosocial support.
          </p>
          <Link
            href="#program-areas"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D8FCE] hover:text-[#1F6BA0] transition-colors"
          >
            Our work is organized around six core program areas <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* Program Areas */}
      <section id="program-areas" className="py-16 lg:py-20 bg-[#f8fafc] scroll-mt-16 lg:scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#D4E6F4] text-[#1F6BA0] text-xs font-semibold rounded-full mb-4">
              What we do
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Our Program Areas</h2>
          </div>

          <div className="space-y-6">
            {PILLAR_PROGRAMS.map((prog, i) => (
              <div
                key={prog.slug}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-colors hover:border-[#2D8FCE]/40"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0] text-white shrink-0">
                      <prog.icon size={22} />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#2D8FCE] tracking-wide">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 leading-snug">
                        {prog.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-800 font-medium mb-3">{prog.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{prog.description}</p>

                  <p className="text-xs font-semibold text-gray-400 tracking-wide mb-2.5">
                    KEY AREAS
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {prog.keyAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2.5 py-1 bg-[#D4E6F4]/60 text-[#1F6BA0] text-xs font-medium rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed italic mb-5 border-l-2 border-[#2D8FCE]/30 pl-3">
                    {prog.outcome}
                  </p>

                  <Link
                    href={`/programs/${prog.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D8FCE] hover:text-[#1F6BA0] transition-colors"
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Approach</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPROACH.map((a) => (
              <div key={a.title} className="rounded-xl border border-gray-200 p-6">
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#D4E6F4] text-[#1F6BA0] mb-4">
                  <a.icon size={20} />
                </span>
                <h3 className="font-bold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact flow */}
      <section className="py-16 lg:py-20 bg-[#0d1f1e]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">How Our Programs Create Impact</h2>
          <div className="flex flex-col items-center">
            {IMPACT_FLOW.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`px-6 py-4 rounded-xl max-w-md ${
                    i === IMPACT_FLOW.length - 1
                      ? "bg-[#2D8FCE] text-white font-semibold"
                      : "bg-white/5 border border-white/10 text-white/80"
                  }`}
                >
                  {step}
                </div>
                {i < IMPACT_FLOW.length - 1 && (
                  <ArrowDown size={18} className="text-[#2D8FCE] my-3 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="py-16 lg:py-20 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Who We Work With</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Our programs engage a wide range of stakeholders, including:
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STAKEHOLDERS.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center flex flex-col items-center gap-2.5"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D4E6F4] text-[#1F6BA0]">
                  <s.icon size={18} />
                </span>
                <span className="text-xs font-medium text-gray-600 leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 lg:py-20 bg-[#1F6BA0]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Commitment</h2>
          <p className="text-white/85 leading-relaxed mb-4">
            YEEP Somalia is committed to creating meaningful opportunities for young people to
            learn, participate, lead, and contribute.
          </p>
          <p className="text-white/85 leading-relaxed mb-4">
            Through our six program areas, we work to strengthen young people&apos;s skills,
            expand opportunities, support wellbeing, promote peaceful communities, and encourage
            meaningful civic participation.
          </p>
          <p className="text-white/85 leading-relaxed mb-4">
            We believe young people have an important role in shaping the future of their
            communities and country.
          </p>
          <p className="text-white font-semibold">
            Together, we support young people to turn knowledge into action and ideas into
            meaningful community initiatives.
          </p>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Get Involved</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Are you a young person, organization, institution, or community stakeholder
              interested in working with YEEP Somalia? There are different ways to get involved.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GET_INVOLVED.map((g) => (
              <div
                key={g.title}
                className="rounded-xl border border-gray-200 p-6 flex flex-col hover:border-[#2D8FCE]/40 transition-colors"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#D4E6F4] text-[#1F6BA0] mb-4">
                  <g.icon size={20} />
                </span>
                <h3 className="font-bold text-gray-900 mb-2">{g.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{g.text}</p>
                <Link
                  href={g.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D8FCE] hover:text-[#1F6BA0] transition-colors"
                >
                  {g.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#2D8FCE]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
          <p className="text-white/80 mb-8">
            Together, we can create more opportunities for young people to learn, lead,
            participate, and contribute to stronger communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#program-areas"
              className="px-7 py-3 bg-white text-[#2D8FCE] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Explore Our Programs
            </Link>
            <Link
              href="/volunteer"
              className="px-7 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Become a Volunteer
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Partner With YEEP Somalia
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
