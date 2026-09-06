import type { FilterQuery, Model } from "mongoose";
import type { Pagination } from "./response";

const MAX_LIMIT = 100;

interface ListOptions<T> {
  /** Fields usable with `?field=value` exact-match filtering. */
  filterable?: (keyof T & string)[];
  /** Fields searched by `?search=term` (case-insensitive, OR-combined). */
  searchable?: (keyof T & string)[];
  /** Default Mongoose sort, e.g. `"-createdAt"`. */
  defaultSort?: string;
  /** Extra filter merged into every query (e.g. a fixed `user` scope). */
  baseFilter?: FilterQuery<T>;
  /** Applied to the query before execution (e.g. `.populate()`). */
  transform?: (q: ReturnType<Model<T>["find"]>) => ReturnType<Model<T>["find"]>;
  /** Cap for `?limit=`. Defaults to 100. */
  maxLimit?: number;
  /** Fallback page size when `?limit=` is absent. Defaults to 20. */
  defaultLimit?: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Run a paginated, filterable, searchable list query from URL search params —
 * the shared behaviour behind every collection `GET`.
 */
export async function listQuery<T>(
  model: Model<T>,
  searchParams: URLSearchParams,
  options: ListOptions<T> = {},
): Promise<{ data: unknown[]; pagination: Pagination }> {
  const {
    filterable = [],
    searchable = [],
    defaultSort = "-createdAt",
    baseFilter = {},
    transform,
    maxLimit = MAX_LIMIT,
    defaultLimit = 20,
  } = options;

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get("limit")) || defaultLimit));
  const sort = searchParams.get("sort") || defaultSort;

  const filter: FilterQuery<T> = { ...baseFilter };
  for (const field of filterable) {
    const value = searchParams.get(field);
    if (value !== null) (filter as Record<string, unknown>)[field] = value;
  }

  const search = searchParams.get("search")?.trim();
  if (search && searchable.length) {
    const rx = new RegExp(escapeRegExp(search), "i");
    (filter as Record<string, unknown>).$or = searchable.map((f) => ({
      [f]: rx,
    }));
  }

  const base = model.find(filter);
  const query = transform ? transform(base) : base;

  const [items, total] = await Promise.all([
    query
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  };
}
