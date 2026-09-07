import ImageKit from "imagekit";
import { imagekit as cfg, imageUploadsEnabled } from "@/lib/env";

export const imageUploadsReady = imageUploadsEnabled;

let client: ImageKit | null = null;

function getClient(): ImageKit {
  if (!client) {
    client = new ImageKit({
      publicKey: cfg.publicKey,
      privateKey: cfg.privateKey,
      urlEndpoint: cfg.urlEndpoint,
    });
  }
  return client;
}

/** Where each kind of upload lives in the ImageKit media library. */
export const UPLOAD_FOLDERS = {
  avatar: "/yeep/avatars",
  content: "/yeep/content",
} as const;
export type UploadKind = keyof typeof UPLOAD_FOLDERS;

export interface UploadedImage {
  url: string;
  fileId: string;
}

/** Upload one image buffer to ImageKit; returns the delivery URL + file id. */
export async function uploadImage(
  buffer: Buffer,
  fileName: string,
  kind: UploadKind,
): Promise<UploadedImage> {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "image.jpg";
  const res = await getClient().upload({
    file: buffer,
    fileName: safeName,
    folder: UPLOAD_FOLDERS[kind],
    useUniqueFileName: true,
  });
  return { url: res.url, fileId: res.fileId };
}

/** Delete a previously uploaded file. Never throws. */
export async function deleteImage(fileId: string): Promise<void> {
  try {
    await getClient().deleteFile(fileId);
  } catch (err) {
    console.error(`[imagekit] could not delete ${fileId}:`, err);
  }
}
