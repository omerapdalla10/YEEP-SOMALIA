/**
 * Read an image File and return a downscaled, centre-cropped JPEG data URL of
 * exactly `width` x `height`. Keeps inline uploads small enough to store on the
 * record itself.
 */
export function fileToCroppedDataUrl(
  file: File,
  width: number,
  height: number,
  quality = 0.85,
): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
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
