import { useState } from "react";
import { Link } from "react-router-dom";
import PincodeField from "./ui/PincodeField";
import { servicesApi } from "../lib/api";
import { useLocationCtx } from "../context/LocationContext";

export default function AvailabilityChecker() {
  const { pincode, save } = useLocationCtx();
  const [pin, setPin] = useState(pincode || "");
  const [info, setInfo] = useState(null);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  async function check(e) {
    e.preventDefault();
    if (!info) return;
    setBusy(true);
    try {
      const { data } = await servicesApi.list({ pincode: pin });
      setRes({ pin, info, services: data.data || [] });
    } finally { setBusy(false); }
  }
  return (
    <div>
      <form onSubmit={check} className="flex items-end gap-2 rounded-xl border border-ink-600 bg-white p-3">
        <div className="flex-1"><PincodeField value={pin} onChange={(v) => { setPin(v); setRes(null); }} onVerified={setInfo} label="Enter your PIN code" /></div>
        <button className="btn-primary" disabled={!info || busy}>{busy ? "Checking…" : "Check"}</button>
      </form>
      {res && (
        <div className="fade-up mt-3 rounded-xl border border-ink-600 bg-white p-4">
          {res.services.length ? (
            <>
              <p className="font-semibold">Good news. {res.services.length} service{res.services.length > 1 ? "s are" : " is"} available in {res.info.city} ({res.pin}).</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {res.services.map((s) => <Link key={s._id} to={`/services/${s._id}`} className="rounded-full bg-ink-700 px-3 py-1 text-sm hover:bg-black hover:text-white">{s.name}</Link>)}
              </div>
              <button className="mt-3 text-sm underline underline-offset-4" onClick={() => save(res.pin)}>Use {res.pin} as my area</button>
            </>
          ) : (
            <p><b>We don't serve {res.pin} yet.</b> <span className="text-ivory-200">We're adding partners across new areas. Know a professional there? <Link to="/become-a-partner" className="underline">Ask them to apply</Link>.</span></p>
          )}
        </div>
      )}
    </div>
  );
}
