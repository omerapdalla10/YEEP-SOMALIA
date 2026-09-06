import { Router } from 'express'
import * as auth from '../controllers/auth.controller'
import { protect } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  registerSchema,
  loginSchema,
  updateMeSchema,
  changePasswordSchema,
} from '../validators'

const router = Router()

router.post('/register', validate({ body: registerSchema }), auth.register)
router.post('/login', validate({ body: loginSchema }), auth.login)

// Google OAuth (redirect flow)
router.get('/google', auth.googleStart)
router.get('/google/callback', auth.googleCallback)

router.get('/me', protect, auth.me)
router.patch('/me', protect, validate({ body: updateMeSchema }), auth.updateMe)
router.post('/change-password', protect, validate({ body: changePasswordSchema }), auth.changePassword)

export default router
