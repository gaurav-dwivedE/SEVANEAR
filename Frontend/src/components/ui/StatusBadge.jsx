export const STATUS_META = {
  pending: { label: "Requested", cls: "border-dashed border-ivory-200 text-ivory-100" },
  approved: { label: "Confirmed", cls: "border-black text-black" },
  in_progress: { label: "In progress", cls: "border-black bg-black text-white" },
  completed: { label: "Completed", cls: "border-ink-600 bg-ink-700 text-black" },
  rejected: { label: "Declined", cls: "border-ink-600 text-ivory-200 line-through" },
  cancelled: { label: "Cancelled", cls: "border-ink-600 text-ivory-200 line-through" },
};

export default function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${m.cls}`}>
      {m.label}
    </span>
  );
}
