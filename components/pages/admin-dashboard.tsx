"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  FileText,
  FolderOpen,
  Handshake,
  ImagePlus,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Newspaper,
  Plus,
  Quote,
  Search,
  Settings,
  Star,
  Sun,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useAuth, type AuthUser } from "@/components/auth-context";
import { useCollection, useResource } from "@/lib/client/hooks";
import { api, ApiError } from "@/lib/client/api";
import { img } from "@/lib/client/img";
import { formatDateShort } from "@/lib/client/format";
import { roleLabel } from "@/lib/roles";
import { uploadImage } from "@/lib/client/upload";
import { useAdminTheme } from "@/components/admin/use-admin-theme";
import { GrowthChart, Donut } from "@/components/admin/charts";
import { CommandPalette } from "@/components/admin/command-palette";
import type {
  AdminDashboardData,
  AdminUser,
  Program,
  Project,
  EventItem,
  Article,
  VolunteerApplication,
  GalleryItem,
  TeamMember,
  Testimonial,
  Partner,
  EventRegistrationList,
  ContactMessage,
  NotificationItem,
  Report,
  VolunteerHoursEntry,
} from "@/lib/types";

/* ------------------------------- constants ------------------------------- */

/** `adminOnly` items are hidden from `staff`. */
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Users", id: "users", adminOnly: true },
  { icon: UserCheck, label: "Volunteers", id: "volunteers" },
  { icon: Clock, label: "Hours", id: "hours" },
  { icon: Inbox, label: "Messages", id: "messages" },
  { icon: FolderOpen, label: "Projects", id: "projects" },
  { icon: BookOpen, label: "Programs", id: "programs" },
  { icon: Calendar, label: "Events", id: "events" },
  { icon: Newspaper, label: "News", id: "news" },
  { icon: Images, label: "Gallery", id: "gallery" },
  { icon: UserCheck, label: "Team", id: "team" },
  { icon: Quote, label: "Testimonials", id: "testimonials" },
  { icon: Handshake, label: "Partners", id: "partners" },
  { icon: FileText, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const galleryCategories = ["Programs", "Events", "Community", "Volunteers"];

// All 18 federal member state regions (gobollada) of Somalia.
const regions = [
  "Awdal",
  "Bakool",
  "Banaadir",
  "Bari",
  "Bay",
  "Galguduud",
  "Gedo",
  "Hiiraan",
  "Jubbada Dhexe",
  "Jubbada Hoose",
  "Mudug",
  "Nugaal",
  "Sanaag",
  "Shabeellaha Dhexe",
  "Shabeellaha Hoose",
  "Sool",
  "Togdheer",
  "Woqooyi Galbeed",
];
const programCategories = [
  "Education",
  "Skills",
  "Leadership",
  "Health",
  "Arts",
  "Vocational",
  "Digital Literacy",
  "Entrepreneurship",
];
const newsCategories = [
  "Events",
  "Impact",
  "Education",
  "Partnerships",
  "Stories",
  "Funding",
  "Programs",
  "News",
];

/* --------------------------------- helpers ------------------------------- */

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const STATUS_VARIANT: Record<string, string> = {
  Ongoing: "blue",
  Active: "green",
  Completed: "green",
  Published: "green",
  Approved: "green",
  Open: "teal",
  Enrolling: "amber",
  Planned: "amber",
  Pending: "amber",
  "Under Review": "blue",
  Draft: "",
  Paused: "",
  Full: "red",
  Rejected: "red",
};

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_VARIANT[status] ?? "";
  return <span className={`adm-badge${v ? ` adm-badge-${v}` : ""}`}>{status}</span>;
}

function roleBadge(role?: string) {
  const v = role === "admin" ? "violet" : role === "staff" ? "blue" : "teal";
  return `adm-badge adm-badge-${v}`;
}

function activityIcon(type: string) {
  const map: Record<string, React.ReactNode> = {
    volunteer: <UserCheck size={14} />,
    event: <Calendar size={14} />,
    news: <Newspaper size={14} />,
    project: <FolderOpen size={14} />,
  };
  return map[type] ?? <Activity size={14} />;
}

function Loading({ label }: { label: string }) {
  return (
    <div className="adm-loading">
      <Loader2 size={22} className="adm-spin" />
      {label}
    </div>
  );
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

function SectionHead({ sub, action }: { sub?: string; action?: React.ReactNode }) {
  return (
    <div className="adm-sechead">
      <div className="sub">{sub}</div>
      {action}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="adm-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span className="thumb" />
      {label && <span style={{ fontSize: 13, color: "var(--sub)", marginLeft: 10 }}>{label}</span>}
    </label>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="adm-label">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" role="dialog" aria-label={title}>
        <div className="adm-modal-head">
          <h3>{title}</h3>
          <button className="adm-iact" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
      </div>
    </div>
  );
}

function SavedState({ label }: { label: string }) {
  return (
    <div className="adm-saved">
      <span className="ring">
        <CheckCircle size={30} />
      </span>
      <p>{label}</p>
    </div>
  );
}

/** Image picker used by every content modal. Uploads to ImageKit and stores
 *  the delivery URL (falls back to a data URL when uploads aren't configured). */
function ImageField({
  value,
  onChange,
  label = "Cover Image",
  shape = "cover",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  shape?: "cover" | "square";
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadImage(file, "content", shape));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Could not upload that image.");
    } finally {
      setBusy(false);
    }
  };

  const params =
    shape === "square" ? "w=160&h=160&fit=crop&auto=format" : "w=256&h=160&fit=crop&auto=format";

  return (
    <Field label={label}>
      <input ref={ref} type="file" accept="image/*" hidden onChange={onFile} />
      <div className="adm-imgfield">
        <div className={`preview ${shape}`}>
          {value ? <img src={img(value, params)} alt="" /> : <ImagePlus size={20} />}
        </div>
        <div className="meta">
          <button
            type="button"
            className="adm-btn adm-btn-sm"
            onClick={() => ref.current?.click()}
            disabled={busy}
          >
            {busy ? <Loader2 size={12} className="adm-spin" /> : <ImagePlus size={12} />}
            {value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button type="button" className="adm-chipbtn" onClick={() => onChange("")}>
              Remove
            </button>
          )}
          <span>JPG or PNG · resized to {shape === "square" ? "512×512" : "1024×576"}</span>
          {err && <span className="adm-msg-err">{err}</span>}
        </div>
      </div>
    </Field>
  );
}

function AdminAccountCard() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarBusy(true);
    setAvatarMsg(null);
    try {
      const url = await uploadImage(file, "avatar");
      const res = await api.patch<AuthUser>("/auth/me", { avatar: url });
      updateUser(res.data);
      setAvatarMsg("Photo updated.");
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setAvatarBusy(false);
    }
  };

  const submitPwd = async (e: React.FormEvent) => {
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
    <div className="adm-panel adm-panel-p" style={{ maxWidth: 560 }}>
      <h3 style={{ fontSize: 15.5, marginBottom: 18 }}>My Account</h3>
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
              referrerPolicy="no-referrer"
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
          {avatarMsg && (
            <p className="adm-msg-ok" style={{ marginTop: 6 }}>
              {avatarMsg}
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={submitPwd}
        style={{
          marginTop: 22,
          paddingTop: 18,
          borderTop: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <KeyRound size={15} style={{ color: "var(--teal-deep)" }} />
          <h4 style={{ fontSize: 14 }}>Change password</h4>
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
    </div>
  );
}

function DashboardSkeleton() {
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

function StatModal({
  which,
  data,
  onClose,
}: {
  which: string;
  data: AdminDashboardData;
  onClose: () => void;
}) {
  const k = data.kpis;
  const cfg: Record<
    string,
    { title: string; sub: string; bars: { label: string; value: number }[]; note: string }
  > = {
    users: {
      title: "Total Users",
      sub: `${k.totalUsers.toLocaleString()} accounts · ${k.activeVolunteers} active volunteers`,
      bars: data.userGrowth.map((g) => ({ label: g.month, value: g.users })),
      note: "Cumulative registrations by month.",
    },
    programs: {
      title: "Active Programs",
      sub: `${k.activePrograms} running across ${data.programDist.length} focus areas`,
      bars: data.programDist.map((p) => ({ label: p.name, value: p.value })),
      note: "Share of programs by focus area.",
    },
    hours: {
      title: "Volunteer Hours",
      sub: `${k.volunteerHours.toLocaleString()} hours logged (estimated)`,
      bars: [
        { label: "Active vols", value: k.activeVolunteers },
        { label: "Pending", value: k.pendingApplications },
      ],
      note: "Estimated from active volunteers and their average commitment.",
    },
    events: {
      title: "Events",
      sub: `${k.events} total · ${k.upcomingEvents} upcoming`,
      bars: [
        { label: "Past", value: Math.max(0, k.events - k.upcomingEvents) },
        { label: "Upcoming", value: k.upcomingEvents },
      ],
      note: `${k.upcomingEvents} event${k.upcomingEvents === 1 ? "" : "s"} still to come.`,
    },
  };
  const c = cfg[which];
  if (!c) return null;
  const bars = c.bars.slice(0, 8);
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal sm">
        <div className="adm-modal-head">
          <h3>{c.title}</h3>
          <button className="adm-iact" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-modal-note" style={{ marginTop: -4 }}>
            {c.sub}
          </div>
          {bars.length > 0 && (
            <div className="adm-modal-bars">
              {bars.map((b, i) => (
                <div key={i} className="b" style={{ height: `${(b.value / max) * 100}%` }}>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          )}
          <div className="adm-modal-note">{c.note}</div>
        </div>
      </div>
    </div>
  );
}

function registrantsCsv(data: EventRegistrationList): string {
  const rows = [
    ["Name", "Email", "Phone", "Registered"],
    ...data.registrations.map((r) => [
      r.user.name,
      r.user.email,
      r.user.phone ?? "",
      new Date(r.registeredAt).toISOString(),
    ]),
  ];
  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
}

/** Staff view of everyone registered for one event. */
function RegistrantsModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const { data, loading, error } = useResource<EventRegistrationList>(
    `/events/${eventId}/registrations`,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" role="dialog" aria-label="Event registrations">
        <div className="adm-modal-head">
          <h3>{data ? `${data.event.title} — Registrations` : "Registrations"}</h3>
          <button className="adm-iact" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="adm-modal-body">
          {loading && <Loading label="Loading registrations…" />}
          {error && <div className="adm-msg-err">{error}</div>}
          {data && (
            <>
              <div className="adm-modal-note" style={{ marginTop: -4 }}>
                {data.registrations.length} registered
                {data.event.capacity ? ` · ${data.event.capacity} capacity` : ""}
                {data.event.dateLabel ? ` · ${data.event.dateLabel}` : ""}
              </div>

              {data.registrations.length === 0 ? (
                <div className="adm-empty">Nobody has registered yet.</div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {data.registrations.map((r) => (
                      <div key={r._id} className="adm-activity">
                        {r.user.avatar ? (
                          <img
                            className="adm-thumb round"
                            src={img(r.user.avatar, "w=68&h=68&fit=crop&auto=format")}
                            alt=""
                          />
                        ) : (
                          <span className="adm-thumb-ph">{initials(r.user.name)}</span>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="txt">{r.user.name}</div>
                          <div className="time">
                            {r.user.email}
                            {r.user.phone ? ` · ${r.user.phone}` : ""}
                          </div>
                        </div>
                        <span className="time" style={{ flexShrink: 0 }}>
                          {formatDateShort(r.registeredAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    className="adm-btn adm-btn-sm"
                    style={{ alignSelf: "flex-start" }}
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(registrantsCsv(data))}`}
                    download={`${data.event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-registrations.csv`}
                  >
                    Export CSV
                  </a>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const MSG_STATUS_VARIANT: Record<string, string> = {
  New: "amber",
  Read: "blue",
  Replied: "green",
  Archived: "",
};

/** Read one contact message and act on it (reply / mark replied / archive). */
function MessageModal({
  message,
  onClose,
  onChanged,
}: {
  message: ContactMessage;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState(message.status);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    // Opening a "New" message marks it "Read" server-side.
    if (message.status === "New") {
      api
        .get(`/contact/${message._id}`)
        .then(() => onChanged())
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMsgStatus = async (next: "Replied" | "Archived") => {
    setBusy(true);
    try {
      await api.patch(`/contact/${message._id}/status`, { status: next });
      setStatus(next);
      onChanged();
    } catch {
      /* leave as-is */
    } finally {
      setBusy(false);
    }
  };

  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`;

  return (
    <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" role="dialog" aria-label="Contact message">
        <div className="adm-modal-head">
          <h3>{message.subject}</h3>
          <button className="adm-iact" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="adm-modal-body">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginTop: -4,
            }}
          >
            <span className="adm-t-name">
              {message.name}
              <div className="em">{message.email}</div>
            </span>
            <span
              className={`adm-badge${
                MSG_STATUS_VARIANT[status] ? ` adm-badge-${MSG_STATUS_VARIANT[status]}` : ""
              }`}
              style={{ marginLeft: "auto" }}
            >
              {status}
            </span>
          </div>
          <div className="adm-modal-note" style={{ marginTop: -6 }}>
            {formatDateShort(message.createdAt)}
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink)",
              whiteSpace: "pre-wrap",
              background: "var(--bg)",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            {message.message}
          </div>
          <div className="adm-modal-foot">
            <a className="adm-btn adm-btn-primary" href={mailto} style={{ flex: 1 }}>
              Reply by email
            </a>
            <button
              className="adm-btn"
              onClick={() => setMsgStatus("Replied")}
              disabled={busy || status === "Replied"}
            >
              Mark replied
            </button>
            <button
              className="adm-btn"
              onClick={() => setMsgStatus("Archived")}
              disabled={busy || status === "Archived"}
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== main component =========================== */

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [statModal, setStatModal] = useState<string | null>(null);
  const [registrantsFor, setRegistrantsFor] = useState<string | null>(null);
  const [openMessage, setOpenMessage] = useState<ContactMessage | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [range, setRange] = useState<"Year" | "Quarter" | "Month">("Year");

  const { theme, toggle } = useAdminTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";
  const visibleNav = navItems.filter((i) => isAdmin || !i.adminOnly);
  const currentLabel = navItems.find((n) => n.id === active)?.label ?? "Dashboard";

  const dashboard = useResource<AdminDashboardData>(
    active === "dashboard" ? "/dashboard/admin" : null,
  );
  const notifFeed = useResource<{ items: NotificationItem[]; unread: number }>("/notifications");
  const users = useCollection<AdminUser>(active === "users" ? "/users" : null, { limit: 100 });
  const volunteers = useCollection<VolunteerApplication>(
    active === "volunteers" ? "/volunteers" : null,
    { limit: 100 },
  );
  const messages = useCollection<ContactMessage>(active === "messages" ? "/contact" : null, {
    limit: 100,
  });
  const hours = useCollection<VolunteerHoursEntry>(
    active === "hours" ? "/volunteer-hours" : null,
    { limit: 200 },
  );
  // Sidebar badge counts — kept loaded regardless of the active tab.
  const unreadMessages = useCollection<ContactMessage>("/contact", {
    status: "New",
    limit: 100,
  });
  const newMsgCount = unreadMessages.data.length;
  const pendingVolunteers = useCollection<VolunteerApplication>("/volunteers", {
    status: "Pending",
    limit: 100,
  });
  const pendingVolCount = pendingVolunteers.data.length;
  const projects = useCollection<Project>(active === "projects" ? "/projects" : null, {
    limit: 100,
  });
  const programs = useCollection<Program>(active === "programs" ? "/programs" : null, {
    limit: 100,
  });
  const events = useCollection<EventItem>(active === "events" ? "/events" : null, { limit: 100 });
  const news = useCollection<Article>(active === "news" ? "/news" : null, { limit: 100 });
  const gallery = useCollection<GalleryItem>(active === "gallery" ? "/gallery" : null, {
    limit: 100,
  });
  const team = useCollection<TeamMember>(active === "team" ? "/team" : null, { limit: 100 });
  const testimonials = useCollection<Testimonial>(
    active === "testimonials" ? "/testimonials" : null,
    { limit: 100 },
  );
  const partners = useCollection<Partner>(active === "partners" ? "/partners" : null, {
    limit: 100,
  });
  const reports = useCollection<Report>(active === "reports" ? "/reports" : null, { limit: 100 });

  const [modal, setModal] = useState<
    | null
    | "project"
    | "program"
    | "event"
    | "news"
    | "user"
    | "gallery"
    | "team"
    | "testimonial"
    | "partner"
    | "report"
  >(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // One id shared by all content modals — only one is ever open at a time.
  // null = the modal is in "create" mode.
  const [editId, setEditId] = useState<string | null>(null);

  const emptyProjForm = {
    title: "",
    description: "",
    region: "",
    district: "",
    budget: "",
    status: "Ongoing",
    startDate: "",
    targetBeneficiaries: "",
    fundedBy: "",
    partners: "",
    image: "",
    progress: "0",
  };
  const emptyProgForm = {
    title: "",
    description: "",
    category: "",
    region: "",
    status: "Active",
    targetBeneficiaries: "",
    startDate: "",
    endDate: "",
    duration: "",
    progress: "0",
    image: "",
    isFeatured: false,
  };
  const emptyEvtForm = {
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    region: "",
    capacity: "",
    registrationDeadline: "",
    image: "",
    isFeatured: false,
  };
  const emptyNewsForm = {
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    status: "Draft",
    tags: "",
    image: "",
    isFeatured: false,
  };
  const emptyGalleryForm = {
    image: "",
    type: "image",
    videoUrl: "",
    category: "Programs",
    caption: "",
    order: "",
  };
  const emptyTeamForm = { name: "", role: "", image: "", bio: "", order: "", active: true };
  const emptyTestimonialForm = {
    name: "",
    role: "",
    text: "",
    image: "",
    rating: "5",
    placement: "home",
    order: "",
  };
  const emptyPartnerForm = { name: "", logo: "", website: "", order: "" };
  const emptyReportForm = {
    kind: "Annual Report",
    title: "",
    year: "",
    fileUrl: "",
    summary: "",
    fileSize: "",
    published: true,
    order: "",
  };

  const [projForm, setProjForm] = useState(emptyProjForm);
  const [progForm, setProgForm] = useState(emptyProgForm);
  const [evtForm, setEvtForm] = useState(emptyEvtForm);
  const [newsForm, setNewsForm] = useState(emptyNewsForm);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [teamForm, setTeamForm] = useState(emptyTeamForm);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm);
  const [partnerForm, setPartnerForm] = useState(emptyPartnerForm);
  const [reportForm, setReportForm] = useState(emptyReportForm);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "volunteer",
    isActive: true,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((o) => !o);
      } else if (e.key === "Escape") {
        setStatModal(null);
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

  // Near-real-time badge counts: re-poll every 30s and whenever the tab
  // regains focus, plus refresh the open list if it's messages/volunteers.
  const refreshMsg = unreadMessages.refetch;
  const refreshVol = pendingVolunteers.refetch;
  const refreshMsgList = messages.refetch;
  const refreshVolList = volunteers.refetch;
  const refreshNotifs = notifFeed.refetch;
  useEffect(() => {
    const tick = () => {
      refreshMsg();
      refreshVol();
      refreshNotifs();
      if (active === "messages") refreshMsgList();
      if (active === "volunteers") refreshVolList();
    };
    const id = setInterval(tick, 30_000);
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active, refreshMsg, refreshVol, refreshMsgList, refreshVolList, refreshNotifs]);

  function goTo(id: string) {
    setActive(id);
    setSidebarOpen(false);
    setCmdkOpen(false);
    setNotifOpen(false);
  }

  function openProjectModal(p?: Project) {
    setEditId(p?._id ?? null);
    setProjForm(
      p
        ? {
            title: p.title,
            description: p.description ?? "",
            region: p.region ?? "",
            district: p.district ?? "",
            budget: p.budget ? String(p.budget) : "",
            status: p.status,
            startDate: p.startDate ? p.startDate.slice(0, 10) : "",
            targetBeneficiaries: p.beneficiaries ? String(p.beneficiaries) : "",
            fundedBy: p.fundedBy ?? "",
            partners: p.partners ?? "",
            image: p.image ?? "",
            progress: String(p.progress ?? 0),
          }
        : emptyProjForm,
    );
    setFormError(null);
    setModal("project");
  }

  function openProgramModal(p?: Program) {
    setEditId(p?._id ?? null);
    setProgForm(
      p
        ? {
            title: p.title,
            description: p.description ?? "",
            category: p.category ?? "",
            region: p.region ?? "",
            status: p.status ?? "Active",
            targetBeneficiaries: p.beneficiaries ? String(p.beneficiaries) : "",
            startDate: "",
            endDate: "",
            duration: p.duration ?? "",
            progress: String(p.progress ?? 0),
            image: p.image ?? "",
            isFeatured: !!p.featured,
          }
        : emptyProgForm,
    );
    setFormError(null);
    setModal("program");
  }

  function openEventModal(ev?: EventItem) {
    setEditId(ev?._id ?? null);
    setEvtForm(
      ev
        ? {
            title: ev.title,
            description: ev.description ?? "",
            date: ev.startDate ? ev.startDate.slice(0, 10) : "",
            endDate: ev.endDate ? ev.endDate.slice(0, 10) : "",
            location: ev.location ?? "",
            region: ev.region ?? "",
            capacity: ev.capacity ? String(ev.capacity) : "",
            registrationDeadline: ev.registrationDeadline
              ? ev.registrationDeadline.slice(0, 10)
              : "",
            image: ev.image ?? "",
            isFeatured: !!ev.featured,
          }
        : emptyEvtForm,
    );
    setFormError(null);
    setModal("event");
  }

  function openNewsModal(n?: Article) {
    setEditId(n?._id ?? null);
    setNewsForm(
      n
        ? {
            title: n.title,
            excerpt: n.excerpt ?? "",
            content: n.content ?? "",
            category: n.category ?? "",
            author: n.author ?? "",
            status: n.published ? "Published" : "Draft",
            tags: Array.isArray(n.tags) ? n.tags.join(", ") : "",
            image: n.image ?? "",
            isFeatured: !!n.featured,
          }
        : emptyNewsForm,
    );
    setFormError(null);
    setModal("news");
  }

  function openGalleryModal(g?: GalleryItem) {
    setEditId(g?._id ?? null);
    setGalleryForm(
      g
        ? {
            image: g.image ?? "",
            type: g.type ?? "image",
            videoUrl: g.videoUrl ?? "",
            category: g.category ?? "Programs",
            caption: g.caption ?? "",
            order: g.order != null ? String(g.order) : "",
          }
        : emptyGalleryForm,
    );
    setFormError(null);
    setModal("gallery");
  }

  function openTeamModal(t?: TeamMember) {
    setEditId(t?._id ?? null);
    setTeamForm(
      t
        ? {
            name: t.name,
            role: t.role,
            image: t.image ?? "",
            bio: t.bio ?? "",
            order: t.order != null ? String(t.order) : "",
            active: t.active ?? true,
          }
        : emptyTeamForm,
    );
    setFormError(null);
    setModal("team");
  }

  function openTestimonialModal(t?: Testimonial) {
    setEditId(t?._id ?? null);
    setTestimonialForm(
      t
        ? {
            name: t.name,
            role: t.role ?? "",
            text: t.text,
            image: t.image ?? "",
            rating: String(t.rating ?? 5),
            placement: t.placement ?? "home",
            order: t.order != null ? String(t.order) : "",
          }
        : emptyTestimonialForm,
    );
    setFormError(null);
    setModal("testimonial");
  }

  function openPartnerModal(p?: Partner) {
    setEditId(p?._id ?? null);
    setPartnerForm(
      p
        ? {
            name: p.name,
            logo: p.logo ?? "",
            website: p.website ?? "",
            order: p.order != null ? String(p.order) : "",
          }
        : emptyPartnerForm,
    );
    setFormError(null);
    setModal("partner");
  }

  function openReportModal(r?: Report) {
    setEditId(r?._id ?? null);
    setReportForm(
      r
        ? {
            kind: r.kind ?? "Annual Report",
            title: r.title,
            year: r.year ?? "",
            fileUrl: r.fileUrl,
            summary: r.summary ?? "",
            fileSize: r.fileSize ?? "",
            published: r.published ?? true,
            order: r.order != null ? String(r.order) : "",
          }
        : emptyReportForm,
    );
    setFormError(null);
    setModal("report");
  }

  const closeModal = () => {
    setModal(null);
    setSaved(false);
    setFormError(null);
    setSubmitting(false);
    setEditId(null);
    setProjForm(emptyProjForm);
    setProgForm(emptyProgForm);
    setEvtForm(emptyEvtForm);
    setNewsForm(emptyNewsForm);
    setGalleryForm(emptyGalleryForm);
    setTeamForm(emptyTeamForm);
    setTestimonialForm(emptyTestimonialForm);
    setPartnerForm(emptyPartnerForm);
  };

  async function submit(fn: () => Promise<void>, refetch: () => void) {
    setSubmitting(true);
    setFormError(null);
    try {
      await fn();
      setSaved(true);
      refetch();
      setTimeout(closeModal, 1200);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleSaveProject = () =>
    submit(async () => {
      const payload = {
        title: projForm.title,
        description: projForm.description || undefined,
        region: projForm.region || undefined,
        district: projForm.district || undefined,
        budget: projForm.budget ? Number(projForm.budget) : undefined,
        status: projForm.status,
        startDate: projForm.startDate || undefined,
        beneficiaries: projForm.targetBeneficiaries
          ? Number(projForm.targetBeneficiaries)
          : undefined,
        progress:
          projForm.progress === ""
            ? undefined
            : Math.max(0, Math.min(100, Number(projForm.progress))),
        image: projForm.image || undefined,
        fundedBy: projForm.fundedBy || undefined,
        partners: projForm.partners || undefined,
      };
      if (editId) await api.patch(`/projects/${editId}`, payload);
      else await api.post("/projects", payload);
    }, projects.refetch);

  const handleSaveProgram = () =>
    submit(async () => {
      const payload = {
        title: progForm.title,
        description: progForm.description || undefined,
        category: progForm.category,
        region: progForm.region || undefined,
        status: progForm.status,
        beneficiaries: progForm.targetBeneficiaries
          ? Number(progForm.targetBeneficiaries)
          : undefined,
        progress:
          progForm.progress === ""
            ? undefined
            : Math.max(0, Math.min(100, Number(progForm.progress))),
        duration: progForm.duration || undefined,
        image: progForm.image || undefined,
        featured: progForm.isFeatured,
      };
      if (editId) await api.patch(`/programs/${editId}`, payload);
      else await api.post("/programs", payload);
    }, programs.refetch);

  const handleSaveEvent = () =>
    submit(async () => {
      const payload = {
        title: evtForm.title,
        description: evtForm.description || undefined,
        startDate: evtForm.date,
        endDate: evtForm.endDate || undefined,
        dateLabel: evtForm.date
          ? new Date(evtForm.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : undefined,
        month: evtForm.date
          ? new Date(evtForm.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : undefined,
        location: evtForm.location || undefined,
        region: evtForm.region || undefined,
        capacity: evtForm.capacity ? Number(evtForm.capacity) : undefined,
        registrationDeadline: evtForm.registrationDeadline || undefined,
        image: evtForm.image || undefined,
        featured: evtForm.isFeatured,
      };
      if (editId) await api.patch(`/events/${editId}`, payload);
      else await api.post("/events", payload);
    }, events.refetch);

  const handleSaveNews = () =>
    submit(async () => {
      const payload = {
        title: newsForm.title,
        excerpt: newsForm.excerpt || undefined,
        content: newsForm.content || undefined,
        category: newsForm.category || undefined,
        author: newsForm.author || undefined,
        published: newsForm.status === "Published",
        tags: newsForm.tags
          ? newsForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        image: newsForm.image || undefined,
        featured: newsForm.isFeatured,
      };
      if (editId) await api.patch(`/news/${editId}`, payload);
      else await api.post("/news", payload);
    }, news.refetch);

  const handleSaveGallery = () =>
    submit(async () => {
      const payload = {
        image: galleryForm.image,
        type: galleryForm.type,
        videoUrl: galleryForm.type === "video" ? galleryForm.videoUrl || undefined : undefined,
        category: galleryForm.category,
        caption: galleryForm.caption || undefined,
        order: galleryForm.order === "" ? undefined : Number(galleryForm.order),
      };
      if (editId) await api.patch(`/gallery/${editId}`, payload);
      else await api.post("/gallery", payload);
    }, gallery.refetch);

  const handleSaveTeam = () =>
    submit(async () => {
      const payload = {
        name: teamForm.name,
        role: teamForm.role,
        image: teamForm.image || undefined,
        bio: teamForm.bio || undefined,
        order: teamForm.order === "" ? undefined : Number(teamForm.order),
        active: teamForm.active,
      };
      if (editId) await api.patch(`/team/${editId}`, payload);
      else await api.post("/team", payload);
    }, team.refetch);

  const handleSaveTestimonial = () =>
    submit(async () => {
      const payload = {
        name: testimonialForm.name,
        role: testimonialForm.role || undefined,
        text: testimonialForm.text,
        image: testimonialForm.image || undefined,
        rating:
          testimonialForm.rating === ""
            ? undefined
            : Math.max(1, Math.min(5, Number(testimonialForm.rating))),
        placement: testimonialForm.placement,
        order: testimonialForm.order === "" ? undefined : Number(testimonialForm.order),
      };
      if (editId) await api.patch(`/testimonials/${editId}`, payload);
      else await api.post("/testimonials", payload);
    }, testimonials.refetch);

  const handleSavePartner = () =>
    submit(async () => {
      const payload = {
        name: partnerForm.name,
        logo: partnerForm.logo || undefined,
        website: partnerForm.website || undefined,
        order: partnerForm.order === "" ? undefined : Number(partnerForm.order),
      };
      if (editId) await api.patch(`/partners/${editId}`, payload);
      else await api.post("/partners", payload);
    }, partners.refetch);

  const handleSaveReport = () =>
    submit(async () => {
      const payload = {
        kind: reportForm.kind,
        title: reportForm.title,
        year: reportForm.year || undefined,
        fileUrl: reportForm.fileUrl,
        summary: reportForm.summary || undefined,
        fileSize: reportForm.fileSize || undefined,
        published: reportForm.published,
        order: reportForm.order === "" ? undefined : Number(reportForm.order),
      };
      if (editId) await api.patch(`/reports/${editId}`, payload);
      else await api.post("/reports", payload);
    }, reports.refetch);

  const handleSaveUser = () =>
    submit(async () => {
      await api.post("/users", {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone || undefined,
        role: userForm.role,
        isActive: userForm.isActive,
      });
      setUserForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "volunteer",
        isActive: true,
      });
    }, users.refetch);

  async function remove(path: string, refetch: () => void) {
    try {
      await api.del(path);
      refetch();
    } catch {
      /* ignore — row stays */
    }
  }

  async function patchUser(id: string, body: Record<string, unknown>) {
    try {
      await api.patch(`/users/${id}`, body);
      users.refetch();
    } catch {
      /* ignore */
    }
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  /* --------------------------- derived: dashboard ------------------------ */

  const k = dashboard.data?.kpis;
  const statCards = k
    ? [
        {
          key: "users",
          icon: Users,
          tint: "var(--teal-tint)",
          fg: "var(--teal-deep)",
          value: k.totalUsers.toLocaleString(),
          label: "Total Users",
          tag: `${k.activeVolunteers} volunteers`,
        },
        {
          key: "programs",
          icon: BookOpen,
          tint: "var(--green-tint)",
          fg: "var(--green)",
          value: String(k.activePrograms),
          label: "Active Programs",
          tag: "live",
        },
        {
          key: "hours",
          icon: Clock,
          tint: "var(--amber-tint)",
          fg: "var(--amber)",
          value: k.volunteerHours.toLocaleString(),
          label: "Volunteer Hours",
          tag: "est.",
        },
        {
          key: "events",
          icon: Calendar,
          tint: "var(--violet-tint)",
          fg: "var(--violet)",
          value: String(k.events),
          label: "Events",
          tag: `${k.upcomingEvents} upcoming`,
        },
      ]
    : [];

  const growth = dashboard.data?.userGrowth ?? [];
  const growthSlice =
    range === "Year" ? growth : range === "Quarter" ? growth.slice(-3) : growth.slice(-1);
  const rangeLabel =
    range === "Year" ? "this year" : range === "Quarter" ? "last 3 months" : "this month";

  const notifs = notifFeed.data?.items ?? [];
  const notifUnreadCount = notifFeed.data?.unread ?? 0;

  const markNotifsRead = () => {
    if (notifUnreadCount === 0) return;
    void api.patch("/notifications").then(() => notifFeed.refetch());
  };

  const adminCount = users.data.filter((u) => u.role === "admin").length;
  const staffCount = users.data.filter((u) => u.role === "staff").length;

  /* -------------------------------- sections ---------------------------- */

  const renderDashboard = () => (
    <>
      {dashboard.error && <ErrorBox message={dashboard.error} onRetry={dashboard.refetch} />}
      {dashboard.data && (
        <>
          <div className="adm-stats">
            {statCards.map((s) => (
              <button key={s.key} className="adm-stat" onClick={() => setStatModal(s.key)}>
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
                <div className="hint">Click for breakdown →</div>
              </button>
            ))}
          </div>

          <div className="adm-row-2">
            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>User Growth</h3>
                  <div className="sub">Cumulative registrations · {rangeLabel}</div>
                </div>
                <div className="adm-range">
                  {(["Year", "Quarter", "Month"] as const).map((r) => (
                    <button
                      key={r}
                      className={range === r ? "active" : ""}
                      onClick={() => setRange(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <GrowthChart data={growthSlice} />
            </div>

            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Program Distribution</h3>
                  <div className="sub">By focus area</div>
                </div>
              </div>
              <Donut data={dashboard.data.programDist} />
            </div>
          </div>

          <div className="adm-row-lower">
            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Recent Activity</h3>
                </div>
              </div>
              {dashboard.data.recentActivity.map((a, i) => (
                <div key={i} className="adm-activity">
                  <span className="ic">{activityIcon(a.type)}</span>
                  <div>
                    <div className="txt">{a.text}</div>
                    <div className="time">{a.time}</div>
                  </div>
                </div>
              ))}
              {dashboard.data.recentActivity.length === 0 && (
                <div className="adm-empty">Nothing has happened recently.</div>
              )}
            </div>

            <div className="adm-panel adm-panel-p">
              <div className="adm-phead">
                <div>
                  <h3>Quick Actions</h3>
                </div>
              </div>
              <button className="adm-qa" onClick={() => goTo("volunteers")}>
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--teal-tint)", color: "var(--teal-deep)" }}
                  >
                    <UserCheck size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Review volunteer applications
                    </span>
                    <span className="ct">{dashboard.data.kpis.pendingApplications} pending</span>
                  </span>
                </span>
                <ChevronRight size={15} style={{ color: "var(--sub)" }} />
              </button>
              <button className="adm-qa" onClick={() => goTo("programs")}>
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--green-tint)", color: "var(--green)" }}
                  >
                    <BookOpen size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Manage programs
                    </span>
                    <span className="ct">{dashboard.data.kpis.activePrograms} active</span>
                  </span>
                </span>
                <ChevronRight size={15} style={{ color: "var(--sub)" }} />
              </button>
              <button className="adm-qa" onClick={() => goTo("events")}>
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--violet-tint)", color: "var(--violet)" }}
                  >
                    <Calendar size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Manage events
                    </span>
                    <span className="ct">{dashboard.data.kpis.upcomingEvents} upcoming</span>
                  </span>
                </span>
                <ChevronRight size={15} style={{ color: "var(--sub)" }} />
              </button>
              <button className="adm-qa" onClick={() => goTo("news")}>
                <span className="l">
                  <span
                    className="qic"
                    style={{ background: "var(--blue-tint)", color: "var(--blue)" }}
                  >
                    <Newspaper size={15} />
                  </span>
                  <span>
                    <span className="lb" style={{ display: "block" }}>
                      Publish a news update
                    </span>
                    <span className="ct">Share the latest story</span>
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

  const renderUsers = () => (
    <div className="adm-panel">
      <div
        className="adm-panel-p"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div>
          <h3 style={{ fontSize: 15.5 }}>User Management</h3>
          <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 3 }}>
            {users.data.length} accounts · {adminCount} admins · {staffCount} staff
          </div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setModal("user")}>
          <Plus size={15} /> Add user
        </button>
      </div>
      {users.loading ? (
        <Loading label="Loading users…" />
      ) : users.error ? (
        <ErrorBox message={users.error} onRetry={users.refetch} />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="adm-cellmain">
                      {u.avatar ? (
                        <img
                          className="adm-thumb round"
                          src={img(u.avatar, "w=68&h=68&fit=crop&auto=format")}
                          alt=""
                        />
                      ) : (
                        <span className="adm-thumb-ph" style={{ borderRadius: "50%" }}>
                          {initials(u.name)}
                        </span>
                      )}
                      <div className="adm-t-name">
                        {u.name}
                        <div className="em">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={roleBadge(u.role)}>{roleLabel(u.role)}</span>
                  </td>
                  <td>
                    <span className={`adm-badge${u.isActive ? " adm-badge-green" : ""}`}>
                      <span className="bdot" />
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ color: "var(--sub)" }}>{formatDateShort(u.createdAt)}</td>
                  <td>
                    {u._id === user?._id ? (
                      <span style={{ fontSize: 12, color: "var(--sub)", fontStyle: "italic" }}>
                        You
                      </span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select
                          className="adm-input-inline"
                          value={u.role}
                          onChange={(e) => patchUser(u._id, { role: e.target.value })}
                        >
                          <option value="volunteer">Volunteer</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Administrator</option>
                        </select>
                        <button
                          className="adm-chipbtn"
                          onClick={() => patchUser(u._id, { isActive: !u.isActive })}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="adm-iact danger"
                          onClick={() => remove(`/users/${u._id}`, users.refetch)}
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.data.length === 0 && <div className="adm-empty">No users yet.</div>}
          <div className="adm-tfoot">Showing {users.data.length} users</div>
        </div>
      )}
    </div>
  );

  const renderVolunteers = () => (
    <div className="adm-panel">
      <div className="adm-panel-p" style={{ borderBottom: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: 15.5 }}>Volunteer Applications</h3>
      </div>
      {volunteers.loading ? (
        <Loading label="Loading applications…" />
      ) : volunteers.error ? (
        <ErrorBox message={volunteers.error} onRetry={volunteers.refetch} />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Availability</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.data.map((v) => (
                <tr key={v._id}>
                  <td>
                    <div className="adm-t-name">
                      {v.name}
                      <div className="em">{v.email}</div>
                    </div>
                  </td>
                  <td>{v.role}</td>
                  <td style={{ color: "var(--sub)" }}>{v.availability || "—"}</td>
                  <td style={{ color: "var(--sub)" }}>{formatDateShort(v.createdAt)}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        className="adm-chipbtn ok"
                        onClick={() =>
                          api
                            .patch(`/volunteers/${v._id}/status`, { status: "Approved" })
                            .then(() => {
                              volunteers.refetch();
                              pendingVolunteers.refetch();
                            })
                            .catch(() => {})
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="adm-chipbtn no"
                        onClick={() =>
                          api
                            .patch(`/volunteers/${v._id}/status`, { status: "Rejected" })
                            .then(() => {
                              volunteers.refetch();
                              pendingVolunteers.refetch();
                            })
                            .catch(() => {})
                        }
                      >
                        Reject
                      </button>
                      {v.status === "Approved" && (
                        <a
                          className="adm-iact"
                          href={`/api/volunteers/${v._id}/certificate`}
                          title="Download certificate"
                        >
                          <Award size={14} />
                        </a>
                      )}
                      <button
                        className="adm-iact danger"
                        onClick={() =>
                          remove(`/volunteers/${v._id}`, () => {
                            volunteers.refetch();
                            pendingVolunteers.refetch();
                          })
                        }
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {volunteers.data.length === 0 && <div className="adm-empty">No applications yet.</div>}
        </div>
      )}
    </div>
  );

  const renderHours = () => {
    const total = hours.data
      .filter((h) => h.status === "Approved")
      .reduce((s, h) => s + h.hours, 0);
    const setStatus = (id: string, status: "Approved" | "Rejected") =>
      api
        .patch(`/volunteer-hours/${id}/status`, { status })
        .then(hours.refetch)
        .catch(() => {});
    return (
      <div className="adm-panel">
        <div className="adm-panel-p" style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 15.5 }}>Volunteer Hours</h3>
          <div className="sub" style={{ fontSize: 12, color: "var(--sub)", marginTop: 3 }}>
            {total} approved hour{total === 1 ? "" : "s"} logged across all members
          </div>
        </div>
        {hours.loading ? (
          <Loading label="Loading time log…" />
        ) : hours.error ? (
          <ErrorBox message={hours.error} onRetry={hours.refetch} />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hours.data.map((h) => (
                  <tr key={h._id}>
                    <td>
                      <div className="adm-t-name">
                        {h.user?.name ?? "—"}
                        <div className="em">{h.user?.email}</div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 260 }}>
                      {h.activity}
                      {h.event && <div className="em">{h.event.title}</div>}
                    </td>
                    <td style={{ color: "var(--sub)" }}>{formatDateShort(h.date)}</td>
                    <td>{h.hours}</td>
                    <td>
                      <StatusBadge status={h.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          className="adm-chipbtn ok"
                          disabled={h.status === "Approved"}
                          onClick={() => setStatus(h._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="adm-chipbtn no"
                          disabled={h.status === "Rejected"}
                          onClick={() => setStatus(h._id, "Rejected")}
                        >
                          Reject
                        </button>
                        <button
                          className="adm-iact danger"
                          onClick={() => remove(`/volunteer-hours/${h._id}`, hours.refetch)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hours.data.length === 0 && (
              <div className="adm-empty">No volunteer hours logged yet.</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => (
    <div className="adm-panel">
      <div className="adm-panel-p" style={{ borderBottom: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: 15.5 }}>Contact Inbox</h3>
        <div className="sub" style={{ fontSize: 12, color: "var(--sub)", marginTop: 3 }}>
          Messages sent through the website contact form
        </div>
      </div>
      {messages.loading ? (
        <Loading label="Loading messages…" />
      ) : messages.error ? (
        <ErrorBox message={messages.error} onRetry={messages.refetch} />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Received</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.data.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div className="adm-t-name">
                      {m.name}
                      <div className="em">{m.email}</div>
                    </div>
                  </td>
                  <td
                    style={{
                      maxWidth: 320,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: m.status === "New" ? 700 : 400,
                    }}
                  >
                    {m.subject}
                  </td>
                  <td style={{ color: "var(--sub)" }}>{formatDateShort(m.createdAt)}</td>
                  <td>
                    <span
                      className={`adm-badge${
                        MSG_STATUS_VARIANT[m.status]
                          ? ` adm-badge-${MSG_STATUS_VARIANT[m.status]}`
                          : ""
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="adm-chipbtn"
                        onClick={() => setOpenMessage(m)}
                        title="Open"
                      >
                        Open
                      </button>
                      <button
                        className="adm-iact danger"
                        onClick={() =>
                          remove(`/contact/${m._id}`, () => {
                            messages.refetch();
                            unreadMessages.refetch();
                          })
                        }
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.data.length === 0 && <div className="adm-empty">No messages yet.</div>}
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${projects.data.length} projects total`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openProjectModal()}>
            <Plus size={15} /> Add project
          </button>
        }
      />
      {!projects.loading && !projects.error && (
        <div className="adm-statmini">
          {[
            { label: "Total", value: projects.data.length },
            {
              label: "Ongoing",
              value: projects.data.filter((p) => p.status === "Ongoing").length,
            },
            {
              label: "Completed",
              value: projects.data.filter((p) => p.status === "Completed").length,
            },
            {
              label: "Planned",
              value: projects.data.filter((p) => p.status === "Planned").length,
            },
          ].map((s) => (
            <div key={s.label}>
              <div className="n">{s.value}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="adm-panel">
        {projects.loading ? (
          <Loading label="Loading projects…" />
        ) : projects.error ? (
          <ErrorBox message={projects.error} onRetry={projects.refetch} />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Region</th>
                  <th>Budget</th>
                  <th>Beneficiaries</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.data.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="adm-cellmain">
                        {p.image ? (
                          <img
                            className="adm-thumb"
                            src={img(p.image, "w=68&h=68&fit=crop&auto=format")}
                            alt=""
                          />
                        ) : (
                          <span className="adm-thumb-ph">
                            <FolderOpen size={14} />
                          </span>
                        )}
                        <span className="adm-t-name">{p.title}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--sub)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={11} /> {p.region || p.location || "—"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--teal-deep)" }}>
                      ${p.budget.toLocaleString()}
                    </td>
                    <td style={{ color: "var(--sub)" }}>{p.beneficiaries.toLocaleString()}</td>
                    <td style={{ minWidth: 120 }}>
                      <div className="adm-progress">
                        <span className="adm-bar">
                          <i style={{ width: `${p.progress}%` }} />
                        </span>
                        <span>{p.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="adm-iact"
                          onClick={() => openProjectModal(p)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="adm-iact danger"
                          onClick={() => remove(`/projects/${p._id}`, projects.refetch)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.data.length === 0 && <div className="adm-empty">No projects yet.</div>}
          </div>
        )}
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${programs.data.length} programs total`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openProgramModal()}>
            <Plus size={15} /> Add program
          </button>
        }
      />
      {programs.loading ? (
        <Loading label="Loading programs…" />
      ) : programs.error ? (
        <ErrorBox message={programs.error} onRetry={programs.refetch} />
      ) : (
        <div className="adm-cardgrid">
          {programs.data.map((p) => (
            <div key={p._id} className="adm-minicard">
              {p.image && (
                <img
                  className="thumb"
                  src={img(p.image, "w=560&h=240&fit=crop&auto=format")}
                  alt=""
                />
              )}
              <div className="body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span className="adm-badge adm-badge-teal">{p.category}</span>
                  <StatusBadge status={p.status} />
                </div>
                <h4 style={{ fontSize: 14 }}>{p.title}</h4>
                <div className="adm-minirow">
                  <MapPin size={11} /> {p.region || "—"}
                </div>
                <div className="adm-minirow">
                  <Users size={11} /> {p.beneficiaries.toLocaleString()} beneficiaries
                </div>
                <div className="adm-minirow">
                  <Clock size={11} /> {p.duration || "—"}
                </div>
                <div className="adm-progress" style={{ marginTop: 2 }}>
                  <span className="adm-bar">
                    <i style={{ width: `${p.progress}%` }} />
                  </span>
                  <span>{p.progress}%</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: "auto",
                    paddingTop: 10,
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <button
                    className="adm-btn adm-btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => openProgramModal(p)}
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    className="adm-btn adm-btn-sm adm-btn-danger"
                    onClick={() => remove(`/programs/${p._id}`, programs.refetch)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="adm-addcard" onClick={() => openProgramModal()}>
            <Plus size={22} />
            Add new program
          </button>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${events.data.length} events scheduled`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openEventModal()}>
            <Plus size={15} /> Add event
          </button>
        }
      />
      <div className="adm-panel">
        {events.loading ? (
          <Loading label="Loading events…" />
        ) : events.error ? (
          <ErrorBox message={events.error} onRetry={events.refetch} />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.data.map((e) => {
                  const full = (e.registered || 0) >= (e.capacity || 0) && e.capacity > 0;
                  const pct = e.capacity
                    ? Math.min(100, Math.round((e.registered / e.capacity) * 100))
                    : 0;
                  return (
                    <tr key={e._id}>
                      <td>
                        <div className="adm-cellmain">
                          {e.image ? (
                            <img
                              className="adm-thumb"
                              src={img(e.image, "w=68&h=68&fit=crop&auto=format")}
                              alt=""
                            />
                          ) : (
                            <span className="adm-thumb-ph">
                              <Calendar size={14} />
                            </span>
                          )}
                          <span className="adm-t-name">{e.title}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--sub)" }}>{e.dateLabel || "—"}</td>
                      <td style={{ color: "var(--sub)" }}>{e.location || "—"}</td>
                      <td style={{ minWidth: 130 }}>
                        <div className="adm-progress">
                          <span className={`adm-bar${full ? " red" : ""}`}>
                            <i style={{ width: `${pct}%` }} />
                          </span>
                          <span>
                            {e.registered}/{e.capacity}
                          </span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={full ? "Full" : "Open"} />
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="adm-iact"
                            onClick={() => setRegistrantsFor(e._id)}
                            title="View registrations"
                          >
                            <Users size={14} />
                          </button>
                          <button
                            className="adm-iact"
                            onClick={() => openEventModal(e)}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="adm-iact danger"
                            onClick={() => remove(`/events/${e._id}`, events.refetch)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {events.data.length === 0 && <div className="adm-empty">No events scheduled.</div>}
          </div>
        )}
      </div>
    </div>
  );

  const renderNews = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${news.data.length} articles`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openNewsModal()}>
            <Plus size={15} /> Add article
          </button>
        }
      />
      <div className="adm-panel">
        {news.loading ? (
          <Loading label="Loading articles…" />
        ) : news.error ? (
          <ErrorBox message={news.error} onRetry={news.refetch} />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.data.map((n) => (
                  <tr key={n._id}>
                    <td>
                      <div className="adm-cellmain">
                        {n.image ? (
                          <img
                            className="adm-thumb"
                            src={img(n.image, "w=68&h=68&fit=crop&auto=format")}
                            alt=""
                          />
                        ) : (
                          <span className="adm-thumb-ph">
                            <Newspaper size={14} />
                          </span>
                        )}
                        <span
                          className="adm-t-name"
                          style={{
                            maxWidth: 280,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {n.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-violet">{n.category}</span>
                    </td>
                    <td style={{ color: "var(--sub)" }}>
                      {n.published ? formatDateShort(n.publishedAt) : "Draft"}
                    </td>
                    <td style={{ color: "var(--sub)" }}>{n.views.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={n.published ? "Published" : "Draft"} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="adm-iact" onClick={() => openNewsModal(n)} title="Edit">
                          <Edit size={14} />
                        </button>
                        <button
                          className="adm-iact danger"
                          onClick={() => remove(`/news/${n._id}`, news.refetch)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {news.data.length === 0 && <div className="adm-empty">No articles published yet.</div>}
          </div>
        )}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${gallery.data.length} items`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openGalleryModal()}>
            <Plus size={15} /> Add item
          </button>
        }
      />
      {gallery.loading ? (
        <Loading label="Loading gallery…" />
      ) : gallery.error ? (
        <ErrorBox message={gallery.error} onRetry={gallery.refetch} />
      ) : (
        <div className="adm-cardgrid">
          {gallery.data.map((g) => (
            <div key={g._id} className="adm-minicard" style={{ position: "relative" }}>
              <img
                className="thumb"
                style={{ height: 150 }}
                src={img(g.image, "w=400&h=300&fit=crop&auto=format")}
                alt={g.caption || ""}
              />
              <div className="body" style={{ gap: 6 }}>
                <span className="adm-badge adm-badge-teal" style={{ alignSelf: "flex-start" }}>
                  {g.category}
                </span>
                <p style={{ fontSize: 12, color: "var(--sub)" }}>{g.caption || "No caption"}</p>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                <button
                  className="adm-iact"
                  style={{ background: "var(--panel)" }}
                  onClick={() => openGalleryModal(g)}
                  title="Edit"
                >
                  <Edit size={13} />
                </button>
                <button
                  className="adm-iact danger"
                  style={{ background: "var(--panel)" }}
                  onClick={() => remove(`/gallery/${g._id}`, gallery.refetch)}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <button className="adm-addcard" onClick={() => openGalleryModal()}>
            <Plus size={22} />
            Add item
          </button>
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${team.data.length} members`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openTeamModal()}>
            <Plus size={15} /> Add member
          </button>
        }
      />
      {team.loading ? (
        <Loading label="Loading team…" />
      ) : team.error ? (
        <ErrorBox message={team.error} onRetry={team.refetch} />
      ) : (
        <div className="adm-cardgrid">
          {team.data.map((t) => (
            <div
              key={t._id}
              className="adm-panel adm-panel-p"
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              {t.image ? (
                <img
                  className="adm-thumb"
                  style={{ width: 52, height: 52, borderRadius: 12 }}
                  src={img(t.image, "w=120&h=120&fit=crop&auto=format")}
                  alt=""
                />
              ) : (
                <span className="adm-thumb-ph" style={{ width: 52, height: 52, borderRadius: 12 }}>
                  {initials(t.name)}
                </span>
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.name}
                  </span>
                  {t.active === false && (
                    <span className="adm-badge" style={{ fontSize: 10 }}>
                      Hidden
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--sub)" }}>{t.role}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button className="adm-iact" onClick={() => openTeamModal(t)} title="Edit">
                  <Edit size={14} />
                </button>
                <button
                  className="adm-iact danger"
                  onClick={() => remove(`/team/${t._id}`, team.refetch)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTestimonials = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${testimonials.data.length} quotes`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openTestimonialModal()}>
            <Plus size={15} /> Add testimonial
          </button>
        }
      />
      {testimonials.loading ? (
        <Loading label="Loading testimonials…" />
      ) : testimonials.error ? (
        <ErrorBox message={testimonials.error} onRetry={testimonials.refetch} />
      ) : (
        <div className="adm-cardgrid">
          {testimonials.data.map((t) => (
            <div key={t._id} className="adm-panel adm-panel-p">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                {t.image ? (
                  <img
                    className="adm-thumb"
                    style={{ width: 42, height: 42, borderRadius: 12 }}
                    src={img(t.image, "w=100&h=100&fit=crop&auto=format")}
                    alt=""
                  />
                ) : (
                  <span
                    className="adm-thumb-ph"
                    style={{ width: 42, height: 42, borderRadius: 12 }}
                  >
                    {initials(t.name)}
                  </span>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--sub)" }}>{t.role || "—"}</div>
                </div>
                <div style={{ display: "flex", gap: 1 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      style={{
                        color: i < t.rating ? "var(--amber)" : "var(--line)",
                        fill: i < t.rating ? "var(--amber)" : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--sub)",
                  lineHeight: 1.5,
                  marginTop: 12,
                }}
              >
                “{t.text}”
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid var(--line)",
                }}
              >
                <span className="adm-badge" style={{ textTransform: "capitalize" }}>
                  {t.placement}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="adm-iact" onClick={() => openTestimonialModal(t)} title="Edit">
                    <Edit size={14} />
                  </button>
                  <button
                    className="adm-iact danger"
                    onClick={() => remove(`/testimonials/${t._id}`, testimonials.refetch)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPartners = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${partners.data.length} partners`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openPartnerModal()}>
            <Plus size={15} /> Add partner
          </button>
        }
      />
      <div className="adm-panel">
        {partners.loading ? (
          <Loading label="Loading partners…" />
        ) : partners.error ? (
          <ErrorBox message={partners.error} onRetry={partners.refetch} />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Website</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.data.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="adm-cellmain">
                        {p.logo ? (
                          <img
                            className="adm-thumb"
                            style={{ objectFit: "contain" }}
                            src={img(p.logo, "w=68&h=68&fit=crop&auto=format")}
                            alt=""
                          />
                        ) : (
                          <span className="adm-thumb-ph">
                            <Handshake size={14} />
                          </span>
                        )}
                        <span className="adm-t-name">{p.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--sub)" }}>
                      {p.website ? (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--teal-deep)" }}
                        >
                          {p.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ color: "var(--sub)" }}>{p.order}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="adm-iact"
                          onClick={() => openPartnerModal(p)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="adm-iact danger"
                          onClick={() => remove(`/partners/${p._id}`, partners.refetch)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {partners.data.length === 0 && <div className="adm-empty">No partners yet.</div>}
          </div>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHead
        sub={`${reports.data.length} publications`}
        action={
          <button className="adm-btn adm-btn-primary" onClick={() => openReportModal()}>
            <Plus size={15} /> Add report
          </button>
        }
      />
      <div className="adm-panel">
        {reports.loading ? (
          <Loading label="Loading reports…" />
        ) : reports.error ? (
          <ErrorBox message={reports.error} onRetry={reports.refetch} />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.data.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="adm-cellmain">
                        <span className="adm-thumb-ph">
                          <FileText size={14} />
                        </span>
                        <a
                          href={r.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="adm-t-name"
                          style={{ color: "var(--teal-deep)" }}
                        >
                          {r.title}
                        </a>
                      </div>
                    </td>
                    <td style={{ color: "var(--sub)" }}>{r.kind}</td>
                    <td style={{ color: "var(--sub)" }}>{r.year || "—"}</td>
                    <td>
                      <span className={`adm-badge ${r.published ? "adm-badge-green" : ""}`}>
                        {r.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ color: "var(--sub)" }}>{r.order}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="adm-iact"
                          onClick={() => openReportModal(r)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="adm-iact danger"
                          onClick={() => remove(`/reports/${r._id}`, reports.refetch)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reports.data.length === 0 && (
              <div className="adm-empty">No reports yet. Add your first publication.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminAccountCard />
      {isAdmin && (
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
                Applies to the admin console on this browser.
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
      )}
    </div>
  );

  const inlineErr = (show: boolean, msg: string) =>
    show ? (
      <p className="adm-inline-err">
        <AlertCircle size={13} /> {msg}
      </p>
    ) : null;

  const modalFoot = (onSave: () => void, disabled: boolean, label: string) => (
    <div className="adm-modal-foot">
      <button className="adm-btn" onClick={closeModal}>
        Cancel
      </button>
      <button className="adm-btn adm-btn-primary" onClick={onSave} disabled={disabled}>
        {submitting && <Loader2 size={14} className="adm-spin" />}
        {label}
      </button>
    </div>
  );

  return (
    <div className="adm" data-theme={theme}>
      <div className={`adm-app${collapsed ? " is-collapsed" : ""}`}>
        <aside className={`adm-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="adm-brand-row">
            <Link href="/" className="adm-brand" title="Back to site">
              <img className="mark" src="/logo.svg" alt="YEEP Somalia" />
              <span>
                <span className="t1" style={{ display: "block" }}>
                  YEEP Somalia Admin
                </span>
                <span className="t2">Management Console</span>
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
            {visibleNav.map((item) => (
              <button
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => goTo(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={17} />
                <span className="lbl">{item.label}</span>
                {item.id === "messages" && newMsgCount > 0 && (
                  <span
                    className="adm-badge adm-badge-red"
                    style={{ marginLeft: "auto", padding: "1px 7px", fontSize: 10.5 }}
                  >
                    {newMsgCount > 99 ? "99+" : newMsgCount}
                  </span>
                )}
                {item.id === "volunteers" && pendingVolCount > 0 && (
                  <span
                    className="adm-badge adm-badge-amber"
                    style={{ marginLeft: "auto", padding: "1px 7px", fontSize: 10.5 }}
                  >
                    {pendingVolCount > 99 ? "99+" : pendingVolCount}
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
            <span>All systems normal</span>
          </div>
        </aside>

        <main className="adm-main">
          {active === "dashboard" && dashboard.loading && <DashboardSkeleton />}

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
                <div className="adm-eyebrow">YEEP Somalia Admin</div>
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
                  {notifUnreadCount > 0 && (
                    <span className="ct">{notifUnreadCount > 99 ? "99+" : notifUnreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 79 }}
                      onClick={() => setNotifOpen(false)}
                    />
                    <div className="adm-notif">
                      <div className="adm-notif-head">
                        <b>Notifications{notifUnreadCount > 0 ? ` (${notifUnreadCount})` : ""}</b>
                        <button onClick={markNotifsRead}>Mark all read</button>
                      </div>
                      {notifs.length === 0 && (
                        <div className="adm-notif-item read">
                          <span className="nd" />
                          <div>
                            <div className="ntxt">No activity yet.</div>
                          </div>
                        </div>
                      )}
                      {notifs.map((n, i) => (
                        <div
                          key={n._id}
                          className={`adm-notif-item${i >= notifUnreadCount ? " read" : ""}`}
                          onClick={() => n.link && goTo(n.link)}
                          style={n.link ? { cursor: "pointer" } : undefined}
                        >
                          <span className="nd" />
                          <div>
                            <div className="ntxt">{n.message}</div>
                            <div className="ntime">{formatDateShort(n.createdAt)}</div>
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
                    referrerPolicy="no-referrer"
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
          {active === "users" && isAdmin && renderUsers()}
          {active === "volunteers" && renderVolunteers()}
          {active === "hours" && renderHours()}
          {active === "messages" && renderMessages()}
          {active === "projects" && renderProjects()}
          {active === "programs" && renderPrograms()}
          {active === "events" && renderEvents()}
          {active === "news" && renderNews()}
          {active === "gallery" && renderGallery()}
          {active === "team" && renderTeam()}
          {active === "testimonials" && renderTestimonials()}
          {active === "partners" && renderPartners()}
          {active === "reports" && renderReports()}
          {active === "settings" && renderSettings()}
        </main>
      </div>

      {sidebarOpen && <div className="adm-scrim" onClick={() => setSidebarOpen(false)} />}

      {cmdkOpen && (
        <CommandPalette
          items={visibleNav.map((n) => ({ id: n.id, label: n.label, icon: n.icon }))}
          onSelect={(id) => {
            goTo(id);
            setToast(`Opened ${navItems.find((n) => n.id === id)?.label ?? id}`);
          }}
          onClose={() => setCmdkOpen(false)}
        />
      )}

      {statModal && dashboard.data && (
        <StatModal which={statModal} data={dashboard.data} onClose={() => setStatModal(null)} />
      )}

      {registrantsFor && (
        <RegistrantsModal
          eventId={registrantsFor}
          onClose={() => setRegistrantsFor(null)}
        />
      )}

      {openMessage && (
        <MessageModal
          message={openMessage}
          onClose={() => setOpenMessage(null)}
          onChanged={() => {
            messages.refetch();
            unreadMessages.refetch();
          }}
        />
      )}

      {toast && <div className="adm-toast">{toast}</div>}

      {/* ------------------------------ modals ----------------------------- */}

      {modal === "project" && (
        <Modal title={editId ? "Edit Project" : "Add New Project"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Project updated!" : "Project saved successfully!"} />
          ) : (
            <>
              <ImageField
                value={projForm.image}
                onChange={(v) => setProjForm((f) => ({ ...f, image: v }))}
              />
              <div className="adm-modal-grid">
                <Field label="Project Title" required>
                  <input
                    className="adm-input"
                    placeholder="Youth Leadership Academy — Banadir"
                    value={projForm.title}
                    onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  />
                </Field>
                <Field label="Status" required>
                  <select
                    className="adm-select"
                    value={projForm.status}
                    onChange={(e) => setProjForm({ ...projForm, status: e.target.value })}
                  >
                    {["Ongoing", "Completed", "Planned"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="Region">
                  <select
                    className="adm-select"
                    value={projForm.region}
                    onChange={(e) => setProjForm({ ...projForm, region: e.target.value })}
                  >
                    <option value="">Select region</option>
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field label="District">
                  <input
                    className="adm-input"
                    value={projForm.district}
                    onChange={(e) => setProjForm({ ...projForm, district: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Budget ($)">
                  <input
                    className="adm-input"
                    type="number"
                    placeholder="45000"
                    value={projForm.budget}
                    onChange={(e) => setProjForm({ ...projForm, budget: e.target.value })}
                  />
                </Field>
                <Field label="Target Beneficiaries">
                  <input
                    className="adm-input"
                    type="number"
                    placeholder="420"
                    value={projForm.targetBeneficiaries}
                    onChange={(e) =>
                      setProjForm({ ...projForm, targetBeneficiaries: e.target.value })
                    }
                  />
                </Field>
              </div>
              <Field label={`Progress — ${projForm.progress || 0}%`}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Number(projForm.progress) || 0}
                    onChange={(e) => setProjForm({ ...projForm, progress: e.target.value })}
                    className="adm-range-input"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={projForm.progress}
                    onChange={(e) => setProjForm({ ...projForm, progress: e.target.value })}
                    className="adm-input"
                    style={{ width: 80, textAlign: "center" }}
                  />
                </div>
              </Field>
              <div className="adm-modal-grid">
                <Field label="Start Date">
                  <input
                    className="adm-input"
                    type="date"
                    value={projForm.startDate}
                    onChange={(e) => setProjForm({ ...projForm, startDate: e.target.value })}
                  />
                </Field>
                <Field label="Funded By">
                  <input
                    className="adm-input"
                    placeholder="GCERF, U.S. Embassy Mogadishu, etc."
                    value={projForm.fundedBy}
                    onChange={(e) => setProjForm({ ...projForm, fundedBy: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Partners">
                <input
                  className="adm-input"
                  placeholder="Elman Peace, Ministry of Youth and Sports, ..."
                  value={projForm.partners}
                  onChange={(e) => setProjForm({ ...projForm, partners: e.target.value })}
                />
              </Field>
              {inlineErr(!projForm.title || !!formError, formError || "Title is required.")}
              {modalFoot(
                handleSaveProject,
                submitting || !projForm.title,
                editId ? "Save Changes" : "Save Project",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "program" && (
        <Modal title={editId ? "Edit Program" : "Add New Program"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Program updated!" : "Program saved successfully!"} />
          ) : (
            <>
              <ImageField
                value={progForm.image}
                onChange={(v) => setProgForm((f) => ({ ...f, image: v }))}
              />
              <div className="adm-modal-grid">
                <Field label="Program Title" required>
                  <input
                    className="adm-input"
                    value={progForm.title}
                    onChange={(e) => setProgForm({ ...progForm, title: e.target.value })}
                  />
                </Field>
                <Field label="Category" required>
                  <select
                    className="adm-select"
                    value={progForm.category}
                    onChange={(e) => setProgForm({ ...progForm, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {programCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={progForm.description}
                  onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="Region">
                  <select
                    className="adm-select"
                    value={progForm.region}
                    onChange={(e) => setProgForm({ ...progForm, region: e.target.value })}
                  >
                    <option value="">Select region</option>
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    className="adm-select"
                    value={progForm.status}
                    onChange={(e) => setProgForm({ ...progForm, status: e.target.value })}
                  >
                    {["Active", "Enrolling", "Completed", "Paused"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Start Date">
                  <input
                    className="adm-input"
                    type="date"
                    value={progForm.startDate}
                    onChange={(e) => setProgForm({ ...progForm, startDate: e.target.value })}
                  />
                </Field>
                <Field label="End Date">
                  <input
                    className="adm-input"
                    type="date"
                    value={progForm.endDate}
                    onChange={(e) => setProgForm({ ...progForm, endDate: e.target.value })}
                  />
                </Field>
                <Field label="Duration">
                  <input
                    className="adm-input"
                    placeholder="6 months"
                    value={progForm.duration}
                    onChange={(e) => setProgForm({ ...progForm, duration: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Target Beneficiaries">
                  <input
                    className="adm-input"
                    type="number"
                    placeholder="500"
                    value={progForm.targetBeneficiaries}
                    onChange={(e) =>
                      setProgForm({ ...progForm, targetBeneficiaries: e.target.value })
                    }
                  />
                </Field>
                <Field label="Featured">
                  <Switch
                    checked={progForm.isFeatured}
                    onChange={(v) => setProgForm({ ...progForm, isFeatured: v })}
                    label="Show on homepage"
                  />
                </Field>
              </div>
              <Field label={`Progress — ${progForm.progress || 0}%`}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Number(progForm.progress) || 0}
                    onChange={(e) => setProgForm({ ...progForm, progress: e.target.value })}
                    className="adm-range-input"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={progForm.progress}
                    onChange={(e) => setProgForm({ ...progForm, progress: e.target.value })}
                    className="adm-input"
                    style={{ width: 80, textAlign: "center" }}
                  />
                </div>
              </Field>
              {inlineErr(
                !progForm.title || !progForm.category || !!formError,
                formError || "Title and category are required.",
              )}
              {modalFoot(
                handleSaveProgram,
                submitting || !progForm.title || !progForm.category,
                editId ? "Save Changes" : "Save Program",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "event" && (
        <Modal title={editId ? "Edit Event" : "Add New Event"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Event updated!" : "Event saved successfully!"} />
          ) : (
            <>
              <ImageField
                value={evtForm.image}
                onChange={(v) => setEvtForm((f) => ({ ...f, image: v }))}
              />
              <div className="adm-modal-grid">
                <Field label="Event Title" required>
                  <input
                    className="adm-input"
                    value={evtForm.title}
                    onChange={(e) => setEvtForm({ ...evtForm, title: e.target.value })}
                  />
                </Field>
                <Field label="Region">
                  <select
                    className="adm-select"
                    value={evtForm.region}
                    onChange={(e) => setEvtForm({ ...evtForm, region: e.target.value })}
                  >
                    <option value="">Select region</option>
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={evtForm.description}
                  onChange={(e) => setEvtForm({ ...evtForm, description: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="Start Date" required>
                  <input
                    className="adm-input"
                    type="date"
                    value={evtForm.date}
                    onChange={(e) => setEvtForm({ ...evtForm, date: e.target.value })}
                  />
                </Field>
                <Field label="End Date">
                  <input
                    className="adm-input"
                    type="date"
                    value={evtForm.endDate}
                    onChange={(e) => setEvtForm({ ...evtForm, endDate: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Venue / Location">
                  <input
                    className="adm-input"
                    value={evtForm.location}
                    onChange={(e) => setEvtForm({ ...evtForm, location: e.target.value })}
                  />
                </Field>
                <Field label="Capacity">
                  <input
                    className="adm-input"
                    type="number"
                    placeholder="500"
                    value={evtForm.capacity}
                    onChange={(e) => setEvtForm({ ...evtForm, capacity: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Registration Deadline">
                  <input
                    className="adm-input"
                    type="date"
                    value={evtForm.registrationDeadline}
                    onChange={(e) =>
                      setEvtForm({ ...evtForm, registrationDeadline: e.target.value })
                    }
                  />
                </Field>
                <Field label="Featured">
                  <Switch
                    checked={evtForm.isFeatured}
                    onChange={(v) => setEvtForm({ ...evtForm, isFeatured: v })}
                    label="Show on homepage"
                  />
                </Field>
              </div>
              {inlineErr(
                !evtForm.title || !evtForm.date || !!formError,
                formError || "Title and start date are required.",
              )}
              {modalFoot(
                handleSaveEvent,
                submitting || !evtForm.title || !evtForm.date,
                editId ? "Save Changes" : "Save Event",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "news" && (
        <Modal title={editId ? "Edit Article" : "Add New Article"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Article updated!" : "Article saved successfully!"} />
          ) : (
            <>
              <ImageField
                value={newsForm.image}
                onChange={(v) => setNewsForm((f) => ({ ...f, image: v }))}
              />
              <Field label="Article Title" required>
                <input
                  className="adm-input"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                />
              </Field>
              <Field label="Excerpt / Summary">
                <textarea
                  className="adm-textarea"
                  rows={2}
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                />
              </Field>
              <Field label="Article body">
                <textarea
                  className="adm-textarea"
                  rows={10}
                  placeholder="Write the full article. Leave a blank line between paragraphs."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="Category">
                  <select
                    className="adm-select"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {newsCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Author">
                  <input
                    className="adm-input"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Publish Status">
                  <select
                    className="adm-select"
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </Field>
                <Field label="Tags">
                  <input
                    className="adm-input"
                    placeholder="youth, education"
                    value={newsForm.tags}
                    onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Featured">
                <Switch
                  checked={newsForm.isFeatured}
                  onChange={(v) => setNewsForm({ ...newsForm, isFeatured: v })}
                  label="Feature on homepage"
                />
              </Field>
              {inlineErr(!newsForm.title || !!formError, formError || "Title is required.")}
              {modalFoot(
                handleSaveNews,
                submitting || !newsForm.title,
                editId
                  ? "Save Changes"
                  : newsForm.status === "Published"
                    ? "Publish"
                    : "Save Draft",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "user" && (
        <Modal title="Add User" onClose={closeModal}>
          {saved ? (
            <SavedState label="User account created!" />
          ) : (
            <>
              <div className="adm-modal-grid">
                <Field label="Full Name" required>
                  <input
                    className="adm-input"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    className="adm-input"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Temporary Password" required>
                  <input
                    className="adm-input"
                    value={userForm.password}
                    placeholder="min. 8 characters"
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className="adm-input"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  />
                </Field>
              </div>
              <div className="adm-modal-grid">
                <Field label="Role" required>
                  <select
                    className="adm-select"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="staff">Staff — content &amp; applications</option>
                    <option value="admin">Administrator — full control</option>
                  </select>
                </Field>
                <Field label="Active">
                  <Switch
                    checked={userForm.isActive}
                    onChange={(v) => setUserForm({ ...userForm, isActive: v })}
                    label="Can sign in immediately"
                  />
                </Field>
              </div>
              {userForm.role === "admin" && (
                <p
                  className="adm-badge adm-badge-violet"
                  style={{ display: "flex", padding: "8px 10px", borderRadius: 8 }}
                >
                  <AlertCircle size={13} /> Administrators have full control of every resource and
                  user account.
                </p>
              )}
              {userForm.role === "staff" && (
                <p
                  className="adm-badge adm-badge-blue"
                  style={{ display: "flex", padding: "8px 10px", borderRadius: 8 }}
                >
                  <AlertCircle size={13} /> Staff manage content and applications, but not user
                  accounts.
                </p>
              )}
              {formError && <p className="adm-msg-err">{formError}</p>}
              {modalFoot(
                handleSaveUser,
                submitting || !userForm.name || !userForm.email || userForm.password.length < 8,
                "Create User",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "gallery" && (
        <Modal title={editId ? "Edit Gallery Item" : "Add Gallery Item"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Item updated!" : "Item added!"} />
          ) : (
            <>
              <ImageField
                label="Image"
                value={galleryForm.image}
                onChange={(v) => setGalleryForm((f) => ({ ...f, image: v }))}
              />
              <div className="adm-modal-grid">
                <Field label="Category" required>
                  <select
                    className="adm-select"
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  >
                    {galleryCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Type">
                  <select
                    className="adm-select"
                    value={galleryForm.type}
                    onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </Field>
              </div>
              {galleryForm.type === "video" && (
                <Field label="Video URL">
                  <input
                    className="adm-input"
                    placeholder="https://youtube.com/watch?v=…"
                    value={galleryForm.videoUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, videoUrl: e.target.value })}
                  />
                </Field>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px",
                  gap: 14,
                }}
              >
                <Field label="Caption">
                  <input
                    className="adm-input"
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  />
                </Field>
                <Field label="Order">
                  <input
                    className="adm-input"
                    type="number"
                    value={galleryForm.order}
                    onChange={(e) => setGalleryForm({ ...galleryForm, order: e.target.value })}
                  />
                </Field>
              </div>
              {inlineErr(!galleryForm.image || !!formError, formError || "An image is required.")}
              {modalFoot(
                handleSaveGallery,
                submitting || !galleryForm.image,
                editId ? "Save Changes" : "Add Item",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "team" && (
        <Modal title={editId ? "Edit Team Member" : "Add Team Member"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Member updated!" : "Member added!"} />
          ) : (
            <>
              <ImageField
                label="Photo"
                shape="square"
                value={teamForm.image}
                onChange={(v) => setTeamForm((f) => ({ ...f, image: v }))}
              />
              <div className="adm-modal-grid">
                <Field label="Full Name" required>
                  <input
                    className="adm-input"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  />
                </Field>
                <Field label="Role / Title" required>
                  <input
                    className="adm-input"
                    placeholder="Programs Director"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Bio">
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="Order">
                  <input
                    className="adm-input"
                    type="number"
                    value={teamForm.order}
                    onChange={(e) => setTeamForm({ ...teamForm, order: e.target.value })}
                  />
                </Field>
                <Field label="Visible">
                  <Switch
                    checked={teamForm.active}
                    onChange={(v) => setTeamForm({ ...teamForm, active: v })}
                    label="Show on the site"
                  />
                </Field>
              </div>
              {inlineErr(
                !teamForm.name || !teamForm.role || !!formError,
                formError || "Name and role are required.",
              )}
              {modalFoot(
                handleSaveTeam,
                submitting || !teamForm.name || !teamForm.role,
                editId ? "Save Changes" : "Add Member",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "testimonial" && (
        <Modal title={editId ? "Edit Testimonial" : "Add Testimonial"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Testimonial updated!" : "Testimonial added!"} />
          ) : (
            <>
              <ImageField
                label="Photo"
                shape="square"
                value={testimonialForm.image}
                onChange={(v) => setTestimonialForm((f) => ({ ...f, image: v }))}
              />
              <div className="adm-modal-grid">
                <Field label="Name" required>
                  <input
                    className="adm-input"
                    value={testimonialForm.name}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, name: e.target.value })
                    }
                  />
                </Field>
                <Field label="Role / Context">
                  <input
                    className="adm-input"
                    placeholder="Digital Literacy Graduate, 2024"
                    value={testimonialForm.role}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, role: e.target.value })
                    }
                  />
                </Field>
              </div>
              <Field label="Quote" required>
                <textarea
                  className="adm-textarea"
                  rows={4}
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                />
              </Field>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Rating">
                  <select
                    className="adm-select"
                    value={testimonialForm.rating}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, rating: e.target.value })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Placement">
                  <select
                    className="adm-select"
                    value={testimonialForm.placement}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        placement: e.target.value,
                      })
                    }
                  >
                    <option value="home">Home — success stories</option>
                    <option value="volunteer">Volunteer — voices</option>
                  </select>
                </Field>
                <Field label="Order">
                  <input
                    className="adm-input"
                    type="number"
                    value={testimonialForm.order}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, order: e.target.value })
                    }
                  />
                </Field>
              </div>
              {inlineErr(
                !testimonialForm.name || testimonialForm.text.trim().length < 5 || !!formError,
                formError || "Name and a quote (5+ characters) are required.",
              )}
              {modalFoot(
                handleSaveTestimonial,
                submitting || !testimonialForm.name || testimonialForm.text.trim().length < 5,
                editId ? "Save Changes" : "Add Testimonial",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "partner" && (
        <Modal title={editId ? "Edit Partner" : "Add Partner"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Partner updated!" : "Partner added!"} />
          ) : (
            <>
              <ImageField
                label="Logo"
                shape="square"
                value={partnerForm.logo}
                onChange={(v) => setPartnerForm((f) => ({ ...f, logo: v }))}
              />
              <Field label="Partner Name" required>
                <input
                  className="adm-input"
                  placeholder="GCERF"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                />
              </Field>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px",
                  gap: 14,
                }}
              >
                <Field label="Website">
                  <input
                    className="adm-input"
                    placeholder="https://www.gcerf.org"
                    value={partnerForm.website}
                    onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  />
                </Field>
                <Field label="Order">
                  <input
                    className="adm-input"
                    type="number"
                    value={partnerForm.order}
                    onChange={(e) => setPartnerForm({ ...partnerForm, order: e.target.value })}
                  />
                </Field>
              </div>
              {inlineErr(!partnerForm.name || !!formError, formError || "A name is required.")}
              {modalFoot(
                handleSavePartner,
                submitting || !partnerForm.name,
                editId ? "Save Changes" : "Add Partner",
              )}
            </>
          )}
        </Modal>
      )}

      {modal === "report" && (
        <Modal title={editId ? "Edit Report" : "Add Report"} onClose={closeModal}>
          {saved ? (
            <SavedState label={editId ? "Report updated!" : "Report added!"} />
          ) : (
            <>
              <Field label="Title" required>
                <input
                  className="adm-input"
                  placeholder="YEEP Somalia Annual Report 2025"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                />
              </Field>
              <Field label="File URL (PDF link)" required>
                <input
                  className="adm-input"
                  placeholder="https://…/annual-report-2025.pdf"
                  value={reportForm.fileUrl}
                  onChange={(e) => setReportForm({ ...reportForm, fileUrl: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="Type">
                  <select
                    className="adm-select"
                    value={reportForm.kind}
                    onChange={(e) => setReportForm({ ...reportForm, kind: e.target.value })}
                  >
                    {[
                      "Annual Report",
                      "Financial Statement",
                      "Strategy",
                      "Policy",
                      "Research",
                      "Other",
                    ].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Year">
                  <input
                    className="adm-input"
                    placeholder="2025"
                    value={reportForm.year}
                    onChange={(e) => setReportForm({ ...reportForm, year: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Summary">
                <textarea
                  className="adm-textarea"
                  rows={2}
                  value={reportForm.summary}
                  onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })}
                />
              </Field>
              <div className="adm-modal-grid">
                <Field label="File size">
                  <input
                    className="adm-input"
                    placeholder="2.4 MB"
                    value={reportForm.fileSize}
                    onChange={(e) => setReportForm({ ...reportForm, fileSize: e.target.value })}
                  />
                </Field>
                <Field label="Order">
                  <input
                    className="adm-input"
                    type="number"
                    value={reportForm.order}
                    onChange={(e) => setReportForm({ ...reportForm, order: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Published">
                <Switch
                  checked={reportForm.published}
                  onChange={(v) => setReportForm({ ...reportForm, published: v })}
                  label="Show on the About page"
                />
              </Field>
              {inlineErr(
                !reportForm.title || !reportForm.fileUrl || !!formError,
                formError || "A title and a file URL are required.",
              )}
              {modalFoot(
                handleSaveReport,
                submitting || !reportForm.title || !reportForm.fileUrl,
                editId ? "Save Changes" : "Add Report",
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
