import { useEffect } from "react";
import Icon from "./Icon";

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className={`fade-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-xl sm:p-7 ${wide ? "sm:max-w-2xl" : "sm:max-w-md"}`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl text-ivory-50">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-700" aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
