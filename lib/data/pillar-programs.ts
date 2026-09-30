import { Lightbulb, Settings2, Users, Building2, ShieldAlert, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The six official YEEP Somalia programme pillars. Fixed content (not
 * database-backed) used for the Programs page, the navbar "Programs"
 * dropdown, and the detail pages at /programs/[slug].
 */
export interface PillarProgram {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  keyAreas: string[];
  outcome: string;
  icon: LucideIcon;
}

export const PILLAR_PROGRAMS: PillarProgram[] = [
  {
    slug: "leadership-youth-empowerment",
    title: "Leadership & Youth Empowerment",
    tagline:
      "We support young people to become confident, responsible, and active leaders in their communities.",
    description:
      "Our leadership programs help youth develop practical leadership skills, strengthen their decision-making abilities, and participate in initiatives that address challenges affecting their communities.",
    keyAreas: [
      "Youth leadership training",
      "Leadership and personal development",
      "Youth participation and engagement",
      "Communication and public speaking",
      "Decision-making and problem-solving",
      "Mentorship and peer learning",
      "Youth-led initiatives",
      "Capacity building for youth organizations",
    ],
    outcome:
      "Through these activities, young people gain the confidence and skills needed to take meaningful roles in their communities and contribute to positive social change.",
    icon: Lightbulb,
  },
  {
    slug: "civic-education-advocacy",
    title: "Civic Education & Advocacy",
    tagline: "We help young people understand their rights, responsibilities, and role in civic life.",
    description:
      "Our civic education and advocacy programs create spaces where young people learn about participation, community decision-making, accountability, and peaceful engagement.",
    keyAreas: [
      "Civic education",
      "Youth participation",
      "Rights and responsibilities",
      "Advocacy and campaigning",
      "Community dialogue",
      "Policy awareness",
      "Social accountability",
      "Youth voice and representation",
      "Peaceful civic participation",
    ],
    outcome:
      "We encourage young people to express their ideas, engage with community stakeholders, and participate constructively in issues affecting their communities.",
    icon: Settings2,
  },
  {
    slug: "economic-empowerment-skills-development",
    title: "Economic Empowerment & Skills Development",
    tagline:
      "We support young people in developing practical skills and accessing opportunities that improve their economic prospects.",
    description:
      "Our programs focus on employability, entrepreneurship, vocational skills, digital skills, and other forms of capacity building that help youth prepare for the changing labor market.",
    keyAreas: [
      "Employability skills",
      "Entrepreneurship development",
      "Vocational and technical skills",
      "Digital skills",
      "Career development",
      "Business development",
      "Financial literacy",
      "Mentorship and coaching",
      "Access to economic opportunities",
    ],
    outcome:
      "By strengthening practical skills and knowledge, we help young people move toward greater economic participation and independence.",
    icon: Users,
  },
  {
    slug: "community-development-volunteerism",
    title: "Community Development & Volunteerism",
    tagline:
      "We promote youth participation in activities that respond to community needs and strengthen social connections.",
    description:
      "Young people are encouraged to identify challenges within their communities, work together, and take part in practical initiatives that create positive local impact.",
    keyAreas: [
      "Community service",
      "Youth volunteerism",
      "Community-led initiatives",
      "Environmental activities",
      "Awareness campaigns",
      "Community engagement",
      "Youth-led projects",
      "Collaboration with local organizations",
      "Social responsibility",
    ],
    outcome:
      "Our approach recognizes young people as active contributors to their communities. Through volunteerism and community initiatives, youth gain practical experience while supporting local development.",
    icon: Building2,
  },
  {
    slug: "preventing-violent-extremism-pcve",
    title: "Preventing Violent Extremism (PCVE)",
    tagline:
      "We work with young people and communities to strengthen resilience against violent extremism and promote peaceful, inclusive communities.",
    description:
      "Our PCVE programs focus on prevention, awareness, dialogue, social cohesion, and positive youth engagement.",
    keyAreas: [
      "Youth engagement in peacebuilding",
      "Prevention awareness",
      "Community dialogue",
      "Social cohesion",
      "Countering harmful narratives",
      "Conflict prevention",
      "Peace education",
      "Community resilience",
      "Youth participation in peace and security",
    ],
    outcome:
      "We create safe spaces for dialogue and collaboration where young people can discuss community challenges, promote peaceful solutions, and contribute to stronger and more resilient communities.",
    icon: ShieldAlert,
  },
  {
    slug: "psychosocial-support-mhpss",
    title: "Psychosocial Support (MHPSS)",
    tagline:
      "We support the mental and social wellbeing of young people through activities that promote safe, supportive, and inclusive environments.",
    description:
      "Our psychosocial support programs recognize the importance of wellbeing in helping young people participate in education, employment, leadership, community activities, and peacebuilding.",
    keyAreas: [
      "Psychosocial awareness",
      "Peer support",
      "Safe spaces",
      "Stress management",
      "Social connection",
      "Resilience building",
      "Referral and support networks",
      "Community-based wellbeing activities",
      "Capacity building for youth workers",
    ],
    outcome:
      "We work to strengthen supportive environments where young people feel respected, connected, and able to participate positively in their communities.",
    icon: HeartHandshake,
  },
];
