export default function FormMessage({ children, type = "error" }) {
  if (!children) return null;
  return (
    <p role={type === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${type === "error" ? "border-black bg-ink-900 font-medium text-black" : "border-ink-600 bg-ink-900 text-ivory-100"}`}>
      {children}
    </p>
  );
}
