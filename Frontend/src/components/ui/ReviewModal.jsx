import { useState } from "react";
import Modal from "./Modal";
import FormMessage from "./FormMessage";
import { Star } from "./Icon";
import { applicationsApi, getErrorMessage } from "../../lib/api";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewModal({ booking, onClose, onDone }) {
  const editing = !!booking?.rating;
  const [rating, setRating] = useState(booking?.rating || 0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState(booking?.review || "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const shown = hover || rating;

  async function submit(e) {
    e.preventDefault();
    if (!rating) return setErr("Please choose a star rating.");
    setBusy(true); setErr("");
    try { await applicationsApi.review(booking._id, { rating, review: text.trim() }); onDone(); }
    catch (x) { setErr(getErrorMessage(x)); }
    finally { setBusy(false); }
  }
  return (
    <Modal open={!!booking} onClose={onClose} title={editing ? "Edit your review" : "Rate this service"}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-ivory-200">{booking?.service?.name}. Your review helps other customers choose.</p>
        <div>
          <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onMouseEnter={() => setHover(n)} onClick={() => setRating(n)}
                className={n <= shown ? "text-black" : "text-ink-600"}><Star size={34} filled={n <= shown} /></button>
            ))}
            <span className="ml-3 text-sm font-medium">{LABELS[shown]}</span>
          </div>
        </div>
        <div>
          <label className="label-field">Write a review <span className="font-normal text-ivory-200">(optional)</span></label>
          <textarea rows={4} maxLength={600} className="input-field" value={text} onChange={(e) => setText(e.target.value)} placeholder="How was the work? Was the partner on time and polite?" />
          <p className="mt-1 text-right text-xs text-ivory-200">{text.length}/600</p>
        </div>
        <FormMessage>{err}</FormMessage>
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Submit review"}</button>
      </form>
    </Modal>
  );
}
