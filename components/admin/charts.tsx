"use client";

import { useMemo, useState } from "react";

/* ---------------------------- Growth area chart --------------------------- */

interface GrowthPoint {
  month: string;
  users: number;
}

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 620;
  const H = 180;
  const PAD = 6;

  const geo = useMemo(() => {
    if (data.length === 0) return null;
    const max = Math.max(1, ...data.map((d) => d.users));
    const n = data.length;
    const x = (i: number) => (n === 1 ? W / 2 : PAD + (i * (W - PAD * 2)) / (n - 1));
    const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
    const pts = data.map((d, i) => ({ x: x(i), y: y(d.users), d }));
    const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const area = `${line} ${pts[pts.length - 1].x},${H} ${pts[0].x},${H}`;
    return { pts, line, area, max };
  }, [data]);

  if (!geo) return <div className="adm-empty">No registration data yet.</div>;

  if (data.length < 2) {
    const only = data[data.length - 1];
    return (
      <div
        style={{
          height: H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          {only.users.toLocaleString()}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--sub)" }}>
          registered by {only.month} — not enough history to chart a trend yet
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="admGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.55, 0.85].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)" strokeWidth="1" />
        ))}
        <polygon points={geo.area} fill="url(#admGrowthFill)" />
        <polyline
          points={geo.line}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {geo.pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={hover === i ? 5 : 3.5} fill="var(--teal)" />
            <rect
              x={p.x - W / geo.pts.length / 2}
              y="0"
              width={W / geo.pts.length}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}
      </svg>
      {hover !== null && geo.pts[hover] && (
        <div
          style={{
            position: "absolute",
            left: `${(geo.pts[hover].x / W) * 100}%`,
            top: `${(geo.pts[hover].y / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 8px))",
            background: "var(--ink)",
            color: "var(--bg)",
            fontSize: 11.5,
            fontWeight: 600,
            padding: "5px 9px",
            borderRadius: 7,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {geo.pts[hover].d.month}: {geo.pts[hover].d.users.toLocaleString()} users
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Donut chart ------------------------------ */

interface Slice {
  name: string;
  value: number;
  color: string;
}

export function Donut({ data }: { data: Slice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 75;
  const cy = 75;
  const r = 56;
  const sw = 20;
  const circ = 2 * Math.PI * r;

  const lens = data.map((d) => (d.value / total) * circ);
  const offsets = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));

  if (data.length === 0) return <div className="adm-empty">No programs to chart yet.</div>;

  return (
    <div className="adm-donut-wrap">
      <svg viewBox="0 0 150 150" width="140" height="140" style={{ flexShrink: 0 }}>
        {data.map((d, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={active === i ? sw + 4 : sw}
            strokeDasharray={`${lens[i]} ${circ - lens[i]}`}
            strokeDashoffset={-offsets[i]}
            transform={`rotate(-90 ${cx} ${cy})`}
            className={active !== null && active !== i ? "dim" : ""}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>
      <div className="adm-dlegend">
        {data.map((d, i) => (
          <div
            key={i}
            className={`adm-dlegend-row${active === i ? " hover" : ""}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="sw" style={{ background: d.color }} />
            {d.name}
            <span className="pct">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
