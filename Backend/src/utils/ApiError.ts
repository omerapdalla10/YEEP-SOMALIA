export class ApiError extends Error {
  statusCode: number
  details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    Error.captureStackTrace?.(this, this.constructor)
  }

  static badRequest(message = "That request wasn't quite right. Please check and try again.", details?: unknown) {
    return new ApiError(400, message, details)
  }
  static unauthorized(message = 'Please sign in to continue.', details?: unknown) {
    return new ApiError(401, message, details)
  }
  static forbidden(message = "You don't have permission to do that.", details?: unknown) {
    return new ApiError(403, message, details)
  }
  static notFound(message = "We couldn't find what you were looking for.", details?: unknown) {
    return new ApiError(404, message, details)
  }
  static conflict(message = 'That already exists.', details?: unknown) {
    return new ApiError(409, message, details)
  }
}
