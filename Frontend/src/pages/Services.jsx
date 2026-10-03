import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ServiceCard from "../components/ui/ServiceCard";
import useTitle from "../lib/useTitle";
import { useServices } from "../lib/useServices";
import { CATEGORIES } from "../lib/format";

export default function Services() {
  useTitle("Services — SevaNear");
  const { services, loading, error } = useServices();
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "";
  const cat = sp.get("cat") || "All";
  const sort = sp.get("sort") || "popular";
  const set = (k, v) => {
    const n = new URLSearchParams(sp);
    v && v !== "All" && v !== "popular" ? n.set(k, v) : n.delete(k);
    setSp(n, { replace: true });
  };

  const list = useMemo(() => {
    const t = q.toLowerCase();
    const l = services.filter(
      (s) => (cat === "All" || s.category === cat) && (s.name + s.description).toLowerCase().includes(t)
    );
    if (sort === "price") l.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === "rating") l.sort((a, b) => b.ratingAvg - a.ratingAvg);
    return l;
  }, [services, q, cat, sort]);

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-4xl font-semibold text-ivory-50">Find a service</h1>
      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input
          className="input-field md:max-w-md"
          placeholder="Search services"
          aria-label="Search services"
          value={q}
          onChange={(e) => set("q", e.target.value)}
        />
        <select className="input-field md:ml-auto md:w-48" value={sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort">
          <option value="popular">Sort: Featured</option>
          <option value="price">Price: low to high</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => set("cat", c)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
              cat === c ? "border-moss-600 bg-moss-600 text-white" : "border-ink-600 bg-ink-800 text-ivory-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {error && <p className="mt-6 text-black font-medium">{error}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton h-64" />)
          : list.map((s) => <ServiceCard key={s._id} service={s} />)}
      </div>
      {!loading && !list.length && !error && (
        <p className="mt-10 text-center text-ivory-200">No services match. Try a different search or category.</p>
      )}
    </div>
  );
}
