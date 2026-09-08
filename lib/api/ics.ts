import { appUrl } from "@/lib/env";

interface IcsEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end?: Date;
}

function fmt(d: Date): string {
  // UTC basic format: 20260907T090000Z
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** A single-event iCalendar file the recipient can add to their calendar. */
export function eventToIcs(ev: IcsEvent): string {
  const end = ev.end ?? new Date(ev.start.getTime() + 2 * 60 * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YEEP Somalia//Events//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:event-${ev.id}@yeep.org.so`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(ev.start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(ev.title)}`,
    ev.description ? `DESCRIPTION:${esc(ev.description)}` : "",
    ev.location ? `LOCATION:${esc(ev.location)}` : "",
    `URL:${appUrl}/events`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}
