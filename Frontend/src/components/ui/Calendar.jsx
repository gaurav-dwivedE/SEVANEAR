import { useState } from "react";
import Icon from "./Icon";

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Month calendar; selectable from today to `maxDays` ahead.
export default function Calendar({ value, onChange, maxDays = 45 }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const max = new Date(today); max.setDate(max.getDate() + maxDays);
  const [view, setView] = useState(() => new Date((value ? new Date(value) : today).getFullYear(), (value ? new Date(value) : today).getMonth(), 1));
  const first = view.getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= max;
  const nav = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  return (
    <div className="rounded-xl border border-ink-600 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" disabled={!canPrev} onClick={() => nav(-1)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink-700 disabled:opacity-30" aria-label="Previous month"><Icon name="left" size={16} /></button>
        <b className="text-sm">{view.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</b>
        <button type="button" disabled={!canNext} onClick={() => nav(1)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink-700 disabled:opacity-30" aria-label="Next month"><Icon name="right" size={16} /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] text-ivory-200">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const off = d < today || d > max;
          const sel = value === iso(d);
          return (
            <button type="button" key={i} disabled={off} onClick={() => onChange(iso(d))} aria-pressed={sel}
              className={`aspect-square rounded-lg text-sm ${sel ? "bg-brand-600 font-semibold text-white" : off ? "text-ivory-200/40" : "hover:bg-ink-700"} ${iso(d) === iso(today) && !sel ? "ring-1 ring-brand-600" : ""}`}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
