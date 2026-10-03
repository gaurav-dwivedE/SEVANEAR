import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon, { Star } from "../components/ui/Icon";
import StatusBadge from "../components/ui/StatusBadge";
import FormMessage from "../components/ui/FormMessage";
import { addressesApi, applicationsApi, getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import useTitle from "../lib/useTitle";
import { fmtDate, slotLabel, rupee, img } from "../lib/format";

const FLOW = ["pending", "approved", "in_progress", "completed"];
const FLOW_LABEL = ["Requested", "Partner assigned", "On the job", "Completed"];

function Timeline({ status }) {
  if (status === "cancelled" || status === "rejected") return null;
  const at = FLOW.indexOf(status);
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1 text-center text-[11px] text-ivory-200">
      {FLOW_LABEL.map((l, i) => (
        <li key={l}>
          <div className={`mb-1 h-1.5 rounded-full ${i <= at ? "bg-moss-400" : "bg-ink-700"}`} />
          <span className={i === at ? "font-semibold text-ivory-50" : ""}>{l}</span>
        </li>
      ))}
    </ol>
  );
}

function Booking({ app, onChange }) {
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(0);
  const [err, setErr] = useState("");
  async function run(fn) {
    setBusy(true);
    setErr("");
    try {
      await fn();
      await onChange();
    } catch (e) {
      setErr(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  const cancellable = ["pending", "approved"].includes(app.status);
  return (
    <article className="card-surface p-4">
      <div className="flex gap-4">
        <img src={img(app.service)} alt="" className="hidden h-20 w-24 rounded-xl object-cover sm:block" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-ivory-50">{app.service?.name || "Service"}</h3>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-sm text-ivory-200">
            {app.scheduledDate ? `${fmtDate(app.scheduledDate)} · ${slotLabel(app.timeSlot)}` : "Schedule pending"}
          </p>
          <p className="text-sm text-ivory-200">
            {app.selectedAddress ? `${app.selectedAddress.street}, ${app.selectedAddress.city}` : ""}
          </p>
          <p className="mt-1 text-sm">
            {app.partner ? (
              <span className="text-ivory-100">Partner: <b>{app.partner.name}</b> · {app.partner.phone}</span>
            ) : (
              <span className="text-ivory-200">Assigning a partner…</span>
            )}
            {" · "}Est. {rupee(app.priceEstimate || app.service?.startingPrice)}
          </p>
        </div>
      </div>
      <Timeline status={app.status} />
      {app.status === "completed" &&
        (app.rating ? (
          <p className="mt-3 text-sm text-clay-400">You rated this  <span className="inline-flex align-middle">{Array.from({ length: app.rating }, (_, i) => <Star key={i} size={14} />)}</span></p>
        ) : (
          <div className="mt-3 flex items-center gap-1">
            <span className="mr-2 text-sm text-ivory-200">Rate your experience:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-label={`${n} stars`} disabled={busy}
                onClick={() => { setRating(n); run(() => applicationsApi.review(app._id, { rating: n })); }}
                className={`${n <= rating ? "text-black" : "text-ink-600"} hover:text-black`}><Star size={24} filled={n <= rating} /></button>
            ))}
          </div>
        ))}
      {cancellable && (
        <button disabled={busy} className="mt-3 text-sm font-semibold text-black underline underline-offset-4"
          onClick={() => window.confirm("Cancel this booking?") && run(() => applicationsApi.cancel(app._id, {}))}>
          Cancel booking
        </button>
      )}
      <FormMessage>{err}</FormMessage>
    </article>
  );
}

export default function UserDashboard() {
  useTitle("My bookings — SevaNear");
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  const load = useCallback(async () => {
    const [a, ad] = await Promise.allSettled([applicationsApi.mine(), addressesApi.list()]);
    if (a.status === "fulfilled") setApps(a.value.data.data || []);
    if (ad.status === "fulfilled") setAddresses(ad.value.data.data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const active = apps.filter((a) => ["pending", "approved", "in_progress"].includes(a.status));
  const past = apps.filter((a) => !active.includes(a));
  const shown = tab === "active" ? active : past;

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="font-display text-3xl font-semibold text-ivory-50">Hi {user?.name?.split(" ")[0]}, here are your bookings</h1>
        </div>
        <Link to="/services" className="btn-accent"><Icon name="plus" size={16} /> Book a service</Link>
      </div>

      <div className="mt-6 inline-flex rounded-xl bg-ink-700 p-1">
        {[["active", `Active (${active.length})`], ["past", `Past (${past.length})`]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === k ? "bg-ink-800 text-ivory-50 shadow" : "text-ivory-200"}`}>{l}</button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {loading && <div className="skeleton h-40" />}
          {!loading && !shown.length && (
            <div className="card-surface p-8 text-center text-ivory-200">
              {tab === "active" ? "No active bookings." : "No past bookings yet."}{" "}
              <Link to="/services" className="font-semibold text-moss-400">Find a service</Link>
            </div>
          )}
          {shown.map((a) => <Booking key={a._id} app={a} onChange={load} />)}
        </div>
        <aside className="card-surface h-fit p-5">
          <h2 className="font-display text-xl font-semibold text-ivory-50">Saved addresses</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {addresses.map((ad) => (
              <li key={ad._id} className="flex justify-between gap-2 text-ivory-100">
                <span>{ad.street}, {ad.city}, {ad.state} {ad.zipCode}</span>
                <button aria-label="Delete address" className="text-ivory-200 hover:text-black"
                  onClick={() => addressesApi.remove(ad._id).then(load)}><Icon name="x" size={16} /></button>
              </li>
            ))}
            {!addresses.length && <li className="text-ivory-200">Add an address when you book.</li>}
          </ul>
        </aside>
      </div>
    </div>
  );
}
