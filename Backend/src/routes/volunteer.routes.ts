import { Router } from 'express'
import * as v from '../controllers/volunteer.controller'
import { protect, requireStaff } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { optionalAuth } from '../middleware/optionalAuth'
import { volunteerApplicationSchema, volunteerStatusSchema } from '../validators'

const router = Router()

// Public / member submission
router.post(
  '/apply',
  optionalAuth,
  validate({ body: volunteerApplicationSchema }),
  v.submitApplication,
)

// Member's own applications
router.get('/me', protect, v.myApplications)

// Staff management
router.get('/', protect, requireStaff, v.listApplications)
router.get('/:id', protect, requireStaff, v.getApplication)
router.patch(
  '/:id/status',
  protect,
  requireStaff,
  validate({ body: volunteerStatusSchema }),
  v.updateApplicationStatus,
)
router.delete('/:id', protect, requireStaff, v.deleteApplication)

export default router
