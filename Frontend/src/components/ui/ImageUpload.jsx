import { useRef, useState } from "react";
import { uploadImage, getErrorMessage } from "../../lib/api";

// Uploads straight to Cloudinary (via the backend). Optional by default.
export default function ImageUpload({ value, onChange, folder = "services", label = "Photo", round = false }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(""); setBusy(true);
    try { onChange(await uploadImage(f, folder)); }
    catch (x) { setErr(getErrorMessage(x, "Upload failed.")); }
    finally { setBusy(false); e.target.value = ""; }
  }
  return (
    <div>
      <label className="label-field">{label} <span className="font-normal text-ivory-200">(optional)</span></label>
      <div className="flex items-center gap-3">
        <div className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden bg-ink-700 text-[10px] text-ivory-200 ${round ? "rounded-full" : "rounded-xl"}`}>
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : "No photo"}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost !px-4 !py-2" disabled={busy} onClick={() => ref.current?.click()}>{busy ? "Uploading…" : value ? "Replace" : "Upload"}</button>
          {value && <button type="button" className="btn-ghost !px-4 !py-2" onClick={() => onChange("")}>Remove</button>}
        </div>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={pick} />
      </div>
      {err && <p className="mt-1 text-xs font-semibold text-red-600">{err}</p>}
    </div>
  );
}
