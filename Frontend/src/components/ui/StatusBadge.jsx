export const STATUS_META = {
  pending: { label: "Requested", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  approved: { label: "Confirmed", cls: "border-brand-100 bg-brand-50 text-brand-700" },
  in_progress: { label: "In progress", cls: "border-violet-200 bg-violet-50 text-violet-700" },
  completed: { label: "Completed", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  rejected: { label: "Declined", cls: "border-red-200 bg-red-50 text-red-700" },
  cancelled: { label: "Cancelled", cls: "border-slate-200 bg-slate-100 text-slate-500" },
};

export default function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${m.cls}`}>
      {m.label}
    </span>
  );
}
