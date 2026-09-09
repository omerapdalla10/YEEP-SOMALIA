import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { getResource } from "@/lib/server/resource";
import { img } from "@/lib/client/img";
import Prose from "@/components/prose";
import EventRegisterButton from "@/components/event-register-button";
import type { EventItem } from "@/lib/types";

type Params = Promise<{ slug: string }>;

async function load(slug: string) {
  const ev = await getResource<EventItem>(`/api/events/${encodeURIComponent(slug)}`);
  if (!ev || ev.published === false) return null;
  return ev;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const ev = await load(slug);
  if (!ev) return { title: "Event not found" };
  const image = img(ev.image, "w=1200&h=630&fit=crop&auto=format");
  const desc = [ev.dateLabel, ev.location].filter(Boolean).join(" · ") || ev.description || undefined;
  return {
    title: ev.title,
    description: desc,
    openGraph: {
      title: ev.title,
      description: desc,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const ev = await load(slug);
  if (!ev) notFound();

  const spotsLeft = ev.capacity > 0 ? Math.max(0, ev.capacity - (ev.registered || 0)) : null;
  const pct = ev.capacity > 0 ? Math.min(100, Math.round(((ev.registered || 0) / ev.capacity) * 100)) : 0;

  const facts = [
    ev.dateLabel ? { icon: Calendar, label: ev.dateLabel } : null,
    ev.timeLabel ? { icon: Clock, label: ev.timeLabel } : null,
    ev.location ? { icon: MapPin, label: ev.location } : null,
    ev.capacity > 0
      ? { icon: Users, label: `${ev.registered || 0} / ${ev.capacity} registered` }
      : null,
  ].filter(Boolean) as { icon: typeof Calendar; label: string }[];

  return (
    <div className="pt-16 lg:pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#2D8FCE] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All events
        </Link>

        <span className="inline-block px-2.5 py-1 bg-[#D4E6F4] text-[#1F6BA0] text-xs font-semibold rounded-full mb-4">
          {ev.type}
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {ev.title}
        </h1>

        {ev.image && (
          <div className="rounded-2xl overflow-hidden bg-gray-100 mb-8">
            <img
              src={img(ev.image, "w=1000&h=520&fit=crop&auto=format")}
              alt={ev.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div>
            <Prose text={ev.description} />
          </div>

          <aside className="rounded-2xl border border-gray-100 p-5 h-fit lg:sticky lg:top-28 space-y-4">
            <ul className="space-y-3">
              {facts.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <f.icon size={15} className="text-[#2D8FCE] mt-0.5 shrink-0" />
                  {f.label}
                </li>
              ))}
            </ul>

            {ev.capacity > 0 && (
              <div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2D8FCE] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                {spotsLeft !== null && (
                  <p className="text-xs text-gray-400 mt-1.5">{spotsLeft} spots left</p>
                )}
              </div>
            )}

            <EventRegisterButton event={ev} className="w-full" />
          </aside>
        </div>
      </article>
    </div>
  );
}
