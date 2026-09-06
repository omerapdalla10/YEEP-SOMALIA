import type { Request, Response, NextFunction } from 'express'
import { MongoServerError } from 'mongodb'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'
import { ApiError } from '../utils/ApiError'
import { formatZodError, humanizeField } from '../utils/validationError'
import { isProd } from '../config/env'

const DUP_FIELD_LABELS: Record<string, string> = {
  email: 'email address',
  slug: 'title',
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Cannot ${req.method} ${req.path}`))
}

/**
 * Central error handler. Every failure leaves as:
 *   { success: false, message, fields?, details? }
 * `message` is always a short sentence safe to show a user.
 * `fields` (when present) maps a form field name to its own message.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500
  let message = 'Something went wrong on our end. Please try again.'
  let fields: Record<string, string> | undefined
  let details: unknown

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    // An ApiError may carry `{ fields }` for form-level messages, or anything else as details.
    if (err.details && typeof err.details === 'object' && 'fields' in err.details) {
      fields = (err.details as { fields: Record<string, string> }).fields
    } else {
      details = err.details
    }
  } else if (err instanceof ZodError) {
    statusCode = 400
    const formatted = formatZodError(err)
    message = formatted.message
    fields = formatted.fields
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400
    fields = {}
    for (const [path, e] of Object.entries(err.errors)) {
      const label = humanizeField([path])
      fields[path] =
        e.kind === 'required'
          ? `${label} is required.`
          : e.kind === 'enum'
            ? `${label} is not an allowed value.`
            : `${label} is not valid.`
    }
    const keys = Object.keys(fields)
    message = keys.length === 1 ? fields[keys[0]] : `Please fix ${keys.length} fields and try again.`
  } else if (err instanceof MongooseError.CastError) {
    statusCode = 400
    message =
      err.path === '_id'
        ? 'That record could not be found.'
        : `${humanizeField([err.path])} is not valid.`
  } else if (err instanceof MongoServerError && err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'value'
    const label = DUP_FIELD_LABELS[field] ?? humanizeField([field]).toLowerCase()
    message = `That ${label} is already in use.`
  } else if (isBodyParserError(err)) {
    statusCode = err.type === 'entity.too.large' ? 413 : 400
    message =
      err.type === 'entity.too.large'
        ? 'That upload is too large. Please use a smaller file.'
        : 'The request body could not be read. Please try again.'
  } else if (err instanceof Error && isProd) {
    // Hide internal error text from users in production.
    message = 'Something went wrong on our end. Please try again.'
  } else if (err instanceof Error) {
    message = err.message
  }

  if (statusCode >= 500) console.error(err)

  res.status(statusCode).json({
    success: false,
    message,
    ...(fields ? { fields } : {}),
    ...(details !== undefined ? { details } : {}),
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  })
}

interface BodyParserError extends Error {
  type: string
  status?: number
}

function isBodyParserError(err: unknown): err is BodyParserError {
  return (
    err instanceof Error &&
    typeof (err as BodyParserError).type === 'string' &&
    (err as BodyParserError).type.startsWith('entity.')
  )
}
