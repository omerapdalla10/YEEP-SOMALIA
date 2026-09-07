import { ApiError, getToken } from "./api";
import {
  fileToAvatarBlob,
  fileToCoverBlob,
  fileToAvatarDataUrl,
  fileToCoverDataUrl,
} from "./resize-image";

/** Auth + media-library folder on the server. */
export type UploadKind = "avatar" | "content";
/** Crop geometry applied in the browser before upload. */
export type UploadShape = "cover" | "square";

/**
 * Downscale an image in the browser, upload it via `/api/uploads`, and return
 * the delivery URL to store on the record. Falls back to an inline data URL
 * when the server reports that uploads aren't configured (no ImageKit keys).
 */
export async function uploadImage(
  file: File,
  kind: UploadKind,
  shape: UploadShape = kind === "avatar" ? "square" : "cover",
): Promise<string> {
  const blob = shape === "square" ? await fileToAvatarBlob(file, 800) : await fileToCoverBlob(file);

  const form = new FormData();
  form.append("file", blob, file.name || "image.jpg");

  const token = getToken();
  const resp = await fetch(`/api/uploads?kind=${kind}`, {
    method: "POST",
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const body = await resp.json().catch(() => null);

  if (!resp.ok || !body?.success) {
    if (resp.status === 400 && /not configured/i.test(body?.message ?? "")) {
      return shape === "square" ? fileToAvatarDataUrl(file) : fileToCoverDataUrl(file);
    }
    throw new ApiError(body?.message || "Could not upload the image.", resp.status);
  }
  return body.data.url as string;
}
