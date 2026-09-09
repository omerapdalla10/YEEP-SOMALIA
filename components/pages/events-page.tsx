"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ArrowRight, Check, Loader2, X } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { useAuth } from "@/components/auth-context";
import { api, ApiError } from "@/lib/client/api";
import { img } from "@/lib/client/img";
import { QueryBoundary } from "@/components/data-states";
import type { EventItem, EventRegistration } from "@/lib/types";

const typeColor: Record<string, string> = {
  Community: "bg-[#D4E6F4] text-[#1F6BA0]",
  Conference: "bg-blue-100 text-blue-700",
  Workshop: "bg-purple-100 text-purple-700",
  Fundraiser: "bg-[#D4E6F4] text-[#1F6BA0]",
  Forum: "bg-[#D4E6F4] text-[#1F6BA0]",
  Networking: "bg-rose-100 text-rose-700",
};

export default function EventsPage() {
  const [activeMonth, setActiveMonth] = useState("All");
  const { user } = useAuth();
  const {
    data: events,
    loading,
    error,
    refetch,
  } = useCollection<EventItem>("/events", { limit: 100 });

  const {
    data: registrations,
    refetch: refetchRegistrations,
  } = useCollection<EventRegistration>(user ? "/events/me" : null);

  const registeredIds = useMemo(
    () => new Set(registrations.map((r) => r.event?._id).filter(Boolean)),
    [registrations],
  );

  const [busyId, setBusyId] = useState<string | null>(null);
  const [cardError, setCardError] = useState<{ id: string; message: string } | null>(null);
  // Snapshot "now" once per mount so deadline checks stay stable across renders.
  const [now] = useState(() => Date.now());

  const months = Array.from(new Set(events.map((e) => e.month).filter(Boolean))) as string[];
  const filtered = activeMonth === "All" ? events : events.filter((e) => e.month === activeMonth);

  async function toggleRegistration(event: EventItem, registered: boolean) {
    setBusyId(event._id);
    setCardError(null);
    try {
      if (registered) await api.del(`/events/${event._id}/register`);
      else await api.post(`/events/${event._id}/register`);
      refetch();
      refetchRegistrations();
    } catch (err) {
      setCardError({
        id: event._id,
        message: err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Events
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Upcoming Events</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join us at forums, workshops, dialogues, and roundtables — every event is a chance to
            connect and build peace.
          </p>
        </div>
      </section>

      {/* Month filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap">
            {["All", ...months].map((m) => (
              <button
                key={m}
                onClick={() => setActiveMonth(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeMonth === m
                    ? "bg-[#2D8FCE] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-[#D4E6F4] hover:text-[#1F6BA0]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={filtered.length === 0}
            onRetry={refetch}
            emptyLabel="No events scheduled for this month."
            loadingLabel="Loading events…"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {filtered.map((event) => {
                const spots = event.capacity || 0;
                const registeredCount = event.registered || 0;
                const isRegistered = registeredIds.has(event._id);
                const isFull = spots > 0 && registeredCount >= spots && !isRegistered;
                const isClosed =
                  new Date(event.startDate).getTime() <= now ||
                  (!!event.registrationDeadline &&
                    new Date(event.registrationDeadline).getTime() < now);
                const busy = busyId === event._id;

                return (
                  <div
                    key={event._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    <div className="relative sm:w-44 h-44 sm:h-auto overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={img(event.image, "w=400&h=300&fit=crop&auto=format")}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${typeColor[event.type]}`}
                        >
                          {event.type}
                        </span>
                        {isRegistered && (
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1">
                            <Check size={11} /> Registered
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/events/${event.slug}`}
                        className="font-bold text-gray-900 mb-2 hover:text-[#2D8FCE] transition-colors"
                      >
                        {event.title}
                      </Link>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">
                        {event.description}
                      </p>
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-xs font-semibold text-[#2D8FCE] hover:text-[#1F6BA0] mb-3"
                      >
                        View details &rarr;
                      </Link>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#2D8FCE]" /> {event.dateLabel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#2D8FCE]" /> {event.timeLabel}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-[#2D8FCE]" /> {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} className="text-[#2D8FCE]" /> {registeredCount}
                          {spots ? `/${spots}` : ""} registered
                        </span>
                      </div>
                      {/* Spots progress */}
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-[#2D8FCE] rounded-full"
                          style={{
                            width: `${spots ? Math.min(100, (registeredCount / spots) * 100) : 0}%`,
                          }}
                        />
                      </div>

                      {!user ? (
                        <Link
                          href="/login"
                          className="flex items-center justify-center gap-1.5 py-2 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                          Sign in to register <ArrowRight size={12} />
                        </Link>
                      ) : isRegistered ? (
                        <button
                          onClick={() => toggleRegistration(event, true)}
                          disabled={busy}
                          className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60"
                        >
                          {busy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <X size={12} />
                          )}
                          Cancel registration
                        </button>
                      ) : isClosed ? (
                        <button
                          disabled
                          className="py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl cursor-not-allowed"
                        >
                          Registration closed
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl cursor-not-allowed"
                        >
                          Event full
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleRegistration(event, false)}
                          disabled={busy}
                          className="flex items-center justify-center gap-1.5 py-2 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-60"
                        >
                          {busy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>
                              Register Now <ArrowRight size={12} />
                            </>
                          )}
                        </button>
                      )}
                      {cardError?.id === event._id && (
                        <p className="text-xs text-red-500 mt-2 text-center">{cardError.message}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </QueryBoundary>
        </div>
      </section>
    </div>
  );
}
