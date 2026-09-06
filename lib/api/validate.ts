import type { ZodType } from "zod";
import { ApiError } from "./errors";

/** Read and JSON-parse a request body, turning parse failures into a 400. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw ApiError.badRequest("The request body could not be read. Please send valid JSON.");
  }
}

/** Parse the JSON body against `schema`. Throws `ZodError` on failure. */
export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  return schema.parse(await readJson(req));
}

/** Parse `?a=1&b=2` query params against `schema`. Throws `ZodError` on failure. */
export function parseQuery<T>(searchParams: URLSearchParams, schema: ZodType<T>): T {
  return schema.parse(Object.fromEntries(searchParams.entries()));
}
