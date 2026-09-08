"use client";

import { useState } from "react";
import { Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { useResource } from "@/lib/client/hooks";
import { api, ApiError } from "@/lib/client/api";
import { formatDateShort } from "@/lib/client/format";
import type { MyHoursData } from "@/lib/types";

const VARIANT: Record<string, string> = { Approved: "green", Pending: "amber", Rejected: "red" };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Member's volunteer time log — a "log time" form plus their entries. */
export default function HoursLog() {
  const { data, loading, error, refetch } = useResource<MyHoursData>("/volunteer-hours/me");

  const [form, setForm] = useState({ activity: "", hours: "", date: todayISO() });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const hrs = Number(form.hours);
    if (!form.activity.trim() || !form.date || !(hrs >= 0.5)) {
      setMsg({ text: "Fill in the activity, a date, and at least 0.5 hours.", ok: false });
      return;
    }
    setBusy(true);
    try {
      await api.post("/volunteer-hours", {
        activity: form.activity.trim(),
        hours: hrs,
        date: new Date(form.date).toISOString(),
      });
      setForm({ activity: "", hours: "", date: todayISO() });
      setMsg({ text: "Logged — pending staff review.", ok: true });
      refetch();
    } catch (err) {
      setMsg({
        text: err instanceof ApiError ? err.message : "Could not save that entry.",
        ok: false,
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setRemoving(id);
    try {
      await api.del(`/volunteer-hours/${id}`);
      refetch();
    } catch {
      /* leave the row */
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Totals */}
      <div className="adm-statmini">
        <div>
          <div className="n">{data?.totals.approved ?? 0}</div>
          <div className="l">Approved hours</div>
        </div>
        <div>
          <div className="n">{data?.totals.pending ?? 0}</div>
          <div className="l">Pending review</div>
        </div>
        <div>
          <div className="n">{data?.entries.length ?? 0}</div>
          <div className="l">Entries logged</div>
        </div>
      </div>

      {/* Log form */}
      <form className="adm-panel adm-panel-p" onSubmit={submit} style={{ maxWidth: 620 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Clock size={15} style={{ color: "var(--teal-deep)" }} />
          <h3 style={{ fontSize: 15.5 }}>Log volunteer time</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <span className="adm-label">What did you do?</span>
            <input
              className="adm-input"
              placeholder="e.g. Facilitated a youth dialogue in Hodan"
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
            />
          </div>
          <div className="adm-modal-grid">
            <div>
              <span className="adm-label">Hours</span>
              <input
                className="adm-input"
                type="number"
                min={0.5}
                max={24}
                step={0.5}
                placeholder="3"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
              />
            </div>
            <div>
              <span className="adm-label">Date</span>
              <input
                className="adm-input"
                type="date"
                max={todayISO()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          {msg && <p className={msg.ok ? "adm-msg-ok" : "adm-msg-err"}>{msg.text}</p>}
          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            style={{ alignSelf: "flex-start" }}
            disabled={busy}
          >
            {busy ? <Loader2 size={14} className="adm-spin" /> : <Plus size={14} />}
            Log time
          </button>
        </div>
      </form>

      {/* Entries */}
      <div className="adm-panel">
        <div className="adm-panel-p" style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 15.5 }}>Your time log</h3>
        </div>
        {loading && <div className="adm-empty">Loading…</div>}
        {error && <div className="adm-empty">{error}</div>}
        {data && data.entries.length === 0 && (
          <div className="adm-empty">No hours logged yet.</div>
        )}
        {data && data.entries.length > 0 && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <span className="adm-t-name">{e.activity}</span>
                      {e.event && <div className="em">{e.event.title}</div>}
                      {e.status === "Rejected" && e.reviewNote && (
                        <div className="em" style={{ color: "var(--danger)" }}>
                          {e.reviewNote}
                        </div>
                      )}
                    </td>
                    <td style={{ color: "var(--sub)" }}>{formatDateShort(e.date)}</td>
                    <td>{e.hours}</td>
                    <td>
                      <span
                        className={`adm-badge${
                          VARIANT[e.status] ? ` adm-badge-${VARIANT[e.status]}` : ""
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td>
                      {e.status === "Pending" && (
                        <button
                          className="adm-iact danger"
                          title="Remove"
                          onClick={() => remove(e._id)}
                          disabled={removing === e._id}
                        >
                          {removing === e._id ? (
                            <Loader2 size={13} className="adm-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
