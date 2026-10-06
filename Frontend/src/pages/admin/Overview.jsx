import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, fmtD } from "./shared";
import StatusBadge from "../../components/ui/StatusBadge";
import { applicationsApi, servicesApi, partnersApi, partnerApplicationsApi, authApi } from "../../lib/api";
import { slotLabel } from "../../lib/format";

export default function Overview() {
  const [d, setD] = useState(null);
  useEffect(() => {
    Promise.all([applicationsApi.all(), servicesApi.list({ all: 1 }), partnersApi.list(), partnerApplicationsApi.all("pending"), authApi.allUsers()])
      .then(([a, s, p, pa, u]) => setD({ bookings: a.data.data, services: s.data.data.length, partners: p.data.data.length, apps: pa.data.data.length, users: u.data.data.filter((x) => x.role !== "admin").length }));
  }, []);
  if (!d) return <div className="skeleton h-64" />;
  const pending = d.bookings.filter((b) => b.status === "pending");
  const cards = [
    ["Pending bookings", pending.length, "bookings"], ["Total bookings", d.bookings.length, "bookings"], ["Services", d.services, "services"],
    ["Partners", d.partners, "partners"], ["New applications", d.apps, "applications"], ["Customers", d.users, "users"],
  ];
  return (
    <>
      <PageHead title="Overview" sub="What needs your attention today." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map(([l, n, to]) => (
          <Link key={l} to={`/admin/${to}`} className="rounded-xl border border-ink-700 bg-white p-4 hover:border-brand-600"><p className="font-display text-4xl">{n}</p><p className="text-sm text-ivory-200">{l}</p></Link>
        ))}
      </div>
      <h2 className="mb-3 mt-10 text-2xl">Waiting for confirmation</h2>
      <div className="divide-y divide-ink-700 rounded-xl border border-ink-700 bg-white">
        {pending.slice(0, 6).map((b) => (
          <Link to="/admin/bookings" key={b._id} className="flex items-center justify-between gap-3 p-4 text-sm hover:bg-ink-900">
            <div><b>{b.service?.name}</b> <span className="text-ivory-200">· {b.user?.name}</span><p className="text-ivory-200">{fmtD(b.scheduledDate)} · {slotLabel(b.timeSlot)} · {b.selectedAddress?.zipCode}</p></div>
            <StatusBadge status={b.status} />
          </Link>
        ))}
        {!pending.length && <p className="p-6 text-center text-sm text-ivory-200">All caught up.</p>}
      </div>
    </>
  );
}
