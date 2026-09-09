"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Loader2, X, ArrowRight } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { useAuth } from "@/components/auth-context";
import { api, ApiError } from "@/lib/client/api";
import type { EventItem, EventRegistration } from "@/lib/types";

/** Self-contained RSVP control for one event (used on the event detail page). */
export default function EventRegisterButton({
  event,
  className = "",
}: {
  event: EventItem;
  className?: string;
}) {
  const { user } = useAuth();
  const { data: registrations, refetch } = useCollection<EventRegistration>(
    user ? "/events/me" : null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const registered = useMemo(
    () => registrations.some((r) => r.event?._id === event._id),
    [registrations, event._id],
  );

  const spots = event.capacity || 0;
  const full = spots > 0 && (event.registered || 0) >= spots && !registered;
  const closed =
    new Date(event.startDate).getTime() <= now ||
    (!!event.registrationDeadline && new Date(event.registrationDeadline).getTime() < now);

  const toggle = async () => {
    setBusy(true);
    setError(null);
    try {
      if (registered) await api.del(`/events/${event._id}/register`);
      else await api.post(`/events/${event._id}/register`);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const base = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${className}`;

  let button: React.ReactNode;
  if (!user) {
    button = (
      <Link href="/login" className={`${base} bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white`}>
        Sign in to register <ArrowRight size={15} />
      </Link>
    );
  } else if (registered) {
    button = (
      <button
        onClick={toggle}
        disabled={busy}
        className={`${base} border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 disabled:opacity-60`}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
        Cancel registration
      </button>
    );
  } else if (closed) {
    button = (
      <span className={`${base} bg-gray-100 text-gray-400 cursor-not-allowed`}>
        Registration closed
      </span>
    );
  } else if (full) {
    button = <span className={`${base} bg-gray-100 text-gray-400 cursor-not-allowed`}>Event full</span>;
  } else {
    button = (
      <button
        onClick={toggle}
        disabled={busy}
        className={`${base} bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white disabled:opacity-60`}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
        Register for this event
      </button>
    );
  }

  return (
    <div>
      {button}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
