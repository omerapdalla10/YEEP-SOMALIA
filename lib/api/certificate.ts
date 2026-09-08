import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createHash } from "node:crypto";
import { appUrl } from "@/lib/env";

const BLUE = rgb(0.176, 0.561, 0.808); // #2D8FCE
const BLUE_DARK = rgb(0.122, 0.42, 0.627); // #1F6BA0
const INK = rgb(0.12, 0.16, 0.22);
const GREY = rgb(0.42, 0.46, 0.5);

/** Stable, shareable id for a volunteer's certificate (derived, not stored). */
export function certificateId(volunteerId: string): string {
  return (
    "YEEP-" +
    createHash("sha256").update(`cert:${volunteerId}`).digest("hex").slice(0, 10).toUpperCase()
  );
}

interface CertInput {
  name: string;
  role: string;
  /** ISO date the application was approved / the certificate issued. */
  issuedOn: Date;
  certId: string;
}

/** A4-landscape "Certificate of Appreciation" PDF. */
export async function generateCertificatePdf(input: CertInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // A4 landscape, points
  const { width, height } = page.getSize();

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const times = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  const centre = (text: string, y: number, size: number, font = helv, color = INK) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  // borders
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: BLUE, borderWidth: 3 });
  page.drawRectangle({ x: 34, y: 34, width: width - 68, height: height - 68, borderColor: BLUE_DARK, borderWidth: 1 });
  page.drawRectangle({ x: 0, y: height - 12, width, height: 12, color: BLUE });
  page.drawRectangle({ x: 0, y: 0, width, height: 12, color: BLUE });

  centre("YEEP SOMALIA", height - 96, 20, helvBold, BLUE_DARK);
  centre("Youth Engagement and Empowerment Programme", height - 116, 10, helv, GREY);

  centre("CERTIFICATE OF APPRECIATION", height - 176, 30, helvBold, INK);
  centre("This certificate is proudly presented to", height - 214, 12, helv, GREY);

  centre(input.name, height - 268, 40, helvBold, BLUE_DARK);
  page.drawLine({
    start: { x: width / 2 - 170, y: height - 282 },
    end: { x: width / 2 + 170, y: height - 282 },
    thickness: 1,
    color: BLUE,
  });

  const body =
    `in recognition of their valued service as a ${input.role} with YEEP Somalia, and`;
  const body2 = "for the time, skill and commitment they have given to our mission.";
  centre(body, height - 322, 12, helv, INK);
  centre(body2, height - 340, 12, helv, INK);
  centre("Engage · Empower · Transform", height - 372, 11, times, BLUE_DARK);

  const issued = input.issuedOn.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  page.drawText("Date of issue", { x: 120, y: 120, size: 9, font: helv, color: GREY });
  page.drawText(issued, { x: 120, y: 104, size: 12, font: helvBold, color: INK });
  page.drawLine({ start: { x: 120, y: 98 }, end: { x: 300, y: 98 }, thickness: 0.8, color: GREY });

  page.drawText("YEEP Somalia", { x: width - 300, y: 120, size: 9, font: helv, color: GREY });
  page.drawText("The YEEP Somalia Team", {
    x: width - 300,
    y: 104,
    size: 12,
    font: helvBold,
    color: INK,
  });
  page.drawLine({
    start: { x: width - 300, y: 98 },
    end: { x: width - 120, y: 98 },
    thickness: 0.8,
    color: GREY,
  });

  centre(
    `Certificate ID: ${input.certId}  ·  Verify at ${appUrl.replace(/^https?:\/\//, "")}/verify/${input.certId}`,
    58,
    8,
    helv,
    GREY,
  );

  return pdf.save();
}
