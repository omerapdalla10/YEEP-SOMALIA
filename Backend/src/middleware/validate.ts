import type { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

interface Schemas {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

/** Validates and replaces req.body/query/params with the parsed result. */
export const validate =
  (schemas: Schemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body)
      if (schemas.query) Object.assign(req.query, schemas.query.parse(req.query))
      if (schemas.params) Object.assign(req.params, schemas.params.parse(req.params))
      next()
    } catch (err) {
      next(err)
    }
  }
