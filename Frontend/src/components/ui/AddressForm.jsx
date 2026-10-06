import { useState } from "react";
import PincodeField from "./PincodeField";
import FormMessage from "./FormMessage";
import { addressesApi, getErrorMessage } from "../../lib/api";

export const emptyAddress = { label: "Home", contactName: "", mobile: "", houseNo: "", street: "", landmark: "", city: "", state: "", zipCode: "" };

// Create or edit an address. Mobile and a verified PIN code are mandatory.
export default function AddressForm({ initial, defaultName = "", defaultPin = "", onSaved, onCancel }) {
  const [f, setF] = useState(initial ? { ...emptyAddress, ...initial } : { ...emptyAddress, contactName: defaultName, zipCode: defaultPin });
  const [verified, setVerified] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  function pinVerified(info) {
    setVerified(info);
    if (info) setF((s) => ({ ...s, city: info.city, state: info.state }));
  }
  async function submit(e) {
    e.preventDefault();
    e.stopPropagation();
    setErr("");
    if (!/^[6-9][0-9]{9}$/.test(f.mobile)) return setErr("Enter a valid 10-digit mobile number.");
    if (!verified && !(initial && initial.zipCode === f.zipCode)) return setErr("Enter a valid PIN code.");
    if (!f.street.trim()) return setErr("Street / area is required.");
    setBusy(true);
    try {
      const { data } = initial?._id ? await addressesApi.update(initial._id, f) : await addressesApi.create(f);
      onSaved(data.data);
    } catch (x) { setErr(getErrorMessage(x)); }
    finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2">
        {["Home", "Work", "Other"].map((l) => (
          <button type="button" key={l} onClick={() => set("label", l)} className={`rounded-full border px-4 py-1.5 text-sm ${f.label === l ? "border-brand-600 bg-brand-600 text-white" : "border-ink-600"}`}>{l}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label-field">Contact name</label><input className="input-field" value={f.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Who will be at home?" /></div>
        <div><label className="label-field">Mobile number *</label><input className="input-field" inputMode="numeric" maxLength={10} required value={f.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" /></div>
        <PincodeField value={f.zipCode} onChange={(v) => set("zipCode", v)} onVerified={pinVerified} label="PIN code *" />
        <div><label className="label-field">City / State</label><input className="input-field bg-ink-900" readOnly value={f.city ? `${f.city}, ${f.state}` : ""} placeholder="Filled from PIN code" /></div>
        <div><label className="label-field">House / flat no.</label><input className="input-field" value={f.houseNo} onChange={(e) => set("houseNo", e.target.value)} placeholder="Flat 402, Wing B" /></div>
        <div><label className="label-field">Landmark</label><input className="input-field" value={f.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Near bus stand" /></div>
      </div>
      <div><label className="label-field">Street / area *</label><input className="input-field" required value={f.street} onChange={(e) => set("street", e.target.value)} placeholder="Building, street, locality" /></div>
      <FormMessage>{err}</FormMessage>
      <div className="flex gap-3">
        <button className="btn-primary flex-1" disabled={busy}>{busy ? "Saving…" : initial?._id ? "Save changes" : "Save address"}</button>
        {onCancel && <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
