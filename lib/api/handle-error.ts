import { NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "./errors";
import { formatZodError, humanizeField } from "./validation-error";
import { isProd } from "@/lib/env";

const DUP_FIELD_LABELS: Record<string, string> = {
  email: "email address",
  slug: "title",
};

interface ErrorBody {
  success: false;
  message: string;
  fields?: Record<string, string>;
  details?: unknown;
}

function isDuplicateKeyError(
  err: unknown,
): err is { code: number; keyValue?: Record<string, unknown> } {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === 11000;
}

/**
 * Central failure handler for every Route Handler. Normalises anything thrown
 * into `{ success: false, message, fields?, details? }` with an HTTP status.
 * `message` is always a short sentence safe to show a user.
 */
export function handleError(err: unknown): NextResponse<ErrorBody> {
  let statusCode = 500;
  let message = "Something went wrong on our end. Please try again.";
  let fields: Record<string, string> | undefined;
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.details && typeof err.details === "object" && "fields" in err.details) {
      fields = (err.details as { fields: Record<string, string> }).fields;
    } else {
      details = err.details;
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    const formatted = formatZodError(err);
    message = formatted.message;
    fields = formatted.fields;
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    fields = {};
    for (const [path, e] of Object.entries(err.errors)) {
      const label = humanizeField([path]);
      fields[path] =
        e.kind === "required"
          ? `${label} is required.`
          : e.kind === "enum"
            ? `${label} is not an allowed value.`
            : `${label} is not valid.`;
    }
    const keys = Object.keys(fields);
    message =
      keys.length === 1 ? fields[keys[0]] : `Please fix ${keys.length} fields and try again.`;
  } else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message =
      err.path === "_id"
        ? "That record could not be found."
        : `${humanizeField([err.path])} is not valid.`;
  } else if (isDuplicateKeyError(err)) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0] ?? "value";
    const label = DUP_FIELD_LABELS[field] ?? humanizeField([field]).toLowerCase();
    message = `That ${label} is already in use.`;
  } else if (err instanceof Error && !isProd) {
    message = err.message;
  }

  if (statusCode >= 500) console.error(err);

  const body: ErrorBody = { success: false, message };
  if (fields) body.fields = fields;
  if (details !== undefined) body.details = details;

  return NextResponse.json(body, { status: statusCode });
}
