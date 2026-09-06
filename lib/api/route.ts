import type { NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { handleError } from "./handle-error";

type Handler<Ctx> = (req: NextRequest, ctx: Ctx) => Promise<Response> | Response;

/**
 * Wraps a Route Handler: opens the (cached) Mongo connection before the handler
 * runs and funnels every thrown error through the shared {@link handleError}.
 * Anything the handler returns is passed straight back to Next.js.
 */
export function route<Ctx = unknown>(fn: Handler<Ctx>): Handler<Ctx> {
  return async (req, ctx) => {
    try {
      await dbConnect();
      return await fn(req, ctx);
    } catch (err) {
      return handleError(err);
    }
  };
}

/** Params shape for a single dynamic `[id]` segment. */
export type IdContext = { params: Promise<{ id: string }> };
