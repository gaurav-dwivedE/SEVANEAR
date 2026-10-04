import { useCallback, useState } from "react";
import Icon from "../../components/ui/Icon";

export const fmtD = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

export function PageHead({ title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-3xl text-ivory-50 md:text-4xl">{title}</h1>{sub && <p className="mt-1 text-sm text-ivory-200">{sub}</p>}</div>
      {action}
    </div>
  );
}

export function useFlash() {
  const [msg, setMsg] = useState("");
  const flash = useCallback((m) => { setMsg(m); setTimeout(() => setMsg(""), 2600); }, []);
  const node = msg ? (
    <div role="status" className="fade-up fixed right-4 top-4 z-[90] flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm text-white shadow-xl"><Icon name="check" size={16} />{msg}</div>
  ) : null;
  return [node, flash];
}

export const Empty = ({ children }) => <div className="rounded-xl border border-dashed border-ink-600 p-10 text-center text-sm text-ivory-200">{children}</div>;

export const Chip = ({ children, on }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${on === false ? "border-ink-600 text-ivory-200 line-through" : "border-black"}`}>{children}</span>
);

export const IconBtn = ({ icon, label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} aria-label={label} title={label} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink-700 disabled:opacity-40"><Icon name={icon} size={17} /></button>
);
