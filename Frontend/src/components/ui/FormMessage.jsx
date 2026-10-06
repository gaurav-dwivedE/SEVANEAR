export default function FormMessage({ children, type = "error" }) {
  if (!children) return null;
  return (
    <p role={type === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${type === "error" ? "border-red-200 bg-red-50 font-medium text-red-700" : "border-brand-100 bg-brand-50 text-ivory-100"}`}>
      {children}
    </p>
  );
}
