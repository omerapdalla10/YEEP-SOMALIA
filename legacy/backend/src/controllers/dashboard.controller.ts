import { asyncHandler } from '../utils/asyncHandler'
import { User } from '../models/User'
import { Program } from '../models/Program'
import { Project } from '../models/Project'
import { Event } from '../models/Event'
import { Article } from '../models/Article'
import { Volunteer } from '../models/Volunteer'
import { ContactMessage } from '../models/ContactMessage'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS = ['#0f766e', '#16a34a', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

/** GET /api/dashboard/admin — KPIs, charts and activity for the admin dashboard. */
export const adminStats = asyncHandler(async (_req, res) => {
  const now = new Date()

  const [
    totalUsers,
    activePrograms,
    totalEvents,
    activeVolunteers,
    pendingApplications,
    newMessages,
    upcomingEvents,
    volunteerHoursAgg,
    programByCategory,
    userGrowthAgg,
    recentApplication,
    recentArticle,
    recentProject,
    recentEvent,
  ] = await Promise.all([
    User.countDocuments(),
    Program.countDocuments({ status: { $in: ['Active', 'Enrolling'] } }),
    Event.countDocuments(),
    User.countDocuments({ role: 'volunteer', isActive: true }),
    Volunteer.countDocuments({ status: { $in: ['Pending', 'Under Review'] } }),
    ContactMessage.countDocuments({ status: 'New' }),
    Event.countDocuments({ startDate: { $gte: now } }),
    Volunteer.aggregate([{ $group: { _id: null, hours: { $sum: 48 } } }]),
    Program.aggregate([
      { $group: { _id: '$category', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]),
    User.aggregate([
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          value: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
    Volunteer.findOne().sort('-createdAt'),
    Article.findOne({ published: true }).sort('-publishedAt'),
    Project.findOne().sort('-updatedAt'),
    Event.findOne().sort('-createdAt'),
  ])

  // cumulative user growth by month
  let running = 0
  const userGrowth = userGrowthAgg.map((r: { _id: { m: number }; value: number }) => {
    running += r.value
    return { month: MONTHS[(r._id.m - 1) % 12], users: running }
  })

  const totalPrograms = programByCategory.reduce((s: number, r: { value: number }) => s + r.value, 0) || 1
  const programDist = programByCategory.map(
    (r: { _id: string; value: number }, i: number) => ({
      name: r._id || 'Uncategorised',
      value: Math.round((r.value / totalPrograms) * 100),
      color: PIE_COLORS[i % PIE_COLORS.length],
    }),
  )

  const activity: { text: string; time: string; type: string }[] = []
  if (recentApplication)
    activity.push({
      text: `New volunteer application from ${recentApplication.name}`,
      time: relativeTime(recentApplication.createdAt as Date),
      type: 'volunteer',
    })
  if (recentEvent)
    activity.push({
      text: `${recentEvent.title} — ${recentEvent.registered}/${recentEvent.capacity} registered`,
      time: relativeTime((recentEvent as { createdAt: Date }).createdAt),
      type: 'event',
    })
  if (recentArticle)
    activity.push({
      text: `Article published: ${recentArticle.title}`,
      time: relativeTime((recentArticle.publishedAt as Date) ?? (recentArticle as { createdAt: Date }).createdAt),
      type: 'news',
    })
  if (recentProject)
    activity.push({
      text: `${recentProject.title} progress at ${recentProject.progress}%`,
      time: relativeTime((recentProject as { updatedAt: Date }).updatedAt),
      type: 'project',
    })

  res.json({
    success: true,
    data: {
      kpis: {
        totalUsers,
        activePrograms,
        volunteerHours: volunteerHoursAgg[0]?.hours ?? 0,
        events: totalEvents,
        activeVolunteers,
        pendingApplications,
        newMessages,
        upcomingEvents,
      },
      userGrowth,
      programDist,
      recentActivity: activity,
    },
  })
})

/** GET /api/dashboard/me — summary for the logged-in member's dashboard. */
export const myStats = asyncHandler(async (req, res) => {
  const userId = req.user!.id
  const [applications, upcomingEvents] = await Promise.all([
    Volunteer.find({ user: userId }).sort('-createdAt'),
    Event.find({ startDate: { $gte: new Date() } })
      .sort('startDate')
      .limit(5),
  ])

  const approved = applications.filter((a) => a.status === 'Approved').length
  const pending = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review',
  ).length

  res.json({
    success: true,
    data: {
      profile: req.user,
      applications,
      counts: {
        total: applications.length,
        approved,
        pending,
        programsJoined: approved,
      },
      upcomingEvents,
    },
  })
})
