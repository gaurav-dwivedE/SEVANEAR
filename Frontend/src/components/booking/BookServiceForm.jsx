import { useEffect, useState } from "react";
import Calendar from "../ui/Calendar";
import AddressForm from "../ui/AddressForm";
import FormMessage from "../ui/FormMessage";
import { addressesApi, applicationsApi, servicesApi, getErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { SLOTS, fmtDate, rupee, VISIT_FEE, platformFee, total } from "../../lib/format";

const today = () => new Date().toISOString().slice(0, 10);

export default function BookServiceForm({ service, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addrId, setAddrId] = useState("");
  const [adding, setAdding] = useState(false);
  const [avail, setAvail] = useState(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    addressesApi.list().then(({ data }) => {
      setAddresses(data.data || []);
      setAddrId(data.data?.[0]?._id || "");
      if (!data.data?.length) setAdding(true);
    });
  }, []);

  const addr = addresses.find((a) => a._id === addrId);
  useEffect(() => {
    if (!addr) return setAvail(null);
    setAvail(null);
    servicesApi.get(service._id, { pincode: addr.zipCode }).then(({ data }) => setAvail(data.data.availableAtPincode)).catch(() => setAvail(null));
  }, [addrId, addresses.length]);

  async function confirm() {
    setError(""); setBusy(true);
    try {
      await applicationsApi.create({ service: service._id, selectedAddress: addrId, additionalDetails: notes, scheduledDate: date, timeSlot: slot });
      onSuccess();
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setBusy(false); }
  }

  const Steps = () => (
    <ol className="mb-5 flex gap-1.5" aria-label="Progress">
      {["Date & time", "Address", "Review"].map((l, i) => (
        <li key={l} className="flex-1"><div className={`h-1 rounded-full ${i < step ? "bg-brand-600" : "bg-ink-700"}`} /><span className={`mt-1 block text-[11px] ${i + 1 === step ? "font-semibold" : "text-ivory-200"}`}>{l}</span></li>
      ))}
    </ol>
  );

  if (step === 1)
    return (
      <div className="space-y-4"><Steps />
        <Calendar value={date} onChange={setDate} />
        <div>
          <label className="label-field">Time slot</label>
          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map((s) => (
              <button type="button" key={s.v} onClick={() => setSlot(s.v)} className={`rounded-xl border px-3 py-2.5 text-sm ${slot === s.v ? "border-brand-600 bg-brand-600 text-white" : "border-ink-600 hover:border-brand-600"}`}>{s.l}</button>
            ))}
          </div>
        </div>
        <button className="btn-primary w-full" disabled={!date || !slot} onClick={() => setStep(2)}>Continue</button>
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-4"><Steps />
        {adding ? (
          <AddressForm defaultName={user?.name} defaultPin={user?.pincode} onCancel={addresses.length ? () => setAdding(false) : undefined}
            onSaved={(a) => { setAddresses((l) => [a, ...l]); setAddrId(a._id); setAdding(false); }} />
        ) : (
          <>
            <div className="space-y-2">
              {addresses.map((a) => (
                <label key={a._id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${addrId === a._id ? "border-brand-600 bg-brand-50" : "border-ink-600"}`}>
                  <input type="radio" className="mt-1 accent-black" checked={addrId === a._id} onChange={() => setAddrId(a._id)} />
                  <span><b>{a.label}</b> · {a.mobile}<br />{[a.houseNo, a.street, a.landmark].filter(Boolean).join(", ")}<br />{a.city}, {a.state} {a.zipCode}</span>
                </label>
              ))}
            </div>
            <button className="text-sm font-semibold underline underline-offset-4" onClick={() => setAdding(true)}>+ Add new address</button>
            {avail === false && <FormMessage>{service.name} isn't available at {addr?.zipCode} yet. Choose another address.</FormMessage>}
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary flex-1" disabled={!addrId || avail === false} onClick={() => setStep(3)}>Review booking</button>
            </div>
          </>
        )}
      </div>
    );

  return (
    <div className="space-y-4"><Steps />
      <div className="rounded-xl border border-ink-600 p-4 text-sm">
        <p className="font-semibold">{service.name}</p>
        <p className="text-ivory-200">{fmtDate(date)} · {SLOTS.find((s) => s.v === slot)?.l}</p>
        <p className="text-ivory-200">{addr && `${addr.street}, ${addr.city} ${addr.zipCode} · ${addr.mobile}`}</p>
      </div>
      <div><label className="label-field">Notes for the partner <span className="font-normal text-ivory-200">(optional)</span></label>
        <textarea className="input-field" rows={2} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate code, floor, what's wrong…" /></div>
      <div className="rounded-xl bg-ink-900 p-4 text-sm">
        <div className="flex justify-between"><span>Starting price</span><span>{rupee(service.startingPrice)}</span></div>
        <div className="flex justify-between text-ivory-200"><span>Visit fee</span><span>{rupee(VISIT_FEE)}</span></div>
        <div className="flex justify-between text-ivory-200"><span>Platform fee</span><span>{rupee(platformFee(service.startingPrice))}</span></div>
        <div className="mt-2 flex justify-between border-t border-dashed border-ink-600 pt-2 font-bold"><span>Estimated total</span><span>{rupee(total(service.startingPrice))}</span></div>
        <p className="mt-2 text-xs text-ivory-200">Pay the partner after the job. Parts are quoted and agreed before work starts.</p>
      </div>
      <FormMessage>{error}</FormMessage>
      <div className="flex gap-3">
        <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
        <button className="btn-primary flex-1" disabled={busy} onClick={confirm}>{busy ? "Booking…" : "Confirm booking"}</button>
      </div>
    </div>
  );
}
