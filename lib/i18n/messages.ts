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
  "home.badge": "A registered youth-led organization",
  "home.heroLine1": "Engage. Empower.",
  "home.heroLine2": "Transform.",
  "home.heroDesc":
    "YEEP Somalia is a youth-led, non-governmental organization empowering Somali youth to lead, innovate, and build peaceful, inclusive, and resilient communities.",
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
    "Young people should not only be beneficiaries of change, but the driving force behind it.",
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
    "Any young Somali who wants to contribute to peace, leadership and community development. No prior experience is needed.",
  "home.faq2Q": "Is volunteering paid?",
  "home.faq2A":
    "Volunteering is unpaid, but we provide training, mentorship and certificates, and cover activity costs where possible.",
  "home.faq3Q": "How do I register for an event?",
  "home.faq3A":
    "Create a free account, open the event you are interested in, and click Register. You will get a confirmation email with the details.",
  "home.faq4Q": "How can my organisation partner with you?",
  "home.faq4A":
    "Reach out through our contact page. We work with governments, local organisations, international agencies and the private sector.",

  // about
  "about.metaDesc":
    "YEEP Somalia is a registered, youth-led NGO empowering Somali youth to lead, innovate, and build peaceful, inclusive and resilient communities.",
  "about.badge": "About Us",
  "about.heroTitle": "Our Story, Mission & Vision",
  "about.heroDesc":
    "YEEP Somalia is a registered, youth-led NGO empowering Somali youth to lead, innovate, and build peaceful, inclusive and resilient communities.",
  "about.whoKicker": "Who We Are",
  "about.whoTitle": "A Youth-Led Movement for Peace",
  "about.statFounded": "Type",
  "about.statBase": "Base",
  "about.statFocus": "Focus",
  "about.statPartners": "Team",
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
    "Based in Mogadishu, Somalia, working with and for young people through partnerships with governments, local organisations, international agencies and the private sector.",
  "about.timelineKicker": "Our Journey",
  "about.timelineTitle": "Timeline of Achievements",
  "about.teamKicker": "The People",
  "about.teamTitle": "Meet the Leadership Team",
  "about.readBio": "Read bio",
  "about.governanceKicker": "Governance",
  "about.governanceTitle": "How We Are Run",
  "about.governanceDesc":
    "YEEP Somalia is led by an Executive Director and a young executive team covering programmes, finance, grants, HR, MEAL and communications.",
  "about.govBoardTitle": "Executive Leadership",
  "about.govBoardDesc":
    "The Executive Director and Vice Executive Director set direction and represent the organisation.",
  "about.govStaffTitle": "Programme & Operations",
  "about.govStaffDesc":
    "Teams for programmes and partnerships, case management, grants, administration and finance.",
  "about.govAccountTitle": "Accountability",
  "about.govAccountDesc":
    "Dedicated MEAL and finance functions keep records and report on results to our partners and the communities we serve.",
  "about.reportsKicker": "Transparency",
  "about.reportsTitle": "Reports & Resources",
  "about.reportsDesc":
    "Our annual reports, strategy and key policies — free to download.",
  "about.download": "Download",
  "about.partnersKicker": "Collaboration",
  "about.partnersTitle": "Our Partners",
  "about.partnersDesc":
    "We work alongside governments, local organisations, international agencies and the private sector to expand opportunities for youth.",
  "about.letterKicker": "A Word From Us",
  "about.letterTitle": "Why This Work Matters",
  "about.letterP1":
    "While some UN and international organisations implement PCVE work, there was a gap in youth direct engagement. YEEP was created to bridge that gap.",
  "about.letterP2":
    "We give young people a platform to share experience, learn, and educate each other — because young people are the heartbeat of Somalia's future, and should have the tools, opportunities and voice to shape it.",
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
    "© 2026 YEEP Somalia — Youth Engagement and Empowerment Platform. All rights reserved.",
  "footer.madeWith": "Made with",
  "footer.byYoungSomalis": "by young Somalis",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",

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
  "home.badge": "Urur diiwaangashan oo dhalinyaro hoggaamiyaan",
  "home.heroLine1": "Ka Qeyb Qaado. Awood-siin.",
  "home.heroLine2": "Isbeddel.",
  "home.heroDesc":
    "YEEP Somalia waa urur aan dawli ahayn oo dhalinyaro hoggaamiyaan, kaas oo awood siiya dhalinyarada Soomaaliyeed inay hoggaamiyaan, hal-abuuraan, kana dhisaan bulsho nabad, loo dhan yahay oo adkeysi leh.",
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
    "Dhalinyaradu waa inaysan ahaan kaliya kuwa faa'iidaysta isbeddelka, ee waa inay noqdaan xoogga kaxeeya.",
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
    "Dhalinyaro Soomaali ah oo kasta oo raba inuu wax ku daro nabadda, hoggaanka iyo horumarka bulshada. Waayo-aragnimo hore looma baahna.",
  "home.faq2Q": "Ma lacag baa la siiyaa iskaa-wax-u-qabsiga?",
  "home.faq2A":
    "Iskaa-wax-u-qabso lacag ma leh, laakiin waxaan bixinnaa tababar, la-talin iyo shahaado, waxaana daboolnaa kharashka howlaha marka ay suurtogal tahay.",
  "home.faq3Q": "Sideen isugu diiwaan geliyaa munaasabad?",
  "home.faq3A":
    "Samee akoon bilaash ah, fur munaasabadda aad xiisaynayso, kadibna riix Isqor. Waxaad heli doontaa email xaqiijin ah oo faahfaahsan.",
  "home.faq4Q": "Sidee ururkaygu idinla shaqeyn karaa?",
  "home.faq4A":
    "Nagala soo xiriir bogga xiriirka. Waxaan la shaqeynaa dowladaha, ururrada maxalliga ah, hay'adaha caalamiga ah iyo qeybta gaarka loo leeyahay.",

  // about
  "about.metaDesc":
    "YEEP Somalia waa urur diiwaangashan oo dhalinyaro hoggaamiyaan, kaas oo awood siiya dhalinyarada Soomaaliyeed inay hoggaamiyaan, hal-abuuraan, kana dhisaan bulsho nabad iyo adkeysi leh.",
  "about.badge": "Nagu Saabsan",
  "about.heroTitle": "Sheekadeena, Hadafkeena & Aragtideena",
  "about.heroDesc":
    "YEEP Somalia waa urur diiwaangashan oo dhalinyaro hoggaamiyaan, kaas oo awood siiya dhalinyarada Soomaaliyeed inay hoggaamiyaan, hal-abuuraan, kana dhisaan bulsho nabad, loo dhan yahay oo adkeysi leh.",
  "about.whoKicker": "Yaan Nahay",
  "about.whoTitle": "Dhaqdhaqaaq Dhalinyaro Hoggaamiyaan oo Nabad Doon ah",
  "about.statFounded": "Nooca",
  "about.statBase": "Fadhi",
  "about.statFocus": "Diirad",
  "about.statPartners": "Kooxda",
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
    "Fadhigayagu waa Muqdisho, Soomaaliya. Waxaan la shaqeynaa dhalinyarada annagoo iskaashi la yeelanayna dowladaha, ururrada maxalliga ah, hay'adaha caalamiga ah iyo qeybta gaarka loo leeyahay.",
  "about.timelineKicker": "Safarkeena",
  "about.timelineTitle": "Jadwalka Guulaha",
  "about.teamKicker": "Dadka",
  "about.teamTitle": "La Kulan Kooxda Hoggaanka",
  "about.readBio": "Akhri taariikh-nololeed",
  "about.governanceKicker": "Maamulka",
  "about.governanceTitle": "Sida Loo Maamulo",
  "about.governanceDesc":
    "YEEP Somalia waxaa hoggaamiya Agaasime Fulineed iyo koox fulineed oo dhalinyaro ah oo daboolaya barnaamijyada, maaliyadda, deeqaha, shaqaalaha, MEAL iyo isgaarsiinta.",
  "about.govBoardTitle": "Hoggaanka Fulinta",
  "about.govBoardDesc":
    "Agaasimaha Fulineed iyo Ku-xigeenkiisu waxay dejiyaan jihada, ururkana matalaan.",
  "about.govStaffTitle": "Barnaamij & Hawlgal",
  "about.govStaffDesc":
    "Kooxo u qaabilsan barnaamijyada iyo iskaashiga, maareynta kiisaska, deeqaha, maamulka iyo maaliyadda.",
  "about.govAccountTitle": "Isla-xisaabtan",
  "about.govAccountDesc":
    "Qeybo gaar ah oo MEAL iyo maaliyad ah ayaa haya diiwaannada, warbixinna ka bixiya natiijooyinka shuraakada iyo bulshada aan u adeegno.",
  "about.reportsKicker": "Hufnaan",
  "about.reportsTitle": "Warbixinno & Kheyraad",
  "about.reportsDesc":
    "Warbixinnadayada sannadlaha ah, istiraatijiyada iyo siyaasadaha muhiimka ah — bilaash u soo dejiso.",
  "about.download": "Soo deji",
  "about.partnersKicker": "Iskaashi",
  "about.partnersTitle": "Shuraakadeena",
  "about.partnersDesc":
    "Waxaan la shaqeynaa dowladaha, ururrada maxalliga ah, hay'adaha caalamiga ah iyo qeybta gaarka loo leeyahay si aan u kordhinno fursadaha dhalinyarada.",
  "about.letterKicker": "Eray Naga Yimid",
  "about.letterTitle": "Sababta Shaqadani u Muhiim tahay",
  "about.letterP1":
    "In kasta oo qaar ka mid ah ururrada QM iyo kuwa caalamiga ah ay fuliyaan shaqada PCVE, waxaa jiray farqi ku aaddan ka-qeyb-galka tooska ah ee dhalinyarada. YEEP waxaa la abuuray si loo buuxiyo farqigaas.",
  "about.letterP2":
    "Waxaan dhalinyarada siinnaa goob ay ku wadaagaan waaya-aragnimo, wax ku bartaan, isna baraan — maxaa yeelay dhalinyaradu waa wadnaha mustaqbalka Soomaaliya, waana inay helaan qalabka, fursadaha iyo codka ay ku qaabeeyaan.",
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
    "© 2026 YEEP Somalia — Madasha Ka-qeyb-galka iyo Awood-siinta Dhalinyarada. Dhammaan xuquuqda way dhowran tahay.",
  "footer.madeWith": "Waxaa sameeyay",
  "footer.byYoungSomalis": "dhalinyaro Soomaali ah",
  "footer.privacy": "Asturnaanta",
  "footer.terms": "Shuruudaha",

  // chat
  "chat.whatsapp": "Nala sheekayso",
};

export const MESSAGES: Record<Locale, Dict> = { en, so };

export function translate(locale: Locale, key: string): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
}
