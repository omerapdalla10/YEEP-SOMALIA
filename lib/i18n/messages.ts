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
  "common.viewDetails": "View Details",

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
  "home.exploreProgram": "Explore Programs",
  "home.missionQuote":
    "YEEP Somalia is a national initiative designed to strengthen youth leadership in peacebuilding and prevent violent extremism.",
  "home.getStarted": "Get Started",
  "home.howTitle": "Three Ways to Get Involved",
  "home.howDesc":
    "Whether you have an hour or a career to give, there is a place for you at YEEP Somalia.",
  "home.wayVolunteerTitle": "Volunteer",
  "home.wayVolunteerDesc":
    "Join community dialogues, mentor peers, and support events on the ground.",
  "home.wayTrainTitle": "Join a Program",
  "home.wayTrainDesc":
    "Build leadership, peacebuilding and civic skills through our training tracks.",
  "home.wayPartnerTitle": "Partner With Us",
  "home.wayPartnerDesc":
    "For government bodies and civil society organisations working on YPS goals.",
  "home.newsKicker": "Newsroom",
  "home.latestNews": "Latest News",
  "home.allNews": "All News",
  "home.galleryKicker": "Gallery",
  "home.galleryTitle": "Moments From the Field",
  "home.viewGallery": "View full gallery",
  "home.faqKicker": "Questions",
  "home.faqTitle": "Frequently Asked Questions",
  "home.faq1Q": "Who can join YEEP Somalia?",
  "home.faq1A":
    "Any young person in Somalia aged 15 to 35 who wants to contribute to peace and community development. No prior experience is needed.",
  "home.faq2Q": "Is volunteering paid?",
  "home.faq2A":
    "Volunteering is unpaid, but we cover transport and meal costs for activities and provide certificates and training.",
  "home.faq3Q": "How do I register for an event?",
  "home.faq3A":
    "Create a free account, open the event you are interested in, and click Register. You will get a confirmation email with the details.",
  "home.faq4Q": "How can my organisation partner with you?",
  "home.faq4A":
    "Reach out through our contact page. We work with government institutions, schools and civil society on Youth, Peace and Security.",

  // about
  "about.metaDesc":
    "YEEP Somalia is a youth-led NGO in Mogadishu strengthening youth leadership in peacebuilding and preventing violent extremism across Somalia.",
  "about.badge": "About Us",
  "about.heroTitle": "Our Story, Mission & Vision",
  "about.heroDesc":
    "YEEP Somalia is a youth-led NGO in Mogadishu, strengthening youth leadership in peacebuilding and preventing violent extremism across Somalia.",
  "about.whoKicker": "Who We Are",
  "about.whoTitle": "A Youth-Led Movement for Peace",
  "about.statFounded": "Founded",
  "about.statBase": "Base",
  "about.statFocus": "Focus",
  "about.statPartners": "Partners",
  "about.visionTitle": "Our Vision",
  "about.missionTitle": "Our Mission",
  "about.objectivesTitle": "Strategic Objectives",
  "about.valuesKicker": "What Drives Us",
  "about.valuesTitle": "Core Values",
  "about.approachKicker": "How We Work",
  "about.approachTitle": "Our Approach to Change",
  "about.approachDesc":
    "Lasting peace is built step by step — with young people leading at every stage.",
  "about.approach1Title": "Train",
  "about.approach1Desc": "Equip young Somalis with leadership, peacebuilding and civic skills.",
  "about.approach2Title": "Engage",
  "about.approach2Desc":
    "Open safe spaces where youth, elders and authorities solve problems together.",
  "about.approach3Title": "Advocate",
  "about.approach3Desc": "Carry youth priorities into peace and security policy at every level.",
  "about.approach4Title": "Sustain",
  "about.approach4Desc":
    "Back youth-led initiatives and partnerships so change outlasts any single project.",
  "about.whereKicker": "Our Reach",
  "about.whereTitle": "Where We Work",
  "about.whereDesc":
    "Headquartered in Mogadishu, we deliver programmes across Banadir and several federal member states.",
  "about.timelineKicker": "Our Journey",
  "about.timelineTitle": "Timeline of Achievements",
  "about.teamKicker": "The People",
  "about.teamTitle": "Meet the Leadership Team",
  "about.readBio": "Read bio",
  "about.governanceKicker": "Governance",
  "about.governanceTitle": "How We Are Run",
  "about.governanceDesc":
    "YEEP Somalia is governed by a volunteer board and run day to day by a young executive team, with a clear separation between oversight and delivery.",
  "about.govBoardTitle": "Board of Directors",
  "about.govBoardDesc":
    "Sets strategy, approves budgets, and holds the organisation accountable to its mission.",
  "about.govStaffTitle": "Executive Team",
  "about.govStaffDesc":
    "Leads programmes, partnerships and operations, and reports to the board.",
  "about.govAccountTitle": "Accountability",
  "about.govAccountDesc":
    "We keep financial records and safeguarding policies, and report on results to our partners and the communities we serve.",
  "about.reportsKicker": "Transparency",
  "about.reportsTitle": "Reports & Resources",
  "about.reportsDesc":
    "Our annual reports, strategy and key policies — free to download.",
  "about.download": "Download",
  "about.partnersKicker": "Collaboration",
  "about.partnersTitle": "Our Partners",
  "about.partnersDesc":
    "We work alongside government institutions and civil society organisations advancing Youth, Peace and Security.",
  "about.letterKicker": "A Word From Us",
  "about.letterTitle": "Why This Work Matters",
  "about.letterP1":
    "More than 70% of Somalis are under 30. Young people carry the heaviest cost of conflict — and hold the clearest path out of it.",
  "about.letterP2":
    "YEEP Somalia exists so that young Somalis are in the room where decisions about peace are made — not waiting outside it. Every training, dialogue and partnership is a step toward that.",
  "about.letterSign": "— YEEP Somalia Leadership",
  "about.ctaTitle": "Join Our Mission",
  "about.ctaDesc":
    "Whether you volunteer or partner with us — every action creates ripples of change.",
  "about.ctaPartner": "Partner With Us",

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
  "common.viewDetails": "Faahfaahin",

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
  "home.exploreProgram": "Barnaamijyada Fiiri",
  "home.missionQuote":
    "YEEP Somalia waa hindise qaran oo loogu talagalay xoojinta hoggaanka dhalinyarada ee dhismaha nabadda iyo ka hortagga argagixisada.",
  "home.getStarted": "Bilow",
  "home.howTitle": "Saddex Sida oo aad uga Qeyb Qaadan Karto",
  "home.howDesc":
    "Hadaad haysato saacad ama xirfad aad bixiso, meel baa YEEP Somalia kuugu jirta.",
  "home.wayVolunteerTitle": "Iskaa Wax U Qabso",
  "home.wayVolunteerDesc":
    "Ka qeyb qaado wada-hadallada bulshada, la-tali asxaabta, kana taageer munaasabadaha goobta.",
  "home.wayTrainTitle": "Ku Biir Barnaamij",
  "home.wayTrainDesc":
    "Dhis xirfadaha hoggaaminta, nabad-dhiska iyo bulsho-galka adigoo maraya tababarradayada.",
  "home.wayPartnerTitle": "Nala Shaqee",
  "home.wayPartnerDesc":
    "Hay'adaha dowladda iyo ururrada bulshada rayidka ee ka shaqeeya yoolalka YPS.",
  "home.newsKicker": "Qolka Wararka",
  "home.latestNews": "Wararka Ugu Dambeeyay",
  "home.allNews": "Dhammaan Wararka",
  "home.galleryKicker": "Sawirro",
  "home.galleryTitle": "Daqiiqado Goobta laga Qaaday",
  "home.viewGallery": "Fiiri sawir-gacmeedka oo dhan",
  "home.faqKicker": "Su'aalo",
  "home.faqTitle": "Su'aalaha Inta Badan La Weydiiyo",
  "home.faq1Q": "Yaa ku biiri kara YEEP Somalia?",
  "home.faq1A":
    "Qof kasta oo dhalinyaro ah oo Soomaaliya jooga, da'da 15 ilaa 35, oo raba inuu wax ku daro nabadda iyo horumarka bulshada. Waayo-aragnimo hore looma baahna.",
  "home.faq2Q": "Ma lacag baa la siiyaa iskaa-wax-u-qabsiga?",
  "home.faq2A":
    "Iskaa-wax-u-qabso lacag ma leh, laakiin waxaan daboolnaa kharashka gaadiidka iyo cuntada howlaha, waxaana ku siinaa shahaado iyo tababar.",
  "home.faq3Q": "Sideen isugu diiwaan geliyaa munaasabad?",
  "home.faq3A":
    "Samee akoon bilaash ah, fur munaasabadda aad xiisaynayso, kadibna riix Isqor. Waxaad heli doontaa email xaqiijin ah oo faahfaahsan.",
  "home.faq4Q": "Sidee ururkaygu idinla shaqeyn karaa?",
  "home.faq4A":
    "Nagala soo xiriir bogga xiriirka. Waxaan la shaqeynaa hay'adaha dowladda, dugsiyada iyo bulshada rayidka arrimaha Dhalinyarada, Nabadda iyo Amniga.",

  // about
  "about.metaDesc":
    "YEEP Somalia waa urur aan dawli ahayn oo dhalinyaro hoggaamiyaan, fadhigiisu Muqdisho yahay, kaasoo xoojiya hoggaanka dhalinyarada ee nabad-dhiska iyo ka hortagga argagixisada Soomaaliya oo dhan.",
  "about.badge": "Nagu Saabsan",
  "about.heroTitle": "Sheekadeena, Hadafkeena & Aragtideena",
  "about.heroDesc":
    "YEEP Somalia waa urur aan dawli ahayn oo dhalinyaro hoggaamiyaan oo Muqdisho fadhi ku leh, kaasoo xoojiya hoggaanka dhalinyarada nabad-dhiska kana hortagga argagixisada Soomaaliya oo dhan.",
  "about.whoKicker": "Yaan Nahay",
  "about.whoTitle": "Dhaqdhaqaaq Dhalinyaro Hoggaamiyaan oo Nabad Doon ah",
  "about.statFounded": "La Aasaasay",
  "about.statBase": "Fadhi",
  "about.statFocus": "Diirad",
  "about.statPartners": "Shuraako",
  "about.visionTitle": "Aragtideena",
  "about.missionTitle": "Hadafkeena",
  "about.objectivesTitle": "Yoolalka Istiraatijiga ah",
  "about.valuesKicker": "Waxa Na Dhaqaajiya",
  "about.valuesTitle": "Qiyamkeena Aasaasiga ah",
  "about.approachKicker": "Sida Aan U Shaqeyno",
  "about.approachTitle": "Habkeena Isbeddelka",
  "about.approachDesc":
    "Nabad waarta waxaa la dhisaa tallaabo tallaabo — iyadoo dhalinyaradu hoggaaminayaan marxalad kasta.",
  "about.approach1Title": "Tababar",
  "about.approach1Desc":
    "U qalabee dhalinyarada Soomaaliyeed xirfadaha hoggaaminta, nabad-dhiska iyo bulsho-galka.",
  "about.approach2Title": "Ka-qeyb-gelin",
  "about.approach2Desc":
    "Fur meelo ammaan ah oo dhalinyarada, odayaasha iyo maamulku ay wadajir wax uga xalliyaan.",
  "about.approach3Title": "U-doodid",
  "about.approach3Desc":
    "Gee mudnaantaha dhalinyarada siyaasadda nabadda iyo amniga heer kasta.",
  "about.approach4Title": "Sii-wadid",
  "about.approach4Desc":
    "Taageer hindisayaal iyo iskaashiyo dhalinyaro hoggaamiyaan si isbeddelku uga sii jiro mashruuc kasta.",
  "about.whereKicker": "Baaxadeena",
  "about.whereTitle": "Meelaha Aan Ka Shaqeyno",
  "about.whereDesc":
    "Xaruntayadu waa Muqdisho, waxaanan barnaamijyo ka fulinnaa Banaadir iyo dhowr dowlad-goboleed.",
  "about.timelineKicker": "Safarkeena",
  "about.timelineTitle": "Jadwalka Guulaha",
  "about.teamKicker": "Dadka",
  "about.teamTitle": "La Kulan Kooxda Hoggaanka",
  "about.readBio": "Akhri taariikh-nololeed",
  "about.governanceKicker": "Maamulka",
  "about.governanceTitle": "Sida Loo Maamulo",
  "about.governanceDesc":
    "YEEP Somalia waxaa maamula guddi mutadawiciin ah, maalin kastana waxaa wada koox fulineed oo dhalinyaro ah, iyadoo si cad loo kala saaray kormeerka iyo fulinta.",
  "about.govBoardTitle": "Guddiga Agaasimayaasha",
  "about.govBoardDesc":
    "Wuxuu dejiyaa istiraatijiyada, ansixiyaa miisaaniyadaha, isla xisaabtanna uga dhigaa ururka hadafkiisa.",
  "about.govStaffTitle": "Kooxda Fulinta",
  "about.govStaffDesc":
    "Waxay hoggaamisaa barnaamijyada, iskaashiga iyo hawlgallada, waxayna warbixin u gudbisaa guddiga.",
  "about.govAccountTitle": "Isla-xisaabtan",
  "about.govAccountDesc":
    "Waxaan haynaa diiwaanno maaliyadeed iyo siyaasado ilaalin, waxaanan warbixin ka bixinnaa natiijooyinka shuraakada iyo bulshada aan u adeegno.",
  "about.reportsKicker": "Hufnaan",
  "about.reportsTitle": "Warbixinno & Kheyraad",
  "about.reportsDesc":
    "Warbixinnadayada sannadlaha ah, istiraatijiyada iyo siyaasadaha muhiimka ah — bilaash u soo dejiso.",
  "about.download": "Soo deji",
  "about.partnersKicker": "Iskaashi",
  "about.partnersTitle": "Shuraakadeena",
  "about.partnersDesc":
    "Waxaan la shaqeynaa hay'ado dowladeed iyo ururro bulsho rayid ah oo horumariya Dhalinyarada, Nabadda iyo Amniga.",
  "about.letterKicker": "Eray Naga Yimid",
  "about.letterTitle": "Sababta Shaqadani u Muhiim tahay",
  "about.letterP1":
    "In ka badan 70% Soomaalida waa ka yar 30 jir. Dhalinyaradu waxay qaadaan qarashka ugu culus ee colaadda — waxayna hayaan jidka ugu cad ee laga baxo.",
  "about.letterP2":
    "YEEP Somalia waxay u jirtaa in dhalinyarada Soomaaliyeed ay ku jiraan qolka lagu go'aamiyo nabadda — ee aysan dibadda ku sugin. Tababar, wada-hadal iyo iskaashi kastaa waa tallaabo xagaas u socota.",
  "about.letterSign": "— Hoggaanka YEEP Somalia",
  "about.ctaTitle": "Ku Biir Hadafkeena",
  "about.ctaDesc":
    "Hadaad iskaa wax u qabato ama aad nala shaqeyso — falkastaa wuxuu abuuraa mowjado isbeddel ah.",
  "about.ctaPartner": "Nala Shaqee",

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
