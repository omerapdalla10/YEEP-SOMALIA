import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireUser, requireRole } from "@/lib/api/auth";
import { uploadImage, imageUploadsReady, type UploadKind } from "@/lib/api/imagekit";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * POST /api/uploads — upload one image to ImageKit and return its URL.
 * `kind=avatar` any signed-in member; `kind=content` staff only.
 * Body: multipart/form-data with a `file` field.
 */
export const POST = route(async (req: NextRequest) => {
  if (!imageUploadsReady) {
    throw ApiError.badRequest("Image uploads are not configured on this server.");
  }

  const kind = (req.nextUrl.searchParams.get("kind") ?? "content") as UploadKind;
  if (kind !== "avatar" && kind !== "content") {
    throw ApiError.badRequest("Unknown upload kind.");
  }

  if (kind === "avatar") await requireUser(req);
  else await requireRole(req, "staff");

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    throw ApiError.badRequest("No file was uploaded.");
  }
  if (!ALLOWED.includes(file.type)) {
    throw ApiError.badRequest("Please upload a JPEG, PNG, WebP or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw ApiError.badRequest("That image is larger than 8 MB. Please choose a smaller file.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadImage(buffer, file.name || "image.jpg", kind);

  return ok(uploaded);
});
