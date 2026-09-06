import { Router } from 'express'
import * as users from '../controllers/user.controller'
import { protect, requireAdmin } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { adminCreateUserSchema, adminUpdateUserSchema } from '../validators'

const router = Router()

// Every route here is admin-only.
router.use(protect, requireAdmin)

router.get('/', users.listUsers)
router.post('/', validate({ body: adminCreateUserSchema }), users.createUser)
router.get('/:id', users.getUser)
router.patch('/:id', validate({ body: adminUpdateUserSchema }), users.updateUser)
router.delete('/:id', users.deleteUser)

export default router
