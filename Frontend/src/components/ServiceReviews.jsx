import { useEffect, useState } from "react";
import { StarRow } from "./ui/Icon";
import { servicesApi } from "../lib/api";
import { fmtDate } from "../lib/format";

export default function ServiceReviews({ serviceId }) {
  const [d, setD] = useState(null);
  useEffect(() => { servicesApi.reviews(serviceId).then(({ data }) => setD(data.data)).catch(() => setD({ count: 0, reviews: [], distribution: [0, 0, 0, 0, 0], average: 0 })); }, [serviceId]);
  if (!d) return <div className="skeleton mt-12 h-40" />;
  const max = Math.max(1, ...d.distribution);
  return (
    <section className="mt-14 border-t border-ink-700 pt-10" aria-labelledby="rev">
      <h2 id="rev" className="text-2xl">Ratings & reviews</h2>
      {!d.count ? (
        <p className="mt-3 text-ivory-200">No reviews yet. Customers can review this service after their booking is completed.</p>
      ) : (
        <div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
          <div>
            <p className="font-display text-5xl font-extrabold">{d.average.toFixed(1)}</p>
            <div className="mt-1"><StarRow value={d.average} size={18} /></div>
            <p className="mt-1 text-sm text-ivory-200">{d.count} rating{d.count > 1 ? "s" : ""}</p>
            <div className="mt-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="flex items-center gap-2 text-xs"><span className="w-3">{n}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700"><div className="h-full bg-black" style={{ width: `${(d.distribution[n - 1] / max) * 100}%` }} /></div><span className="w-5 text-right text-ivory-200">{d.distribution[n - 1]}</span></div>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-ink-700">
            {d.reviews.map((r) => (
              <li key={r._id} className="py-4 first:pt-0">
                <div className="flex items-center gap-2 text-sm"><StarRow value={r.rating} size={14} /><b>{r.name}</b><span className="text-ivory-200">· {fmtDate(r.date)}</span></div>
                {r.review ? <p className="mt-1.5 text-[15px] text-ivory-100">{r.review}</p> : <p className="mt-1.5 text-sm text-ivory-200">Rated without a written review.</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
