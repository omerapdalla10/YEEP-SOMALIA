export const LOCALES = ["en", "so"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "yeep_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  so: "Soomaali",
};

/**
 * UI-chrome translations. Content authored in the admin (programs, news, …)
 * stays in whatever language it was written in — this only covers the shell.
 * A missing key falls back to the English string, then to the key itself.
 */
type Dict = Record<string, string>;

const en: Dict = {
  // nav
  "nav.home": "Home",
  "nav.about": "About",
  "nav.ourWork": "Our Work",
  "nav.programs": "Programs",
  "nav.projects": "Projects",
  "nav.events": "Events",
  "nav.gallery": "Gallery",
  "nav.news": "News",
  "nav.volunteer": "Volunteer",
  "nav.contact": "Contact",
  "nav.search": "Search",
  "nav.signIn": "Sign In",
  "nav.signUp": "Sign Up",
  "nav.myDashboard": "My Dashboard",
  "nav.adminConsole": "Admin Console",
  "nav.signOut": "Sign Out",

  // common
  "common.learnMore": "Learn More",
  "common.viewAll": "View All",
  "common.getInvolved": "Get Involved",
  "common.becomeVolunteer": "Become a Volunteer",
  "common.registerNow": "Register Now",
  "common.contactUs": "Contact Us",
  "common.backToHome": "Back to home",
  "common.subscribe": "Subscribe",

  // home
  "home.badge": "Youth, Peace & Security — led by young Somalis",
  "home.heroLine1": "Engage. Empower.",
  "home.heroLine2": "Transform.",
  "home.heroDesc":
    "YEEP Somalia is a youth-led NGO advancing Youth, Peace and Security (YPS), youth leadership, civic engagement, and community resilience across Somalia.",
  "home.watchStory": "Watch Our Story",
  "home.whatWeDo": "What We Do",
  "home.featuredPrograms": "Featured Programs",
  "home.viewAllPrograms": "View All Programs",
  "home.ourImpact": "Our Impact",
  "home.calendar": "Calendar",
  "home.upcomingEvents": "Upcoming Events",
  "home.allEvents": "All Events",
  "home.testimonials": "Testimonials",
  "home.successStories": "Success Stories",
  "home.trustedBy": "Trusted by Leading Organizations",
  "home.newsletterTitle": "Stay Connected with YEEP Somalia",
  "home.newsletterDesc":
    "Get the latest news, program updates, and impact stories delivered to your inbox.",
  "home.emailPlaceholder": "Enter your email address",
  "home.volunteerToday": "Volunteer Today",

  // footer
  "footer.tagline": "Engage. Empower. Transform.",
  "footer.quickLinks": "Quick Links",
  "footer.getInvolved": "Get Involved",
  "footer.contactUs": "Contact Us",
  "footer.newsletter": "Newsletter",
  "footer.emailPlaceholder": "Your email",
  "footer.thanks": "Thanks for subscribing!",
  "footer.rights":
    "© 2026 YEEP Somalia — Youth Engagement and Empowerment Programme. All rights reserved.",
  "footer.madeWith": "Made with",
  "footer.byYoungSomalis": "by young Somalis",

  // chat
  "chat.whatsapp": "Chat with us",
};

const so: Dict = {
  // nav
  "nav.home": "Bogga Hore",
  "nav.about": "Ku Saabsan",
  "nav.ourWork": "Shaqadeena",
  "nav.programs": "Barnaamijyada",
  "nav.projects": "Mashaariicda",
  "nav.events": "Munaasabadaha",
  "nav.gallery": "Sawirada",
  "nav.news": "Wararka",
  "nav.volunteer": "Iskaa Wax U Qabso",
  "nav.contact": "Nala Soo Xiriir",
  "nav.search": "Raadi",
  "nav.signIn": "Gal",
  "nav.signUp": "Isdiiwaangeli",
  "nav.myDashboard": "Dashboard-kayga",
  "nav.adminConsole": "Maamulka",
  "nav.signOut": "Ka Bax",

  // common
  "common.learnMore": "Wax Badan Baro",
  "common.viewAll": "Dhammaan Arag",
  "common.getInvolved": "Ka Qeyb Qaado",
  "common.becomeVolunteer": "Noqo Mutadawac",
  "common.registerNow": "Hadda Isqor",
  "common.contactUs": "Nala Soo Xiriir",
  "common.backToHome": "Ku Noqo Bogga Hore",
  "common.subscribe": "Isdiiwaangeli",

  // home
  "home.badge": "Dhalinyarada, Nabadda & Amniga — hoggaan dhalinyaro Soomaali",
  "home.heroLine1": "Ka Qeyb Qaado. Awood-siin.",
  "home.heroLine2": "Isbeddel.",
  "home.heroDesc":
    "YEEP Somalia waa urur aan faa'iido doon ahayn oo ay hoggaamiyaan dhalinyaradu, kaas oo kobcinaya Dhalinyarada, Nabadda iyo Amniga (YPS), hoggaanka dhalinyarada, ka-qeyb-galka bulshada, iyo adkeysiga bulshada Soomaaliya oo dhan.",
  "home.watchStory": "Daawo Sheekadeena",
  "home.whatWeDo": "Waxaan Qabano",
  "home.featuredPrograms": "Barnaamijyada Muhiimka ah",
  "home.viewAllPrograms": "Dhammaan Barnaamijyada Arag",
  "home.ourImpact": "Saameyntayada",
  "home.calendar": "Jadwalka",
  "home.upcomingEvents": "Munaasabadaha Soo Socda",
  "home.allEvents": "Dhammaan Munaasabadaha",
  "home.testimonials": "Marag-kacallo",
  "home.successStories": "Sheekooyin Guul",
  "home.trustedBy": "Waxaa Aaminay Ururo Hormuud ah",
  "home.newsletterTitle": "La Xiriir YEEP Somalia",
  "home.newsletterDesc":
    "Hel wararkii ugu dambeeyay, cusbooneysiinta barnaamijyada, iyo sheekooyinka saameynta oo si toos ah loogugu soo diro emailkaaga.",
  "home.emailPlaceholder": "Geli ciwaanka emailkaaga",
  "home.volunteerToday": "Maanta Iskaa Wax U Qabso",

  // footer
  "footer.tagline": "Ka Qeyb Qaado. Awood-siin. Isbeddel.",
  "footer.quickLinks": "Xiriiriyaha Degdegga",
  "footer.getInvolved": "Ka Qeyb Qaado",
  "footer.contactUs": "Nala Soo Xiriir",
  "footer.newsletter": "War-side",
  "footer.emailPlaceholder": "Emailkaaga",
  "footer.thanks": "Waad ku mahadsan tahay isdiiwaangelinta!",
  "footer.rights":
    "© 2026 YEEP Somalia — Barnaamijka Ka-qeyb-galka iyo Awood-siinta Dhalinyarada. Dhammaan xuquuqda way dhowran tahay.",
  "footer.madeWith": "Waxaa sameeyay",
  "footer.byYoungSomalis": "dhalinyaro Soomaali ah",

  // chat
  "chat.whatsapp": "Nala sheekayso",
};

export const MESSAGES: Record<Locale, Dict> = { en, so };

export function translate(locale: Locale, key: string): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
}
