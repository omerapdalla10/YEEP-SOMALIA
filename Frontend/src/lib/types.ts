export interface Program {
  _id: string
  title: string
  slug: string
  summary?: string
  description?: string
  category: string
  status: 'Active' | 'Enrolling' | 'Completed' | 'Paused'
  image?: string
  beneficiaries: number
  progress: number
  duration?: string
  region?: string
  district?: string
  featured: boolean
}

export interface Project {
  _id: string
  title: string
  slug: string
  description?: string
  status: 'Ongoing' | 'Completed' | 'Planned'
  category?: string
  location?: string
  region?: string
  district?: string
  image?: string
  startDate?: string
  endDate?: string
  budget: number
  raised: number
  beneficiaries: number
  progress: number
  fundedBy?: string
  partners?: string
  featured: boolean
}

export interface EventItem {
  _id: string
  title: string
  slug: string
  description?: string
  startDate: string
  endDate?: string
  dateLabel?: string
  timeLabel?: string
  month?: string
  location?: string
  region?: string
  type: 'Conference' | 'Community' | 'Fundraiser' | 'Workshop' | 'Forum' | 'Networking'
  image?: string
  capacity: number
  registered: number
  registrationDeadline?: string
  featured: boolean
  published: boolean
}

export interface Article {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  category: string
  image?: string
  author?: string
  readTime?: string
  tags: string[]
  featured: boolean
  published: boolean
  publishedAt?: string
  views: number
}

export interface GalleryItem {
  _id: string
  type: 'image' | 'video'
  image: string
  videoUrl?: string
  category: 'Programs' | 'Events' | 'Community' | 'Volunteers'
  caption?: string
  span?: string
  order: number
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  image?: string
  bio?: string
  order: number
  active?: boolean
}

export interface Milestone {
  _id: string
  year: string
  event: string
  order: number
}

export interface Testimonial {
  _id: string
  name: string
  role?: string
  text: string
  image?: string
  rating: number
  placement: 'home' | 'volunteer'
  order: number
}

export interface Partner {
  _id: string
  name: string
  logo?: string
  website?: string
  order: number
}

export interface VolunteerRole {
  _id: string
  role: string
  commitment?: string
  location?: string
  skills?: string
  description?: string
  open: boolean
  order: number
}

export interface VolunteerApplication {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  availability?: string
  motivation?: string
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected'
  reviewNote?: string
  createdAt: string
}

export interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'New' | 'Read' | 'Replied' | 'Archived'
  createdAt: string
}

export interface AdminUser {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'volunteer' | 'staff' | 'admin'
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface SiteStats {
  youthEmpowered: number
  activePrograms: number
  communitiesReached: number
  fundsRaised: number
  volunteers: number
  partners: number
  foundedYear: number
}

export interface AdminDashboardData {
  kpis: {
    totalUsers: number
    activePrograms: number
    volunteerHours: number
    events: number
    activeVolunteers: number
    pendingApplications: number
    newMessages: number
    upcomingEvents: number
  }
  userGrowth: { month: string; users: number }[]
  programDist: { name: string; value: number; color: string }[]
  recentActivity: { text: string; time: string; type: string }[]
}

export interface MyDashboardData {
  profile: AdminUser
  applications: VolunteerApplication[]
  counts: { total: number; approved: number; pending: number; programsJoined: number }
  upcomingEvents: EventItem[]
}
