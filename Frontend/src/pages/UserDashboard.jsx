import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/ui/StatusBadge";
import FormMessage from "../components/ui/FormMessage";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ReviewModal from "../components/ui/ReviewModal";
import CancelModal from "../components/ui/CancelModal";
import Icon, { StarRow } from "../components/ui/Icon";
import { applicationsApi, getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import useTitle from "../lib/useTitle";
import { fmtDate, slotLabel, rupee, img, onImgError } from "../lib/format";

const FLOW = ["pending", "approved", "in_progress", "completed"];
const FLOW_LABEL = ["Requested", "Partner assigned", "On the job", "Completed"];
const ACTIVE = ["pending", "approved", "in_progress"];
const FILTERS = [["all", "All"], ["active", "Active"], ["completed", "Completed"], ["closed", "Cancelled"]];

function Timeline({ status }) {
  if (!ACTIVE.includes(status)) return null;
  const at = FLOW.indexOf(status);
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1 text-[11px] text-ivory-200">
      {FLOW_LABEL.map((l, i) => (
        <li key={l}><div className={`mb-1 h-1 rounded-full ${i <= at ? "bg-brand-600" : "bg-ink-700"}`} /><span className={i === at ? "font-semibold text-ivory-50" : ""}>{l}</span></li>
      ))}
    </ol>
  );
}

function Booking({ app, onCancel, onReview, onDelete }) {
  const done = app.status === "completed";
  const addr = app.selectedAddress;
  return (
    <article className="overflow-hidden rounded-xl border border-ink-700 bg-white">
      {done && (
        <div className="flex items-center gap-2 border-b border-ink-700 bg-brand-600 px-4 py-2 text-sm font-medium text-white">
          <Icon name="check" size={16} /> Job completed{app.paymentStatus === "paid" || app.invoice?.paymentStatus === "paid" ? " · Paid" : ""}
        </div>
      )}
      <div className="flex gap-4 p-4">
        <img src={img(app.service)} onError={onImgError} alt="" className="hidden h-20 w-24 shrink-0 rounded-lg object-cover sm:block" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg">{app.service?.name || "Service"}</h3>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-0.5 text-sm text-ivory-200">{app.scheduledDate ? `${fmtDate(app.scheduledDate)} · ${slotLabel(app.timeSlot)}` : "Schedule pending"}</p>
          {addr && <p className="text-sm text-ivory-200">{addr.street}, {addr.city} {addr.zipCode}</p>}
          <p className="mt-1 text-sm">
            {app.partner ? <>Partner: <b>{app.partner.name}</b> · <a className="underline" href={`tel:${app.partner.phone}`}>{app.partner.phone}</a></> : <span className="text-ivory-200">{ACTIVE.includes(app.status) ? "Assigning a partner…" : ""}</span>}
          </p>
        </div>
      </div>
      <Timeline status={app.status} />
      {app.status === "cancelled" && app.cancelReason && <p className="mx-4 mb-3 rounded-lg bg-ink-900 p-3 text-sm text-ivory-200">Cancelled: {app.cancelReason}</p>}
      {done && app.rating > 0 && (
        <div className="mx-4 mb-3 mt-3 rounded-lg bg-ink-900 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2"><StarRow value={app.rating} size={16} /><span className="font-medium">Your review</span></span>
            <button className="text-sm font-semibold underline underline-offset-4" onClick={() => onReview(app)}>Edit</button>
          </div>
          {app.review && <p className="mt-1 text-ivory-200">“{app.review}”</p>}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 border-t border-ink-700 px-4 py-3">
        <span className="mr-auto text-sm text-ivory-200">{done ? "Total" : "Estimated"} <b className="text-ivory-50">{rupee(app.invoice?.total ?? app.priceEstimate)}</b></span>
        <Link to={`/bookings/${app._id}/invoice`} className="btn-ghost !px-4 !py-2">View invoice</Link>
        {done && !app.rating && <button className="btn-primary !px-4 !py-2" onClick={() => onReview(app)}>Rate & review</button>}
        {["pending", "approved"].includes(app.status) && <button className="btn-ghost !px-4 !py-2" onClick={() => onCancel(app)}>Cancel</button>}
        {!ACTIVE.includes(app.status) && <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink-700" aria-label="Delete booking" title="Delete booking" onClick={() => onDelete(app)}><Icon name="trash" size={17} /></button>}
      </div>
    </article>
  );
}

export default function UserDashboard() {
  useTitle("My bookings — ServiceHome");
  const { user } = useAuth();
  const [apps, setApps] = useState(null);
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");
  const [cancel, setCancel] = useState(null);
  const [review, setReview] = useState(null);
  const [del, setDel] = useState(null);

  const load = useCallback(() => applicationsApi.mine().then(({ data }) => setApps(data.data || [])).catch((e) => setErr(getErrorMessage(e))), []);
  useEffect(() => { load(); }, [load]);

  const match = (a) => filter === "all" || (filter === "active" && ACTIVE.includes(a.status)) || (filter === "completed" && a.status === "completed") || (filter === "closed" && ["cancelled", "rejected"].includes(a.status));
  const count = (k) => (apps || []).filter((a) => k === "all" || (k === "active" && ACTIVE.includes(a.status)) || (k === "completed" && a.status === "completed") || (k === "closed" && ["cancelled", "rejected"].includes(a.status))).length;
  const list = (apps || []).filter(match);

  return (
    <div className="container-page max-w-3xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-3xl md:text-4xl">My bookings</h1><p className="mt-1 text-ivory-200">Hi {user?.name?.split(" ")[0]}, here's everything you've booked.</p></div>
        <Link to="/#services" className="btn-primary"><Icon name="plus" size={16} /> Book a service</Link>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {FILTERS.map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${filter === k ? "border-brand-600 bg-brand-600 text-white" : "border-ink-600 hover:border-brand-600"}`}>{l} {apps ? <span className="opacity-60">{count(k)}</span> : null}</button>
        ))}
      </div>
      <FormMessage>{err}</FormMessage>
      <div className="mt-4 space-y-4">
        {!apps && <div className="skeleton h-40" />}
        {apps && !list.length && <div className="rounded-xl border border-dashed border-ink-600 p-10 text-center text-ivory-200">Nothing here yet. <Link to="/#services" className="font-semibold text-brand-600 underline">Find a service</Link></div>}
        {list.map((a) => <Booking key={a._id} app={a} onCancel={setCancel} onReview={setReview} onDelete={setDel} />)}
      </div>
      {cancel && <CancelModal booking={cancel} onClose={() => setCancel(null)} onDone={() => { setCancel(null); load(); }} />}
      <ConfirmDialog open={!!del} title="Delete this booking?" message="It will be removed from your list. If you left a review, it stays on the service page." onClose={() => setDel(null)}
        onConfirm={async () => { try { await applicationsApi.removeMine(del._id); setApps((l) => l.filter((x) => x._id !== del._id)); } catch (e) { setErr(getErrorMessage(e)); } setDel(null); }} />
      {review && <ReviewModal booking={review} onClose={() => setReview(null)} onDone={() => { setReview(null); load(); }} />}
    </div>
  );
}
