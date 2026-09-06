import type { Model, FilterQuery } from 'mongoose'
import { asyncHandler } from './asyncHandler'
import { ApiError } from './ApiError'

interface CrudOptions<T> {
  /** Fields that may be used with ?field=value exact-match filtering. */
  filterable?: (keyof T & string)[]
  /** Fields searched by ?search=term (case-insensitive regex, OR-combined). */
  searchable?: (keyof T & string)[]
  /** Default sort passed to Mongoose (e.g. "-createdAt"). */
  defaultSort?: string
}

const MAX_LIMIT = 100

/** "GalleryItem" -> "gallery item" for use in user-facing messages. */
function readableName(modelName: string): string {
  return modelName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
}

/** Builds standard list/getOne/create/update/remove handlers for a Mongoose model. */
export function crudController<T>(model: Model<T>, options: CrudOptions<T> = {}) {
  const { filterable = [], searchable = [], defaultSort = '-createdAt' } = options
  const notFoundMessage = `That ${readableName(model.modelName)} could not be found.`

  const list = asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || 20))
    const sort = (req.query.sort as string) || defaultSort

    const filter: FilterQuery<T> = {}
    for (const field of filterable) {
      const value = req.query[field]
      if (value !== undefined) (filter as Record<string, unknown>)[field] = value
    }

    const search = (req.query.search as string)?.trim()
    if (search && searchable.length) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      ;(filter as Record<string, unknown>).$or = searchable.map((f) => ({ [f]: rx }))
    }

    const [items, total] = await Promise.all([
      model
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      model.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    })
  })

  const getOne = asyncHandler(async (req, res) => {
    const doc = await model.findById(req.params.id)
    if (!doc) throw ApiError.notFound(notFoundMessage)
    res.json({ success: true, data: doc })
  })

  const create = asyncHandler(async (req, res) => {
    const doc = await model.create(req.body)
    res.status(201).json({ success: true, data: doc })
  })

  const update = asyncHandler(async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) throw ApiError.notFound(notFoundMessage)
    res.json({ success: true, data: doc })
  })

  const remove = asyncHandler(async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id)
    if (!doc) throw ApiError.notFound(notFoundMessage)
    res.json({ success: true, data: { id: req.params.id } })
  })

  return { list, getOne, create, update, remove }
}
