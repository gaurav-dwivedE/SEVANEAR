import { useEffect, useState } from "react";
import { addressesApi, applicationsApi, getErrorMessage } from "../../lib/api";
import FormMessage from "../ui/FormMessage";
import { SLOTS, isoDay, fmtDate, rupee, VISIT_FEE, platformFee, total } from "../../lib/format";

const emptyAddress = { street: "", city: "", state: "", zipCode: "", mobile: "", belongsTo: "user" };

export default function BookServiceForm({ service, onSuccess }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(isoDay(0));
  const [slot, setSlot] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    addressesApi
      .list()
      .then(({ data }) => {
        if (ignore) return;
        const list = data.data || [];
        setAddresses(list);
        if (list.length) setSelectedAddress(list[0]._id);
        else setAddingAddress(true);
      })
      .catch(() => setAddingAddress(true))
      .finally(() => !ignore && setLoadingAddresses(false));
    return () => {
      ignore = true;
    };
  }, []);

  async function handleAddAddress(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await addressesApi.create(newAddress);
      setAddresses((prev) => [data.data, ...prev]);
      setSelectedAddress(data.data._id);
      setAddingAddress(false);
      setNewAddress(emptyAddress);
    } catch (err) {
      setError(getErrorMessage(err, "Could not save that address."));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!slot) {
      setError("Please choose a time slot.");
      return;
    }
    if (!selectedAddress) {
      setError("Please select or add an address first.");
      return;
    }
    setSubmitting(true);
    try {
      await applicationsApi.create({
        service: service._id,
        selectedAddress,
        additionalDetails: details,
        scheduledDate: date,
        timeSlot: slot,
      });
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not submit your booking."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingAddresses) {
    return <p className="text-sm text-ivory-200/50">Loading your addresses…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card-surface bg-ink-950/40 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-ivory-200/45">Booking</p>
        <p className="mt-1 font-display text-xl text-ivory-50">{service.name}</p>
        
      </div>

      <div>
        <label className="label-field">When should we come?</label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[0, 1, 2, 3, 4, 5, 6].map((o) => (
            <button type="button" key={o} onClick={() => setDate(isoDay(o))}
              className={`shrink-0 rounded-xl border px-3 py-2 text-sm ${date === isoDay(o) ? "border-moss-600 bg-moss-600 text-white" : "border-ink-600 bg-ink-800"}`}>
              {o === 0 ? "Today" : o === 1 ? "Tomorrow" : fmtDate(isoDay(o))}
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SLOTS.map((s) => (
            <button type="button" key={s.v} onClick={() => setSlot(s.v)}
              className={`rounded-xl border px-3 py-2 text-sm ${slot === s.v ? "border-moss-600 bg-black/5 font-semibold" : "border-ink-600 bg-ink-800"}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {!addingAddress && (
        <div>
          <label className="label-field">Service address</label>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
                  selectedAddress === addr._id
                    ? "border-black bg-black/5"
                    : "border-ivory-100/10 hover:border-ivory-100/25"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mt-1"
                  checked={selectedAddress === addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                />
                <span className="text-ivory-200/75">
                  {addr.street}, {addr.city}, {addr.state} — {addr.zipCode}
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAddingAddress(true)}
            className="mt-3 text-sm text-clay-400 hover:text-clay-500"
          >
            + Add a new address
          </button>
        </div>
      )}

      {addingAddress && (
        <div className="space-y-3 rounded-xl border border-ivory-100/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-ivory-200/45">New address</p>
          <input
            className="input-field"
            placeholder="Street / house no."
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input-field"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input-field"
              placeholder="PIN code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Mobile (optional)"
              value={newAddress.mobile}
              onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleAddAddress} className="btn-primary !py-2 text-xs">
              Save address
            </button>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setAddingAddress(false)}
                className="btn-ghost !py-2 text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="label-field">Additional details (optional)</label>
        <textarea
          className="input-field min-h-[90px] resize-none"
          placeholder="Anything the partner should know?"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <div className="card-surface p-4 text-sm">
        <div className="flex justify-between"><span>{service.name} (from)</span><span>{rupee(service.startingPrice)}</span></div>
        <div className="flex justify-between text-ivory-200"><span>Visit fee</span><span>{rupee(VISIT_FEE)}</span></div>
        <div className="flex justify-between text-ivory-200"><span>Platform fee</span><span>{rupee(platformFee(service.startingPrice))}</span></div>
        <div className="mt-2 flex justify-between border-t border-dashed border-ink-600 pt-2 font-bold"><span>Estimated total</span><span>{rupee(total(service.startingPrice))}</span></div>
        <p className="mt-2 text-xs text-ivory-200">Pay the partner after the job is done. Final price is confirmed before work starts.</p>
      </div>

      <FormMessage>{error}</FormMessage>

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? "Submitting…" : "Confirm booking"}
      </button>
    </form>
  );
}
