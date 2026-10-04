import { useEffect, useState } from "react";
import { lookupPincode, getErrorMessage } from "../../lib/api";

// 6-digit PIN input that verifies with the India Post API and reports city/state.
export default function PincodeField({ value, onChange, onVerified, label = "PIN code", autoFocus }) {
  const [state, setState] = useState({ s: "idle", msg: "" });
  useEffect(() => {
    if (!/^[1-9][0-9]{5}$/.test(value || "")) {
      setState({ s: "idle", msg: "" });
      onVerified?.(null);
      return undefined;
    }
    let ignore = false;
    setState({ s: "checking", msg: "Checking PIN code…" });
    lookupPincode(value)
      .then((info) => {
        if (ignore) return;
        setState({ s: "ok", msg: `${info.city}, ${info.state}` });
        onVerified?.(info);
      })
      .catch((e) => {
        if (ignore) return;
        setState({ s: "bad", msg: getErrorMessage(e, "Could not verify this PIN code.") });
        onVerified?.(null);
      });
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <div>
      {label && <label className="label-field">{label}</label>}
      <input
        className="input-field" inputMode="numeric" maxLength={6} placeholder="e.g. 410401" autoFocus={autoFocus}
        value={value || ""} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      {state.msg && (
        <p className={`mt-1.5 text-xs ${state.s === "bad" ? "font-semibold text-black" : "text-ivory-200"}`}>
          {state.msg}
        </p>
      )}
    </div>
  );
}
