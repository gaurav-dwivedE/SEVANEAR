import { useEffect, useMemo, useState } from "react";
import { PageHead, Empty, IconBtn, useFlash, fmtD } from "./shared";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { applicationsApi, partnersApi, servicesApi, getErrorMessage } from "../../lib/api";
import Modal from "../../components/ui/Modal";
import StatusBadge from "../../components/ui/StatusBadge";
import { slotLabel, rupee, VISIT_FEE, platformFee, total } from "../../lib/format";

const STATUSES = [["pending", "Requested"], ["approved", "Confirmed"], ["in_progress", "In progress"], ["completed", "Completed"], ["rejected", "Declined"], ["cancelled", "Cancelled"]];
const empty = { status: "", service: "", from: "", to: "", q: "" };

function Charges({ b, onSave }) {
  const [rows, setRows] = useState(b.adjustments || []);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const add = () => { if (label.trim() && Number(amount)) { setRows([...rows, { label: label.trim(), amount: Math.round(Number(amount)) }]); setLabel(""); setAmount(""); } };
  const dirty = JSON.stringify(rows) !== JSON.stringify(b.adjustments || []);
  return (
    <div className="space-y-2 text-sm">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-ink-900 px-3 py-2"><span>{r.label}</span><span className="flex items-center gap-3">{r.amount < 0 ? `− ${rupee(-r.amount)}` : rupee(r.amount)}<button className="text-ivory-200 hover:text-brand-600" aria-label="Remove charge" onClick={() => setRows(rows.filter((_, j) => j !== i))}>✕</button></span></div>
      ))}
      <div className="flex gap-2">
        <input className="input-field !py-2" placeholder="e.g. Capacitor replaced" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input className="input-field !w-28 !py-2" type="number" placeholder="₹ amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="button" className="btn-ghost !px-4 !py-2" onClick={add}>Add</button>
      </div>
      <p className="text-xs text-ivory-200">Use a negative amount for a discount. These lines appear on the customer's invoice.</p>
      {dirty && <button className="btn-primary !py-2" onClick={() => onSave(rows)}>Save charges</button>}
    </div>
  );
}

export default function Bookings() {
  const [f, setF] = useState(empty);
  const [rows, setRows] = useState(null);
  const [partners, setPartners] = useState([]);
  const [services, setServices] = useState([]);
  const [del, setDel] = useState(null);
  const [view, setView] = useState(null);
  const [toast, flash] = useFlash();
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    partnersApi.list().then(({ data }) => setPartners(data.data));
    servicesApi.list({ all: 1 }).then(({ data }) => setServices(data.data));
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v));
      if (params.status === "cancelled_by_user") { params.status = "cancelled"; params.cancelledBy = "user"; }
      applicationsApi.all(params).then(({ data }) => setRows(data.data)).catch((e) => flash(getErrorMessage(e)));
    }, f.q ? 300 : 0);
    return () => clearTimeout(t);
  }, [f]);

  // Update in place: no refetch, no navigation, filters and scroll position stay.
  async function patch(id, body, msg) {
    try {
      const { data } = await applicationsApi.update(id, body);
      const pid = data.data.partner?._id || data.data.partner;
      const extra = { adjustments: data.data.adjustments, paymentStatus: data.data.paymentStatus, paidAt: data.data.paidAt, cancelledBy: data.data.cancelledBy, cancelReason: data.data.cancelReason, cancelledAt: data.data.cancelledAt };
      setRows((r) => r.map((x) => (x._id === id ? { ...x, ...extra, status: data.data.status, partner: pid ? partners.find((p) => p._id === pid) || data.data.partner : null } : x)));
      setView((v) => (v && v._id === id ? { ...v, ...extra, status: data.data.status, partner: pid ? partners.find((p) => p._id === pid) || data.data.partner : null } : v));
      flash(msg);
    } catch (e) { flash(getErrorMessage(e)); }
  }
  const eligible = (b) => partners.filter((p) => p.isActive && p.service.some((s) => s._id === b.service?._id) && p.serviceablePincodes.includes(b.selectedAddress?.zipCode));
  const active = Object.values(f).some(Boolean);
  const count = useMemo(() => rows?.length ?? 0, [rows]);

  return (
    <>
      {toast}
      <PageHead title="Bookings" sub={rows ? `${count} booking${count === 1 ? "" : "s"}${active ? " match your filters" : ""}` : ""} />
      <div className="mb-4 grid gap-2 rounded-xl border border-ink-700 bg-white p-3 sm:grid-cols-2 lg:grid-cols-6">
        <input className="input-field lg:col-span-2" placeholder="Search customer, service, PIN, mobile" value={f.q} onChange={(e) => set("q", e.target.value)} />
        <select className="input-field" value={f.status} onChange={(e) => set("status", e.target.value)}><option value="">All statuses</option><option value="cancelled_by_user">Cancelled by customer</option>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select className="input-field" value={f.service} onChange={(e) => set("service", e.target.value)}><option value="">All services</option>{services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select>
        <input type="date" className="input-field" aria-label="From date" value={f.from} onChange={(e) => set("from", e.target.value)} />
        <div className="flex gap-2"><input type="date" className="input-field" aria-label="To date" value={f.to} onChange={(e) => set("to", e.target.value)} />{active && <button className="btn-ghost !px-3" onClick={() => setF(empty)}>Clear</button>}</div>
      </div>
      {!rows ? <div className="skeleton h-64" /> : !rows.length ? <Empty>No bookings found.</Empty> : (
        <div className="overflow-x-auto rounded-xl border border-ink-700 bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-ink-700 bg-ink-900 text-xs uppercase tracking-wide text-ivory-200"><tr>{["Customer", "Service", "When", "Where", "Partner", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-ink-700">
              {rows.map((b) => {
                const opts = eligible(b);
                return (
                  <tr key={b._id} className={`align-top ${b.status === "cancelled" && b.cancelledBy === "user" ? "bg-ink-900" : ""}`}>
                    <td className="px-4 py-3"><b>{b.user?.name || "Deleted user"}</b><br /><span className="text-ivory-200">{b.user?.email}</span><br /><span className="text-ivory-200">{b.selectedAddress?.contactName && b.selectedAddress.contactName !== b.user?.name ? `${b.selectedAddress.contactName} · ` : ""}{b.selectedAddress?.mobile}</span></td>
                    <td className="px-4 py-3">{b.service?.name}<br /><span className="text-ivory-200">{rupee(b.priceEstimate)}</span>{b.additionalDetails && <p className="mt-1 max-w-[180px] text-xs text-ivory-200">“{b.additionalDetails}”</p>}</td>
                    <td className="px-4 py-3">{fmtD(b.scheduledDate)}<br /><span className="text-ivory-200">{slotLabel(b.timeSlot)}</span></td>
                    <td className="max-w-[200px] px-4 py-3">{[b.selectedAddress?.houseNo, b.selectedAddress?.street].filter(Boolean).join(", ")}<br /><span className="text-ivory-200">{b.selectedAddress?.city} {b.selectedAddress?.zipCode}</span></td>
                    <td className="px-4 py-3">
                      <select className="input-field !py-2 text-sm" value={b.partner?._id || ""} onChange={(e) => e.target.value && patch(b._id, { partner: e.target.value }, "Partner assigned")} aria-label="Assign partner">
                        <option value="">{opts.length ? "Assign partner…" : "No partner covers this area"}</option>
                        {b.partner && !opts.some((p) => p._id === b.partner._id) && <option value={b.partner._id}>{b.partner.name}</option>}
                        {opts.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {b.status === "cancelled" && b.cancelledBy === "user" && (
                        <div className="mb-2 rounded-lg border border-brand-600 px-2.5 py-1.5 text-xs"><b>Cancelled by customer</b>{b.cancelReason && <p className="mt-0.5 text-ivory-200">{b.cancelReason}</p>}</div>
                      )}
                      <select className="input-field !py-2 text-sm" value={b.status} onChange={(e) => patch(b._id, { status: e.target.value }, "Status updated")} aria-label="Status">
                        {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3"><IconBtn icon="list" label="View all details" onClick={() => setView(b)} /><IconBtn icon="trash" label="Delete booking" onClick={() => setDel(b)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title="Booking details" wide>
        {view && (() => {
          const a = view.selectedAddress || {};
          const Row = ({ k, v }) => <div className="flex justify-between gap-4 border-b border-ink-700 py-2 text-sm last:border-0"><dt className="text-ivory-200">{k}</dt><dd className="max-w-[65%] text-right font-medium">{v || "—"}</dd></div>;
          const Sec = ({ t, children }) => <section className="mb-5"><h4 className="mb-1 text-xs font-semibold text-ivory-200">{t}</h4><dl>{children}</dl></section>;
          return (
            <div>
              <div className="mb-4 flex items-center justify-between"><p className="font-display text-xl">{view.service?.name}</p><StatusBadge status={view.status} /></div>
              <Sec t="Customer">
                <Row k="Account name" v={view.user?.name} /><Row k="Email" v={view.user?.email} /><Row k="Customer since" v={fmtD(view.user?.createdAt)} /><Row k="Saved PIN code" v={view.user?.pincode} />
              </Sec>
              <Sec t="Contact at the address">
                <Row k="Contact name" v={a.contactName || view.user?.name} /><Row k="Mobile" v={a.mobile && <a className="underline" href={`tel:${a.mobile}`}>{a.mobile}</a>} /><Row k="Address type" v={a.label} />
              </Sec>
              <Sec t="Service address">
                <Row k="House / flat" v={a.houseNo} /><Row k="Street / area" v={a.street} /><Row k="Landmark" v={a.landmark} /><Row k="City, state" v={a.city && `${a.city}, ${a.state}`} /><Row k="PIN code" v={a.zipCode} />
              </Sec>
              <Sec t="Schedule">
                <Row k="Date" v={fmtD(view.scheduledDate)} /><Row k="Time slot" v={slotLabel(view.timeSlot)} /><Row k="Booked on" v={fmtD(view.createdAt)} />
              </Sec>
              <Sec t="Price (estimate)">
                <Row k="Starting price" v={rupee(view.service?.startingPrice)} /><Row k="Visit fee" v={rupee(VISIT_FEE)} /><Row k="Platform fee" v={rupee(platformFee(view.service?.startingPrice || 0))} /><Row k="Estimated total" v={<b>{rupee(total(view.service?.startingPrice || 0))}</b>} />
              </Sec>
              <Sec t="Extra charges (parts, extra work)">
                <Charges key={view._id + (view.adjustments || []).length} b={view} onSave={(rows) => patch(view._id, { adjustments: rows }, "Charges saved")} />
              </Sec>
              <Sec t="Payment">
                <div className="flex items-center justify-between py-2 text-sm"><span>{view.paymentStatus === "paid" ? `Paid${view.paidAt ? " on " + fmtD(view.paidAt) : ""}` : "Not paid yet (customer pays the partner after the job)"}</span>
                  <button className="btn-ghost !px-4 !py-2" onClick={() => patch(view._id, { paymentStatus: view.paymentStatus === "paid" ? "unpaid" : "paid" }, view.paymentStatus === "paid" ? "Marked unpaid" : "Marked paid")}>{view.paymentStatus === "paid" ? "Mark unpaid" : "Mark as paid"}</button></div>
              </Sec>
              <Sec t="Notes and partner">
                <Row k="Customer notes" v={view.additionalDetails} /><Row k="Partner" v={view.partner ? `${view.partner.name} · ${view.partner.phone}` : "Not assigned"} />
                {view.rating ? <Row k="Customer rating" v={`${view.rating} / 5${view.review ? ` · “${view.review}”` : ""}`} /> : null}
                {view.status === "cancelled" ? <Row k="Cancelled by" v={view.cancelledBy === "user" ? `Customer${view.cancelledAt ? " on " + fmtD(view.cancelledAt) : ""}` : view.cancelledBy === "admin" ? "Admin" : "—"} /> : null}
                {view.cancelReason ? <Row k="Cancel reason" v={view.cancelReason} /> : null}
              </Sec>
            </div>
          );
        })()}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete booking?" message="This permanently removes the booking record." onClose={() => setDel(null)}
        onConfirm={async () => { await applicationsApi.remove(del._id); setRows((r) => r.filter((x) => x._id !== del._id)); setDel(null); flash("Booking deleted"); }} />
    </>
  );
}
