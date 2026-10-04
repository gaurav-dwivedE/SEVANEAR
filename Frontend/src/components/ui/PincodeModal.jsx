import { useState } from "react";
import Modal from "./Modal";
import PincodeField from "./PincodeField";
import FormMessage from "./FormMessage";
import { useLocationCtx } from "../../context/LocationContext";

export default function PincodeModal() {
  const { askOpen, save, skip, pincode } = useLocationCtx();
  const [pin, setPin] = useState(pincode || "");
  const [info, setInfo] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!info) return setErr("Enter a valid PIN code first.");
    setBusy(true);
    const r = await save(pin);
    setBusy(false);
    if (!r.ok) setErr(r.message);
  }
  return (
    <Modal open={askOpen} onClose={skip} title="Where do you need service?">
      <p className="mb-4 text-sm text-ivory-200">
        Enter your PIN code and we'll show only the services available in your area.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <PincodeField value={pin} onChange={setPin} onVerified={setInfo} label="Your PIN code" autoFocus />
        <FormMessage>{err}</FormMessage>
        <button className="btn-primary w-full" disabled={busy || !info}>{busy ? "Saving…" : "Show services near me"}</button>
        <button type="button" onClick={skip} className="w-full text-center text-sm text-ivory-200 underline underline-offset-4">Not now</button>
      </form>
    </Modal>
  );
}
