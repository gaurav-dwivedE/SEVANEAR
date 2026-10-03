import { Star } from "./Icon";

export default function Stars({ avg, count }) {
  if (!count) return <span className="rounded border border-ink-600 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ivory-200">New</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ivory-50">
      <Star /> {avg.toFixed(1)} <span className="font-normal text-ivory-200">({count})</span>
    </span>
  );
}
