import { StarRow } from "./Icon";

export default function Stars({ avg, count }) {
  if (!count) return <span className="text-xs text-ivory-200">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <StarRow value={avg} size={14} />
      <b>{avg.toFixed(1)}</b>
      <span className="text-ivory-200">({count})</span>
    </span>
  );
}
