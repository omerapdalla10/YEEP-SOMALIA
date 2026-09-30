import mongoose, { type Model } from "mongoose";
import type { NextRequest } from "next/server";
import type { ZodObject, ZodRawShape } from "zod";
import { route, type IdContext } from "./route";
import { requireRole, optionalUser } from "./auth";
import { parseBody } from "./validate";
import { listQuery } from "./list-query";
import { ok, created } from "./response";
import { ApiError } from "./errors";
import { roleAtLeast, type Role } from "@/lib/roles";

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
  /**
   * Extra equality filter forced onto reads from callers below `writeRole`
   * (e.g. `{ published: true }` so drafts can't be fetched by guessing an id
   * or omitting the client's own filter). Staff+ always see everything.
   */
  publicFilter?: Partial<T>;
  /** When set, `GET .../[id]` also resolves a `slug` when the param isn't an id. */
  slug?: boolean;
}

/** Whether the requester may see documents `publicFilter` would otherwise hide. */
async function bypassesPublicFilter(req: NextRequest, minRole: Role): Promise<boolean> {
  const user = await optionalUser(req);
  return Boolean(user && roleAtLeast(user.role, minRole));
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
    let baseFilter: Partial<T> | undefined;
    if (cfg.readAccess !== "staff" && cfg.publicFilter) {
      if (!(await bypassesPublicFilter(req, writeRole))) baseFilter = cfg.publicFilter;
    }
    const { data, pagination } = await listQuery(model, req.nextUrl.searchParams, {
      filterable: cfg.filterable,
      searchable: cfg.searchable,
      defaultSort: cfg.defaultSort,
      baseFilter,
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

    let doc = mongoose.isValidObjectId(id) ? await model.findById(id) : null;
    if (!doc && cfg.slug) {
      doc = await model.findOne({ slug: id } as Record<string, unknown>);
    }
    if (!doc) throw ApiError.notFound(notFound);
    if (cfg.readAccess !== "staff" && cfg.publicFilter) {
      if (!(await bypassesPublicFilter(req, writeRole))) {
        const obj = doc.toObject() as Record<string, unknown>;
        const hidden = Object.entries(cfg.publicFilter).some(
          ([key, value]) => obj[key] !== value,
        );
        if (hidden) throw ApiError.notFound(notFound);
      }
    }
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
