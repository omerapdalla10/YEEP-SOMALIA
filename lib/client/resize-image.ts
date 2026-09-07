/**
 * Client-side image downscaling. Reads an image File and centre-crops it to
 * exact pixel dimensions on a canvas, then hands back either a data URL or a
 * Blob. Keeping the resize on the client makes uploads small — important on
 * slow connections — before they go to ImageKit (or straight onto the record
 * as a data URL when uploads aren't configured).
 */

function drawCropped(file: File, width: number, height: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("That image could not be loaded."));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        const scale = Math.max(width / image.width, height / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
        resolve(canvas);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Downscaled, centre-cropped JPEG data URL of exactly `width` x `height`. */
export async function fileToCroppedDataUrl(
  file: File,
  width: number,
  height: number,
  quality = 0.85,
): Promise<string> {
  const canvas = await drawCropped(file, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

/** Same, but a JPEG Blob — for uploading rather than embedding. */
export async function fileToCroppedBlob(
  file: File,
  width: number,
  height: number,
  quality = 0.85,
): Promise<Blob> {
  const canvas = await drawCropped(file, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process that image."))),
      "image/jpeg",
      quality,
    );
  });
}

/** Square avatar data URL (centre-cropped, `size` px). */
export function fileToAvatarDataUrl(file: File, size = 256, quality = 0.85): Promise<string> {
  return fileToCroppedDataUrl(file, size, size, quality);
}

/** Landscape image data URL for content records (project / event / news cards). */
export function fileToCoverDataUrl(
  file: File,
  width = 1024,
  height = 576,
  quality = 0.82,
): Promise<string> {
  return fileToCroppedDataUrl(file, width, height, quality);
}

/** Square avatar Blob for upload. */
export function fileToAvatarBlob(file: File, size = 512, quality = 0.85): Promise<Blob> {
  return fileToCroppedBlob(file, size, size, quality);
}

/** Landscape cover Blob for upload. */
export function fileToCoverBlob(
  file: File,
  width = 1600,
  height = 900,
  quality = 0.85,
): Promise<Blob> {
  return fileToCroppedBlob(file, width, height, quality);
}
