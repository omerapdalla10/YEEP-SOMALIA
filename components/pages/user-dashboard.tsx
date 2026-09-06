"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useAuth, type AuthUser } from "@/components/auth-context";
import { useResource } from "@/lib/client/hooks";
import { api, ApiError } from "@/lib/client/api";
import { img } from "@/lib/client/img";
import { formatDateShort } from "@/lib/client/format";
import { roleLabel } from "@/lib/roles";
import { fileToAvatarDataUrl } from "@/lib/client/resize-image";
import { useAdminTheme } from "@/components/admin/use-admin-theme";
import { Donut } from "@/components/admin/charts";
import { CommandPalette } from "@/components/admin/command-palette";
import type { MyDashboardData } from "@/lib/types";

/* ------------------------------- constants ------------------------------- */

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: User, label: "My Profile", id: "profile" },
  { icon: BookOpen, label: "Applications", id: "applications" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const STATUS_VARIANT: Record<string, string> = {
  Approved: "green",
  "Under Review": "blue",
  Pending: "amber",
  Rejected: "red",
};

const STATUS_COLOR: Record<string, string> = {
  Approved: "#2D8FCE",
  "Under Review": "#7FB8DC",
  Pending: "#D4E6F4",
  Rejected: "#9CA3AF",
};

/* --------------------------------- helpers ------------------------------- */

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function roleBadge(role?: string) {
  const v = role === "admin" ? "violet" : role === "staff" ? "blue" : "teal";
  return `adm-badge adm-badge-${v}`;
}

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_VARIANT[status] ?? "";
  return <span className={`adm-badge${v ? ` adm-badge-${v}` : ""}`}>{status}</span>;
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="adm-loading">
      <AlertCircle size={22} style={{ color: "var(--danger)" }} />
      <span>{message}</span>
      <button className="adm-btn adm-btn-sm" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

function MemberSkeleton() {
  return (
    <div className="adm-skeleton">
      <div className="adm-sk-stats">
        <div className="adm-sk" />
        <div className="adm-sk" />
        <div className="adm-sk" />
        <div className="adm-sk" />
      </div>
      <div className="adm-sk-panels">
        <div className="adm-sk" />
        <div className="adm-sk" />
      </div>
    </div>
  );
}

/* ---------------------------- account card ------------------------------- */

function AccountCard() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await api.patch<AuthUser>("/auth/me", profile);
      updateUser(res.data);
      setProfileMsg({ text: "Profile updated.", ok: true });
    } catch (err) {
      setProfileMsg({
        text: err instanceof ApiError ? err.message : "Could not save changes.",
        ok: false,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarBusy(true);
    setProfileMsg(null);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      const res = await api.patch<AuthUser>("/auth/me", { avatar: dataUrl });
      updateUser(res.data);
      setProfileMsg({ text: "Photo updated.", ok: true });
    } catch (err) {
      setProfileMsg({
        text: err instanceof Error ? err.message : "Could not upload photo.",
        ok: false,
      });
    } finally {
      setAvatarBusy(false);
    }
  };

  return (
    <div className="adm-panel adm-panel-p" style={{ maxWidth: 560 }}>
      <h3 style={{ fontSize: 15.5, marginBottom: 18 }}>My Profile</h3>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarFile} />
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          title="Change photo"
          style={{
            position: "relative",
            width: 64,
            height: 64,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid var(--line)",
            background: "var(--bg)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {user?.avatar ? (
            <img
              src={img(user.avatar, "w=140&h=140&fit=crop&auto=format")}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "var(--sub)",
              }}
            >
              {initials(user?.name)}
            </span>
          )}
          <span
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.4)",
              color: "#fff",
              display: avatarBusy ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {avatarBusy ? <Loader2 size={16} className="adm-spin" /> : <Camera size={16} />}
          </span>
        </button>
        <div>
          <div style={{ fontWeight: 700 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: "var(--sub)" }}>{user?.email}</div>
          <div style={{ marginTop: 6 }}>
            <span className={roleBadge(user?.role)}>{roleLabel(user?.role)}</span>
          </div>
          <button
            type="button"
            className="adm-btn adm-btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => fileRef.current?.click()}
            disabled={avatarBusy}
          >
            {avatarBusy && <Loader2 size={12} className="adm-spin" />}
            Change photo
          </button>
        </div>
      </div>

      <form
        onSubmit={saveProfile}
        style={{
          marginTop: 22,
          paddingTop: 18,
          borderTop: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div>
          <span className="adm-label">Full name</span>
          <input
            className="adm-input"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <span className="adm-label">Email</span>
          <input className="adm-input" value={user?.email ?? ""} disabled />
        </div>
        <div>
          <span className="adm-label">Phone</span>
          <input
            className="adm-input"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        {profileMsg && (
          <p className={profileMsg.ok ? "adm-msg-ok" : "adm-msg-err"}>{profileMsg.text}</p>
        )}
        <button
          type="submit"
          className="adm-btn adm-btn-primary"
          style={{ alignSelf: "flex-start" }}
          disabled={savingProfile}
        >
          {savingProfile && <Loader2 size={14} className="adm-spin" />}
          Save changes
        </button>
      </form>
    </div>
  );
}

/* --------------------------- password card ------------------------------- */

function PasswordCard() {
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwd.newPassword.length < 8)
      return setPwdMsg({ text: "New password must be at least 8 characters.", ok: false });
    if (pwd.newPassword !== pwd.confirm)
      return setPwdMsg({ text: "New passwords do not match.", ok: false });
    setPwdBusy(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
      setPwdMsg({ text: "Password changed successfully.", ok: true });
    } catch (err) {
      setPwdMsg({
        text: err instanceof ApiError ? err.message : "Could not change password.",
        ok: false,
      });
    } finally {
      setPwdBusy(false);
    }
  };

  return (
    <form
      onSubmit={changePassword}
      className="adm-panel adm-panel-p"
      style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <KeyRound size={15} style={{ color: "var(--teal-deep)" }} />
        <h3 style={{ fontSize: 15.5 }}>Change password</h3>
      </div>
      <input
        className="adm-input"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Current password"
        value={pwd.currentPassword}
        onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
      />
      <div className="adm-modal-grid">
        <input
          className="adm-input"
          type="password"
          required
          autoComplete="new-password"
          placeholder="New password"
          value={pwd.newPassword}
          onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
        />
        <input
          className="adm-input"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Confirm new password"
          value={pwd.confirm}
          onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
        />
      </div>
      {pwdMsg && <p className={pwdMsg.ok ? "adm-msg-ok" : "adm-msg-err"}>{pwdMsg.text}</p>}
      <button
        type="submit"
        className="adm-btn adm-btn-primary"
        style={{ alignSelf: "flex-start" }}
        disabled={pwdBusy}
      >
        {pwdBusy && <Loader2 size={14} className="adm-spin" />}
        Update password
      </button>
    </form>
  );
}

/* ============================== main component =========================== */

export default function UserDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { theme, toggle } = useAdminTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const currentLabel = navItems.find((n) => n.id === active)?.label ?? "Dashboard";

  const { data, loading, error, refetch } = useResource<MyDashboardData>("/dashboard/me");

  const notifications = useMemo(() => {
    const list: { text: string; time: string; read: boolean }[] = [];
    for (const app of data?.applications ?? []) {
      list.push({
        text: `Your volunteer application for "${app.role}" is ${app.status.toLowerCase()}.`,
        time: formatDateShort(app.createdAt),
        read: app.status !== "Under Review" && app.status !== "Pending",
      });
    }
    for (const ev of data?.upcomingEvents ?? []) {
      list.push({
        text: `Upcoming event: ${ev.title} — registration is open.`,
        time: ev.dateLabel ?? "",
        read: false,
      });
    }
    list.push({
      text: "Welcome to YEEP Somalia. Complete your profile to get started.",
      time: "",
      read: true,
    });
    return list;
  }, [data]);

  const unread = notifications.filter((n) => !n.read).length;
  const notifUnread = unread > 0 && !notifRead;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((o) => !o);
      } else if (e.key === "Escape") {
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function goTo(id: string) {
    setActive(id);
    setSidebarOpen(false);
    setCmdkOpen(false);
    setNotifOpen(false);
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const registeredEventIds = useMemo(
    () => new Set(data?.registeredEventIds ?? []),
    [data],
  );
  const [eventBusyId, setEventBusyId] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  // Snapshot "now" once per mount so deadline checks stay stable across renders.
  const [now] = useState(() => Date.now());

  async function toggleEventRegistration(id: string, registered: boolean) {
    setEventBusyId(id);
    setEventError(null);
    try {
      if (registered) await api.del(`/events/${id}/register`);
      else await api.post(`/events/${id}/register`);
      refetch();
    } catch (err) {
      setEventError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setEventBusyId(null);
    }
  }

  const counts = data?.counts;
  const statCards = [
    {
      key: "applications",
      label: "Applications",
      value: counts?.total ?? 0,
      tag: "All roles",
      icon: BookOpen,
      tint: "var(--teal-tint)",
      fg: "var(--teal-deep)",
    },
    {
      key: "applications",
      label: "Approved",
      value: counts?.approved ?? 0,
      tag: "Active roles",
      icon: CheckCircle,
      tint: "var(--green-tint)",
      fg: "var(--green)",
    },
    {
      key: "applications",
      label: "Pending Review",
      value: counts?.pending ?? 0,
      tag: "Awaiting decision",
      icon: Clock,
      tint: "var(--amber-tint)",
      fg: "var(--amber)",
    },
    {
      key: "dashboard",
      label: "Events Registered",
      value: data?.registeredEventIds.length ?? 0,
      tag: "You're attending",
      icon: Calendar,
      tint: "var(--blue-tint)",
      fg: "var(--blue)",
    },
  ];

  const statusDist = useMemo(() => {
    const apps = data?.applications ?? [];
    if (apps.length === 0) return [];
    const by: Record<string, number> = {};
    for (const a of apps) by[a.status] = (by[a.status] ?? 0) + 1;
    return Object.entries(by).map(([name, n]) => ({
      name,
      value: Math.round((n / apps.length) * 100),
      color: STATUS_COLOR[name] ?? "var(--teal)",
    }));
  }, [data]);

  const checklist = [
    { label: "Add a profile photo", done: Boolean(user?.avatar) },
    { label: "Add your phone number", done: Boolean(user?.phone) },
    { label: "Submit your first application", done: (counts?.total ?? 0) > 0 },
    { label: "Get an application approved", done: (counts?.approved ?? 0) > 0 },
  ];

  // Soonest upcoming event the member can still register for.
  const topAvailableEvent = useMemo(() => {
    for (const ev of data?.upcomingEvents ?? []) {
      if (registeredEventIds.has(ev._id)) continue;
      const full = ev.capacity > 0 && ev.registered >= ev.capacity;
      const closed =
        !!ev.registrationDeadline && new Date(ev.registrationDeadline).getTime() < now;
      if (!full && !closed) return ev;
    }
    return null;
  }, [data, registeredEventIds, now]);

  /* ------------------------------- views -------------------------------- */

  const renderDashboard = () => (
    <>
      {error && <ErrorBox message={error} onRetry={refetch} />}
      {data && (
        <>
          {topAvailableEvent && (
            <div
              className="adm-panel"
              style={{
                padding: 20,
                marginBottom: 16,
                border: "none",
                color: "#fff",
                background: "linear-gradient(135deg, var(--teal), var(--teal-deep))",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255,255,255,.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Calendar size={20} />
              </span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    opacity: 0.85,
                  }}
                >
                  Next event you can join
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-manrope), sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    lineHeight: 1.25,
                  }}
                >
                  {topAvailableEvent.title}
                </div>
                <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 2 }}>
                  {[topAvailableEvent.dateLabel, topAvailableEvent.location]
                    .filter(Boolean)
                    .join(" · ")}
                  {topAvailableEvent.capacity
                    ? ` · ${Math.max(
                        0,
                        topAvailableEvent.capacity - topAvailableEvent.registered,
                      )} spots left`
                    : ""}
                </div>
              </div>
              <button
                onClick={() => toggleEventRegistration(topAvailableEvent._id, false)}
                disabled={eventBusyId === topAvailableEvent._id}
                style={{
                  background: "#fff",
                  color: "var(--teal-deep)",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 18px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                  opacity: eventBusyId === topAvailableEvent._id ? 0.7 : 1,
                }}
              >
                {eventBusyId === topAvailableEvent._id ? (
                  <Loader2 size={14} className="adm-spin" />
                ) : (
                  <Calendar size={14} />
                )}
                Register now
              </button>
            </div>
          )}

          <div className="adm-stats">
            {statCards.map((s) => (
              <button key={s.label} className="adm-stat" onClick={() => goTo(s.key)}>
                <div className="top">
                  <span className="icon" style={{ background: s.tint, color: s.fg }}>
                    <s.icon size={17} />
                  </span>
                  <span className="adm-badge" style={{ background: s.tint, color: s.fg }}>
                    {s.tag}
                  </span>
                </div>
                <div className="val">{s.value}</div>
                <div className="lbl">{s.label}</div>
                <div className="hint">Open section →</div>
              </button>
            ))}
          </div>

          <div className="adm-row-2">
            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Application Status</h3>
                  <div className="sub">Share of your applications by outcome</div>
                </div>
              </div>
              {statusDist.length > 0 ? (
                <Donut data={statusDist} />
              ) : (
                <div className="adm-empty">
                  No applications yet.{" "}
                  <Link href="/volunteer" style={{ color: "var(--teal-deep)", fontWeight: 600 }}>
                    Apply to volunteer →
                  </Link>
                </div>
              )}
            </div>

            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Getting Started</h3>
                  <div className="sub">
                    {checklist.filter((c) => c.done).length} of {checklist.length} complete
                  </div>
                </div>
              </div>
              {checklist.map((c) => (
                <div key={c.label} className="adm-activity">
                  <span
                    className="ic"
                    style={
                      c.done
                        ? undefined
                        : { background: "var(--bg)", color: "var(--sub)" }
                    }
                  >
                    {c.done ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </span>
                  <div>
                    <div className="txt" style={c.done ? { color: "var(--sub)" } : undefined}>
                      {c.label}
                    </div>
                    <div className="time">{c.done ? "Done" : "Not yet"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="adm-panel adm-panel-p" style={{ marginBottom: 16 }}>
            <div className="adm-phead">
              <div>
                <h3>Upcoming Events</h3>
                <div className="sub">RSVP here or on the events page — cancel any time</div>
              </div>
              <Link href="/events" className="adm-chipbtn">
                Browse all
              </Link>
            </div>
            {data.upcomingEvents.length === 0 && (
              <div className="adm-empty">No upcoming events right now.</div>
            )}
            {data.upcomingEvents.map((ev) => {
              const registered = registeredEventIds.has(ev._id);
              const busy = eventBusyId === ev._id;
              const full = ev.capacity > 0 && ev.registered >= ev.capacity && !registered;
              const closed =
                !!ev.registrationDeadline &&
                new Date(ev.registrationDeadline).getTime() < now;
              return (
                <div key={ev._id} className="adm-activity">
                  <span className="ic">
                    <Calendar size={14} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="txt">{ev.title}</div>
                    <div className="time">
                      {[ev.dateLabel, ev.location].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {registered ? (
                    <button
                      className="adm-btn adm-btn-sm"
                      title="Click to cancel your registration"
                      onClick={() => toggleEventRegistration(ev._id, true)}
                      disabled={busy}
                    >
                      {busy ? (
                        <Loader2 size={12} className="adm-spin" />
                      ) : (
                        <Check size={12} style={{ color: "var(--green)" }} />
                      )}
                      Registered
                    </button>
                  ) : closed ? (
                    <span className="adm-badge">Closed</span>
                  ) : full ? (
                    <span className="adm-badge adm-badge-red">Full</span>
                  ) : (
                    <button
                      className="adm-btn adm-btn-sm adm-btn-primary"
                      onClick={() => toggleEventRegistration(ev._id, false)}
                      disabled={busy}
                    >
                      {busy && <Loader2 size={12} className="adm-spin" />}
                      Register
                    </button>
                  )}
                </div>
              );
            })}
            {eventError && (
              <p className="adm-msg-err" style={{ marginTop: 10 }}>
                {eventError}
              </p>
            )}
          </div>

          <div className="adm-row-lower">
            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Recent Applications</h3>
                </div>
                <button
                  className="adm-chipbtn"
                  onClick={() => goTo("applications")}
                >
                  View all
                </button>
              </div>
              {data.applications.slice(0, 4).map((app) => (
                <div key={app._id} className="adm-activity">
                  <span className="ic">
                    <BookOpen size={14} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="txt">{app.role}</div>
                    <div className="time">Applied {formatDateShort(app.createdAt)}</div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
              {data.applications.length === 0 && (
                <div className="adm-empty">
                  You haven&apos;t applied to any roles yet.
                </div>
              )}
            </div>

            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Quick Actions</h3>
                </div>
              </div>
              <Link href="/volunteer" className="adm-qa">
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}
                  >
                    <BookOpen size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Apply for a volunteer role
                    </span>
                    <span className="ct">Browse open positions</span>
                  </span>
                </span>
                <ChevronRight size={15} style={{ color: "var(--sub)" }} />
              </Link>
              <Link href="/events" className="adm-qa">
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--violet-tint)", color: "var(--violet)" }}
                  >
                    <Calendar size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Register for an event
                    </span>
                    <span className="ct">
                      {data.upcomingEvents.length} upcoming
                    </span>
                  </span>
                </span>
                <ChevronRight size={15} style={{ color: "var(--sub)" }} />
              </Link>
              <button className="adm-qa" onClick={() => goTo("profile")}>
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--blue-tint)", color: "var(--blue)" }}
                  >
                    <User size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Update your profile
                    </span>
                    <span className="ct">Keep your details current</span>
                  </span>
                </span>
                <ChevronRight size={15} style={{ color: "var(--sub)" }} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderApplications = () => (
    <div className="adm-panel">
      <div className="adm-panel-p" style={{ borderBottom: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: 15.5 }}>Volunteer Applications</h3>
        <div className="sub" style={{ fontSize: 12, color: "var(--sub)", marginTop: 3 }}>
          Every role you have applied for and its current status
        </div>
      </div>
      {error && <ErrorBox message={error} onRetry={refetch} />}
      {data && data.applications.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div className="adm-cellmain">
                      <span className="adm-thumb-ph">
                        <User size={15} />
                      </span>
                      <span className="adm-t-name">{app.role}</span>
                    </div>
                  </td>
                  <td>{formatDateShort(app.createdAt)}</td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && data.applications.length === 0 && (
        <div className="adm-empty">
          You haven&apos;t applied to any roles yet.{" "}
          <Link href="/volunteer" style={{ color: "var(--teal-deep)", fontWeight: 600 }}>
            Apply to volunteer →
          </Link>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="adm-panel">
      <div
        className="adm-panel-p"
        style={{
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: 15.5 }}>Notifications</h3>
        <button className="adm-chipbtn" onClick={() => setNotifRead(true)}>
          Mark all read
        </button>
      </div>
      {notifications.map((n, i) => (
        <div
          key={i}
          className={`adm-notif-item${notifRead || n.read ? " read" : ""}`}
          style={{ padding: "14px 22px" }}
        >
          <span className="nd" />
          <div>
            <div className="ntxt">{n.text}</div>
            {n.time && <div className="ntime">{n.time}</div>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PasswordCard />

      <div className="adm-panel adm-panel-p" style={{ maxWidth: 560 }}>
        <h3 style={{ fontSize: 15.5, marginBottom: 18 }}>Preferences</h3>
        {[
          { label: "Email notifications", desc: "Updates about programs and events", on: true },
          { label: "SMS alerts", desc: "Text messages for urgent updates", on: true },
          { label: "Monthly newsletter", desc: "Impact reports and highlights", on: false },
          { label: "Public profile", desc: "Let others see your volunteer profile", on: false },
        ].map((p) => (
          <div
            key={p.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: "var(--sub)" }}>{p.desc}</div>
            </div>
            <label className="adm-switch">
              <input type="checkbox" defaultChecked={p.on} />
              <span className="track" />
              <span className="thumb" />
            </label>
          </div>
        ))}
      </div>

      <div className="adm-panel adm-panel-p" style={{ maxWidth: 560 }}>
        <h3 style={{ fontSize: 15.5, marginBottom: 18 }}>Appearance</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Dark mode</div>
            <div style={{ fontSize: 12, color: "var(--sub)" }}>
              Applies to your dashboard on this browser.
            </div>
          </div>
          <button
            className={`adm-toggle${theme === "dark" ? " on" : ""}`}
            onClick={toggle}
            aria-label="Toggle dark mode"
          >
            <span className="knob">
              {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  /* -------------------------------- shell ------------------------------- */

  return (
    <div className="adm" data-theme={theme}>
      <div className={`adm-app${collapsed ? " is-collapsed" : ""}`}>
        <aside className={`adm-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="adm-brand-row">
            <Link href="/" className="adm-brand" title="Back to site">
              <img className="mark" src="/logo.svg" alt="YEEP Somalia" />
              <span>
                <span className="t1" style={{ display: "block" }}>
                  YEEP Somalia
                </span>
                <span className="t2">Member Dashboard</span>
              </span>
            </Link>
            <button
              className="adm-iconbtn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft
                size={15}
                style={{ transform: collapsed ? "rotate(180deg)" : undefined }}
              />
            </button>
          </div>
          <div className="adm-menu-lbl">MENU</div>
          <nav className="adm-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => goTo(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={17} />
                <span className="lbl">{item.label}</span>
                {item.id === "notifications" && notifUnread && (
                  <span
                    className="adm-badge adm-badge-red"
                    style={{ marginLeft: "auto", padding: "1px 7px" }}
                  >
                    {unread}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleLogout}
              style={{ color: "var(--danger)", marginTop: 8 }}
              title={collapsed ? "Sign out" : undefined}
            >
              <LogOut size={17} />
              <span className="lbl">Sign out</span>
            </button>
          </nav>
          <div className="adm-side-foot">
            <span className="dot" />
            <span>Member area</span>
          </div>
        </aside>

        <main className="adm-main">
          {loading && <MemberSkeleton />}

          <header className="adm-topbar">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <button
                className="adm-menu-btn adm-iconbtn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={16} />
              </button>
              <div>
                <div className="adm-eyebrow">YEEP Somalia Member</div>
                <h1 className="adm-title">{currentLabel}</h1>
              </div>
            </div>

            <div className="adm-top-right">
              <div className="adm-search">
                <button onClick={() => setCmdkOpen(true)}>
                  <Search size={14} />
                  <span className="stxt">Search or jump to…</span>
                  <span className="kbd">⌘K</span>
                </button>
              </div>
              <button
                className={`adm-toggle${theme === "dark" ? " on" : ""}`}
                onClick={toggle}
                aria-label="Toggle theme"
              >
                <span className="knob">
                  {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
                </span>
              </button>
              <div style={{ position: "relative" }}>
                <button
                  className="adm-bell"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  {notifUnread && <span className="rd" />}
                </button>
                {notifOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 79 }}
                      onClick={() => setNotifOpen(false)}
                    />
                    <div className="adm-notif">
                      <div className="adm-notif-head">
                        <b>Notifications</b>
                        <button onClick={() => setNotifRead(true)}>Mark all read</button>
                      </div>
                      {notifications.slice(0, 6).map((n, i) => (
                        <div
                          key={i}
                          className={`adm-notif-item${notifRead || n.read ? " read" : ""}`}
                        >
                          <span className="nd" />
                          <div>
                            <div className="ntxt">{n.text}</div>
                            {n.time && <div className="ntime">{n.time}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="adm-profile">
                {user?.avatar ? (
                  <img
                    className="adm-avatar"
                    src={img(user.avatar, "w=76&h=76&fit=crop&auto=format")}
                    alt=""
                  />
                ) : (
                  <span className="adm-avatar">{initials(user?.name)}</span>
                )}
                <div>
                  <div className="nm">{user?.name}</div>
                  <div className="rl">{roleLabel(user?.role)}</div>
                </div>
              </div>
            </div>
          </header>

          {active === "dashboard" && renderDashboard()}
          {active === "profile" && <AccountCard />}
          {active === "applications" && renderApplications()}
          {active === "notifications" && renderNotifications()}
          {active === "settings" && renderSettings()}
        </main>
      </div>

      {sidebarOpen && <div className="adm-scrim" onClick={() => setSidebarOpen(false)} />}

      {cmdkOpen && (
        <CommandPalette
          items={navItems.map((n) => ({ id: n.id, label: n.label, icon: n.icon }))}
          onSelect={(id) => {
            goTo(id);
            setToast(`Opened ${navItems.find((n) => n.id === id)?.label ?? id}`);
          }}
          onClose={() => setCmdkOpen(false)}
        />
      )}

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}
