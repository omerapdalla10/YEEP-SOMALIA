import type { Model } from "mongoose";
import type { NextRequest } from "next/server";
import type { ZodObject, ZodRawShape } from "zod";
import { route, type IdContext } from "./route";
import { requireRole } from "./auth";
import { parseBody } from "./validate";
import { listQuery } from "./list-query";
import { ok, created } from "./response";
import { ApiError } from "./errors";
import type { Role } from "@/lib/roles";

export interface ResourceConfig<T> {
  filterable?: (keyof T & string)[];
  searchable?: (keyof T & string)[];
  defaultSort?: string;
  /** Zod schema for create bodies; `.partial()` of it validates updates. */
  bodySchema: ZodObject<ZodRawShape>;
  /** Minimum role for create/update/delete. Default: `"staff"`. */
  writeRole?: Role;
  /** `"public"` (default) lets anyone read; `"staff"` locks reads down too. */
  readAccess?: "public" | "staff";
}

/** Binds the model's `T` to its config so route files stay one-liners. */
export function defineResource<T>(model: Model<T>, config: ResourceConfig<T>) {
  return { model, config };
}

/** "GalleryItem" -> "gallery item" for user-facing messages. */
function readableName(modelName: string): string {
  return modelName.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
}

async function insert<T>(model: Model<T>, data: unknown): Promise<unknown> {
  const docs = await model.create([data as Partial<T>]);
  return docs[0];
}

/** `GET` (list) + `POST` (create) for a collection route (`route.ts`). */
export function resourceCollection<T>(model: Model<T>, cfg: ResourceConfig<T>) {
  const writeRole = cfg.writeRole ?? "staff";

  const GET = route(async (req: NextRequest) => {
    if (cfg.readAccess === "staff") await requireRole(req, writeRole);
    const { data, pagination } = await listQuery(model, req.nextUrl.searchParams, {
      filterable: cfg.filterable,
      searchable: cfg.searchable,
      defaultSort: cfg.defaultSort,
    });
    return ok(data, { pagination });
  });

  const POST = route(async (req: NextRequest) => {
    await requireRole(req, writeRole);
    const body = await parseBody(req, cfg.bodySchema);
    return created(await insert(model, body));
  });

  return { GET, POST };
}

/** `GET` / `PATCH` / `DELETE` for a `[id]/route.ts`. */
export function resourceItem<T>(model: Model<T>, cfg: ResourceConfig<T>) {
  const writeRole = cfg.writeRole ?? "staff";
  const notFound = `That ${readableName(model.modelName)} could not be found.`;
  const updateSchema = cfg.bodySchema.partial();

  const GET = route<IdContext>(async (req, ctx) => {
    if (cfg.readAccess === "staff") await requireRole(req, writeRole);
    const { id } = await ctx.params;
    const doc = await model.findById(id);
    if (!doc) throw ApiError.notFound(notFound);
    return ok(doc);
  });

  const PATCH = route<IdContext>(async (req, ctx) => {
    await requireRole(req, writeRole);
    const { id } = await ctx.params;
    const body = await parseBody(req, updateSchema);
    const doc = await model.findByIdAndUpdate(id, body as Partial<T>, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw ApiError.notFound(notFound);
    return ok(doc);
  });

  const DELETE = route<IdContext>(async (req, ctx) => {
    await requireRole(req, writeRole);
    const { id } = await ctx.params;
    const doc = await model.findByIdAndDelete(id);
    if (!doc) throw ApiError.notFound(notFound);
    return ok({ id });
  });

  return { GET, PATCH, DELETE };
}
