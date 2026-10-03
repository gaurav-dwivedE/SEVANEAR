export default function Loader({ full = false, label = "Loading" }) {
  const spinner = (
    <div className="flex items-center gap-3 text-ivory-200/60">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory-100/20 border-t-clay-500" />
      <span className="text-sm tracking-wide">{label}…</span>
    </div>
  );

  if (!full) return spinner;

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ink-950">{spinner}</div>
  );
}
