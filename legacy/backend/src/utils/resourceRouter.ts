import { Router, type RequestHandler } from 'express'
import type { Model } from 'mongoose'
import { crudController } from './crudController'
import { protect, authorize } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { ZodObject, ZodType } from 'zod'
import type { Role } from '../config/roles'

interface ResourceOptions<T> {
  filterable?: (keyof T & string)[]
  searchable?: (keyof T & string)[]
  defaultSort?: string
  /** Zod schema for create/update request bodies. */
  bodySchema?: ZodType
  /** 'public' (default) allows anyone to read; 'staff' locks reads down too. */
  readAccess?: 'public' | 'staff'
  /** Minimum role for create/update/delete. Default: staff (and admin). */
  writeRoles?: Role[]
}

/**
 * Standard REST resource:
 *   GET    /            list (paginated, filterable, searchable)
 *   GET    /:id         read one
 *   POST   /            create   (auth + writeRoles)
 *   PATCH  /:id         update   (auth + writeRoles)
 *   DELETE /:id         delete   (auth + writeRoles)
 */
export function resourceRouter<T>(model: Model<T>, options: ResourceOptions<T> = {}): Router {
  const { bodySchema, readAccess = 'public', writeRoles = ['staff'] } = options
  const ctrl = crudController(model, options)
  const router = Router()

  const readGuards: RequestHandler[] =
    readAccess === 'staff' ? [protect, authorize(...writeRoles)] : []
  const writeGuards: RequestHandler[] = [protect, authorize(...writeRoles)]
  const createGuard: RequestHandler[] = bodySchema ? [validate({ body: bodySchema })] : []
  const updateSchema = bodySchema instanceof ZodObject ? bodySchema.partial() : bodySchema
  const updateGuard: RequestHandler[] = updateSchema ? [validate({ body: updateSchema })] : []

  router.get('/', ...readGuards, ctrl.list)
  router.get('/:id', ...readGuards, ctrl.getOne)
  router.post('/', ...writeGuards, ...createGuard, ctrl.create)
  router.patch('/:id', ...writeGuards, ...updateGuard, ctrl.update)
  router.delete('/:id', ...writeGuards, ctrl.remove)

  return router
}
