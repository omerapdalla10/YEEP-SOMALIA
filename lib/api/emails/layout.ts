import { appUrl } from "@/lib/env";

export const BLUE = "#2D8FCE";
export const BLUE_DARK = "#1F6BA0";
export const TINT = "#D4E6F4";
export const INK = "#1f2937";
export const SUB = "#6b7280";

export const SUPPORT_EMAIL = "info@yeep.org.so";
export const WEBSITE = "yeep.org.so";
export const SIGNOFF_NAME = "The YEEP Somalia Team";
export const SIGNOFF_TITLE = "Youth Engagement and Empowerment Platform";

export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${SUB};">${html}</p>`;
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:23px;line-height:1.3;color:${INK};font-weight:800;">${escapeHtml(text)}</h1>`;
}

export function stepsBox(label: string, steps: { title: string; desc: string }[]): string {
  const rows = steps
    .map(
      (s) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
        <tr>
          <td width="22" valign="top" style="font-size:14px;color:${BLUE_DARK};font-weight:800;">&#8250;</td>
          <td>
            <div style="font-size:14px;font-weight:700;color:${INK};">${escapeHtml(s.title)}</div>
            <div style="font-size:13px;color:${SUB};line-height:1.5;">${escapeHtml(s.desc)}</div>
          </td>
        </tr>
      </table>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};border-radius:12px;margin:8px 0 16px;">
    <tr><td style="padding:20px 22px;">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${BLUE_DARK};margin-bottom:12px;">${escapeHtml(label)}</div>
      ${rows}
    </td></tr>
  </table>`;
}

export function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;">
    <tr><td style="border-radius:12px;background:${BLUE};">
      <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">${escapeHtml(label)}</a>
    </td></tr>
  </table>`;
}

export function signoff(): string {
  return `<p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:${SUB};">
    Warm regards,<br>
    <strong style="color:${INK};">${SIGNOFF_NAME}</strong><br>
    ${SIGNOFF_TITLE}<br>
    YEEP Somalia
  </p>`;
}

/** Wrap composed body HTML in the branded header/footer shell. */
export function emailShell(opts: { title: string; preheader: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr>
        <td style="background:${BLUE};padding:32px 40px;">
          <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;">YEEP Somalia</div>
          <div style="font-size:12px;color:${TINT};margin-top:2px;letter-spacing:.04em;">Engage &middot; Empower &middot; Transform</div>
        </td>
      </tr>
      <tr><td style="padding:40px 40px 32px;">${opts.body}</td></tr>
      <tr>
        <td style="background:#0d1f1e;padding:24px 40px;">
          <div style="font-size:13px;color:#9ca3af;line-height:1.6;">
            YEEP Somalia &middot; Mogadishu, Somalia<br>
            <a href="mailto:${SUPPORT_EMAIL}" style="color:${TINT};text-decoration:none;">${SUPPORT_EMAIL}</a>
            &middot;
            <a href="${appUrl}" style="color:${TINT};text-decoration:none;">${WEBSITE}</a>
          </div>
        </td>
      </tr>
    </table>
    <div style="font-size:11px;color:#9ca3af;margin-top:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      This message was sent to you by YEEP Somalia.
    </div>
  </td></tr>
</table>
</body>
</html>`;
}
