import { Router } from 'express'
import * as c from '../controllers/contact.controller'
import { protect, requireStaff } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { contactMessageSchema, contactStatusSchema } from '../validators'

const router = Router()

router.post('/', validate({ body: contactMessageSchema }), c.submitMessage)

router.use(protect, requireStaff)
router.get('/', c.listMessages)
router.get('/:id', c.getMessage)
router.patch('/:id/status', validate({ body: contactStatusSchema }), c.updateMessageStatus)
router.delete('/:id', c.deleteMessage)

export default router
