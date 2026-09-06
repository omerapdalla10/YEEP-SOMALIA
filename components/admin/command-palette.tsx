"use client";

import { useEffect, useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";

export interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

export function CommandPalette({
  items,
  onSelect,
  onClose,
}: {
  items: CommandItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSel(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && filtered[sel]) {
        e.preventDefault();
        onSelect(filtered[sel].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, sel, onSelect, onClose]);

  return (
    <div className="adm-cmdk" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-cmdk-box" role="dialog" aria-label="Command palette">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to a section…"
        />
        <div className="adm-cmdk-list">
          {filtered.length === 0 && (
            <div className="adm-cmdk-item" style={{ color: "var(--sub)" }}>
              No matches
            </div>
          )}
          {filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`adm-cmdk-item${i === sel ? " sel" : ""}`}
                onMouseMove={() => setSel(i)}
                onClick={() => onSelect(item.id)}
              >
                <Icon size={16} />
                {item.label}
                {i === sel && (
                  <CornerDownLeft size={13} style={{ marginLeft: "auto", color: "var(--sub)" }} />
                )}
              </button>
            );
          })}
        </div>
        <div className="adm-cmdk-hint">↑↓ to navigate · Enter to select · Esc to close</div>
      </div>
    </div>
  );
}
