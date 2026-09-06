import { NextResponse } from "next/server";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface OkExtra {
  message?: string;
  pagination?: Pagination;
  status?: number;
}

/**
 * Success envelope shared by every endpoint:
 *   { success: true, data, message?, pagination? }
 */
export function ok<T>(data: T, extra: OkExtra = {}): NextResponse {
  const { status = 200, ...rest } = extra;
  return NextResponse.json({ success: true, data, ...rest }, { status });
}

/** 201 Created with the new record as `data`. */
export function created<T>(data: T, message?: string): NextResponse {
  return ok(data, { status: 201, message });
}

/** Bare `{ success: true, message }` for actions that return no record. */
export function done(message: string, status = 200): NextResponse {
  return NextResponse.json({ success: true, message }, { status });
}
