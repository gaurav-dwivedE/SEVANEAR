const P = {
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  right: "M5 12h14M13 6l6 6-6 6",
  left: "M19 12H5M11 6l-6 6 6 6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  pin: "M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  logout: "M9 21H5V3h4M16 17l5-5-5-5M21 12H9",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  plus: "M12 5v14M5 12h14",
};
export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}
export function Star({ size = 14, filled = true, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8L12 3z" />
    </svg>
  );
}

// Five stars, filled up to `value` (decimals allowed, e.g. 4.5), the rest outlined.
export function StarRow({ value = 0, size = 16, className = "" }) {
  const pct = Math.max(0, Math.min(5, value)) / 5 * 100;
  const row = (filled) => (
    <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} filled={filled} />)}</span>
  );
  return (
    <span className={`relative inline-flex shrink-0 align-middle ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      <span className="text-ink-600">{row(false)}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-black" style={{ width: `${pct}%` }}><span className="flex w-max">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} filled />)}</span></span>
    </span>
  );
}
