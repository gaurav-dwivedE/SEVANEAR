import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { applicationsApi, getErrorMessage } from "../lib/api";
import { fmtDate, slotLabel, rupee } from "../lib/format";
import useTitle from "../lib/useTitle";
import Icon from "../components/ui/Icon";

export default function Invoice() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [err, setErr] = useState("");
  useTitle("Invoice — ServiceHome");
  useEffect(() => { applicationsApi.get(id).then(({ data }) => setB(data.data)).catch((e) => setErr(getErrorMessage(e))); }, [id]);

  if (err) return <div className="container-page py-20 text-center"><p>{err}</p><Link to="/bookings" className="btn-primary mt-5">Back to bookings</Link></div>;
  if (!b) return <div className="container-page max-w-3xl py-10"><div className="skeleton h-96" /></div>;
  const inv = b.invoice, p = inv.pricing, a = b.selectedAddress || {};
  const Row = ({ k, v, bold }) => <div className={`flex justify-between gap-6 py-2 text-sm ${bold ? "font-bold" : ""}`}><span className={bold ? "" : "text-ivory-200"}>{k}</span><span>{v}</span></div>;

  return (
    <div className="container-page max-w-3xl py-8">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link to="/bookings" className="inline-flex items-center gap-1 text-sm text-ivory-200 hover:text-brand-600"><Icon name="left" size={16} /> My bookings</Link>
        <button className="btn-ghost !py-2" onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
      <div className="rounded-xl border border-ink-600 bg-white p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-700 pb-6">
          <div><p className="font-display text-2xl font-extrabold">ServiceHome</p><p className="text-sm text-ivory-200">support@servicehome.in</p></div>
          <div className="text-right text-sm"><p className="text-lg font-bold">{inv.isFinal ? "Invoice" : "Estimate"}</p><p className="text-ivory-200">No. {inv.number}</p><p className="text-ivory-200">Booked {fmtDate(b.createdAt)}</p></div>
        </div>

        <div className="grid gap-6 py-6 text-sm sm:grid-cols-2">
          <div><p className="mb-1 font-semibold">Billed to</p><p>{a.contactName || b.user?.name}</p><p className="text-ivory-200">{a.mobile}</p><p className="text-ivory-200">{b.user?.email}</p></div>
          <div><p className="mb-1 font-semibold">Service address</p><p className="text-ivory-200">{[a.houseNo, a.street, a.landmark].filter(Boolean).join(", ")}<br />{a.city}, {a.state} {a.zipCode}</p></div>
          <div><p className="mb-1 font-semibold">Service</p><p>{b.service?.name}</p><p className="text-ivory-200">{fmtDate(b.scheduledDate)} · {slotLabel(b.timeSlot)}</p></div>
          <div><p className="mb-1 font-semibold">Partner</p><p>{b.partner ? `${b.partner.name} · ${b.partner.phone}` : "Not assigned yet"}</p></div>
        </div>

        <div className="rounded-lg bg-ink-900 px-5 py-3">
          <Row k={`${b.service?.name} (starting price)`} v={rupee(p.servicePrice)} />
          <Row k="Visit fee" v={rupee(p.visitFee)} />
          <Row k="Platform fee (5%)" v={rupee(p.platformFee)} />
          {inv.adjustments.map((x, i) => <Row key={i} k={x.label} v={x.amount < 0 ? `− ${rupee(-x.amount)}` : rupee(x.amount)} />)}
          <div className="mt-1 border-t border-ink-600 pt-2"><Row bold k={inv.isFinal ? "Total" : "Estimated total"} v={rupee(inv.total)} /></div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className={`rounded-full border px-3 py-1 font-semibold ${inv.paymentStatus === "paid" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{inv.paymentStatus === "paid" ? `Paid${inv.paidAt ? " on " + fmtDate(inv.paidAt) : ""}` : "Payment due after the job"}</span>
          <span className="text-ivory-200">{inv.isFinal ? "Thank you for choosing ServiceHome." : "Final amount is confirmed once the job is done. Parts or extra work are added only with your approval."}</span>
        </div>
      </div>
    </div>
  );
}
