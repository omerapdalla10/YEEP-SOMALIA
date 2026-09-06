import { Router } from 'express'

import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import volunteerRoutes from './volunteer.routes'
import contactRoutes from './contact.routes'
import dashboardRoutes from './dashboard.routes'
import miscRoutes from './misc.routes'

import { resourceRouter } from '../utils/resourceRouter'
import { Program } from '../models/Program'
import { Project } from '../models/Project'
import { Event } from '../models/Event'
import { Article } from '../models/Article'
import { GalleryItem } from '../models/GalleryItem'
import { TeamMember } from '../models/TeamMember'
import { Milestone } from '../models/Milestone'
import { Testimonial } from '../models/Testimonial'
import { Partner } from '../models/Partner'
import { VolunteerRole } from '../models/VolunteerRole'
import {
  programSchema,
  projectSchema,
  eventSchema,
  articleSchema,
  gallerySchema,
  teamMemberSchema,
  milestoneSchema,
  testimonialSchema,
  partnerSchema,
  volunteerRoleSchema,
} from '../validators'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() })
})

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/volunteers', volunteerRoutes)
router.use('/contact', contactRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/', miscRoutes)

router.use(
  '/programs',
  resourceRouter(Program, {
    bodySchema: programSchema,
    filterable: ['category', 'status', 'featured', 'region'],
    searchable: ['title', 'summary', 'description'],
  }),
)

router.use(
  '/projects',
  resourceRouter(Project, {
    bodySchema: projectSchema,
    filterable: ['status', 'category', 'featured', 'region'],
    searchable: ['title', 'description', 'location'],
  }),
)

router.use(
  '/events',
  resourceRouter(Event, {
    bodySchema: eventSchema,
    filterable: ['type', 'published', 'featured', 'month', 'region'],
    searchable: ['title', 'description', 'location'],
    defaultSort: 'startDate',
  }),
)

router.use(
  '/news',
  resourceRouter(Article, {
    bodySchema: articleSchema,
    filterable: ['category', 'published', 'featured'],
    searchable: ['title', 'excerpt', 'content'],
    defaultSort: '-publishedAt',
  }),
)

router.use(
  '/gallery',
  resourceRouter(GalleryItem, {
    bodySchema: gallerySchema,
    filterable: ['category', 'type'],
    searchable: ['caption'],
    defaultSort: 'order',
  }),
)

router.use(
  '/team',
  resourceRouter(TeamMember, {
    bodySchema: teamMemberSchema,
    filterable: ['active'],
    searchable: ['name', 'role'],
    defaultSort: 'order',
  }),
)

router.use(
  '/milestones',
  resourceRouter(Milestone, {
    bodySchema: milestoneSchema,
    searchable: ['year', 'event'],
    defaultSort: 'order',
  }),
)

router.use(
  '/testimonials',
  resourceRouter(Testimonial, {
    bodySchema: testimonialSchema,
    filterable: ['placement'],
    searchable: ['name', 'text'],
    defaultSort: 'order',
  }),
)

router.use(
  '/partners',
  resourceRouter(Partner, {
    bodySchema: partnerSchema,
    searchable: ['name'],
    defaultSort: 'order',
  }),
)

router.use(
  '/volunteer-roles',
  resourceRouter(VolunteerRole, {
    bodySchema: volunteerRoleSchema,
    filterable: ['open'],
    searchable: ['role', 'skills'],
    defaultSort: 'order',
  }),
)

export default router
