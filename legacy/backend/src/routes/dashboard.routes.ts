import { Router } from 'express'
import * as dashboard from '../controllers/dashboard.controller'
import { protect, requireStaff } from '../middleware/auth'

const router = Router()

router.get('/admin', protect, requireStaff, dashboard.adminStats)
router.get('/me', protect, dashboard.myStats)

export default router
