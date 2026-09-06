import { Router } from 'express'
import { siteStats } from '../controllers/stats.controller'
import * as newsletter from '../controllers/newsletter.controller'
import { protect, requireStaff } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { newsletterSchema } from '../validators'

const router = Router()

router.get('/stats', siteStats)

router.post('/newsletter', validate({ body: newsletterSchema }), newsletter.subscribe)
router.get('/newsletter', protect, requireStaff, newsletter.listSubscribers)
router.delete('/newsletter/:id', protect, requireStaff, newsletter.deleteSubscriber)

export default router
