import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ServiceCard from "./ui/ServiceCard";
import { useCategories, useServices } from "../lib/useCatalog";
import { useLocationCtx } from "../context/LocationContext";

export default function ServiceBrowser({ limit, search = false }) {
  const categories = useCategories();
  const { pincode, city, openAsk } = useLocationCtx();
  const [sp] = useSearchParams();
  const [cat, setCat] = useState(sp.get("category") || "");
  const [q, setQ] = useState(sp.get("q") || "");
  const [mine, setMine] = useState(true);
  const params = { category: cat || undefined, q: q || undefined, pincode: pincode && mine ? pincode : undefined };
  const { services, loading, error } = useServices(params);
  const shown = limit ? services.slice(0, limit) : services;

  return (
    <div>
      {search && (
        <input className="input-field mb-4 md:max-w-md" placeholder="Search services" aria-label="Search services" value={q} onChange={(e) => setQ(e.target.value)} />
      )}
      <div className="flex flex-wrap items-center gap-2">
        {[{ _id: "", name: "All" }, ...categories].map((c) => (
          <button key={c._id} onClick={() => setCat(c._id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${cat === c._id ? "border-brand-600 bg-brand-600 text-white" : "border-ink-600 hover:border-brand-600"}`}>
            {c.name}
          </button>
        ))}
        <div className="ml-auto text-sm text-ivory-200">
          {pincode ? (
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="accent-black" checked={mine} onChange={(e) => setMine(e.target.checked)} />
              Only available in {city || pincode} ({pincode})
            </label>
          ) : (
            <button onClick={openAsk} className="underline underline-offset-4">Set PIN code to see local availability</button>
          )}
        </div>
      </div>
      {error && <p className="mt-6 font-medium">{error}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? Array.from({ length: limit || 8 }, (_, i) => <div key={i} className="skeleton h-72" />) : shown.map((s) => <ServiceCard key={s._id} service={s} />)}
      </div>
      {!loading && !shown.length && !error && (
        <div className="mt-8 rounded-xl border border-dashed border-ink-600 p-8 text-center text-ivory-200">
          {pincode && mine ? `No services are available at ${pincode} yet.` : "No services match your search."}{" "}
          {pincode && mine && <button className="font-semibold text-brand-600 underline" onClick={() => setMine(false)}>Show all services</button>}
        </div>
      )}
      {limit && services.length > limit && (
        <div className="mt-6 text-center"><Link to="/services" className="btn-ghost">View all {services.length} services</Link></div>
      )}
    </div>
  );
}
