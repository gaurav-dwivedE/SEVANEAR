import { useState } from "react";
import Modal from "./Modal";
import FormMessage from "./FormMessage";
import { applicationsApi, getErrorMessage } from "../../lib/api";

export const REASONS = [
  ["changed_plans", "My plans changed"],
  ["schedule", "I need a different date or time"],
  ["other_provider", "I found another provider"],
  ["price", "The price is higher than I expected"],
  ["mistake", "I booked by mistake or with wrong details"],
  ["other", "Other"],
];

export default function CancelModal({ booking, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!reason) return setErr("Please select a reason.");
    if (reason === "other" && note.trim().length < 3) return setErr("Please tell us the reason.");
    setBusy(true); setErr("");
    try { await applicationsApi.cancel(booking._id, { reason, note: note.trim() }); onDone(); }
    catch (x) { setErr(getErrorMessage(x)); }
    finally { setBusy(false); }
  }
  return (
    <Modal open={!!booking} onClose={onClose} title="Cancel booking">
      <form onSubmit={submit} className="space-y-3">
        <p className="text-sm text-ivory-200">Why are you cancelling {booking?.service?.name}? This helps us improve.</p>
        <fieldset className="space-y-2">
          {REASONS.map(([v, l]) => (
            <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${reason === v ? "border-brand-600 bg-brand-50" : "border-ink-600"}`}>
              <input type="radio" name="reason" className="accent-black" checked={reason === v} onChange={() => setReason(v)} />{l}
            </label>
          ))}
        </fieldset>
        {reason === "other" && (
          <textarea autoFocus rows={3} maxLength={200} className="input-field" placeholder="Tell us the reason" value={note} onChange={(e) => setNote(e.target.value)} />
        )}
        <FormMessage>{err}</FormMessage>
        <div className="flex gap-3">
          <button type="button" className="btn-ghost" onClick={onClose}>Keep booking</button>
          <button className="btn-primary flex-1" disabled={busy}>{busy ? "Cancelling…" : "Cancel booking"}</button>
        </div>
      </form>
    </Modal>
  );
}
