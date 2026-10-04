import { useRef, useState } from "react";
import Icon from "./Icon";
import { uploadImage, getErrorMessage } from "../../lib/api";

const MAX = 5;

// Up to 5 images. The first one is the cover shown on cards.
export default function MultiImageUpload({ value = [], onChange, folder = "services", label = "Photos" }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const room = MAX - value.length;

  async function pick(e) {
    const files = [...(e.target.files || [])].slice(0, room);
    e.target.value = "";
    if (!files.length) return;
    setErr(""); setBusy(files.length);
    const urls = [];
    for (const f of files) {
      try { urls.push(await uploadImage(f, folder)); }
      catch (x) { setErr(getErrorMessage(x, "Upload failed.")); }
      setBusy((n) => n - 1);
    }
    if (urls.length) onChange([...value, ...urls].slice(0, MAX));
  }
  const makeCover = (i) => onChange([value[i], ...value.filter((_, j) => j !== i)]);

  return (
    <div>
      <label className="label-field">{label} <span className="font-normal text-ivory-200">(optional, up to {MAX}. {value.length}/{MAX} added)</span></label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {value.map((u, i) => (
          <div key={u} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-700">
            <img src={u} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-black px-1.5 py-0.5 text-[10px] font-medium text-white">Cover</span>}
            <button type="button" aria-label="Remove photo" onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow"><Icon name="x" size={13} /></button>
            {i !== 0 && <button type="button" onClick={() => makeCover(i)} className="absolute inset-x-1 bottom-1 rounded bg-white/95 py-0.5 text-[11px] font-medium opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100">Make cover</button>}
          </div>
        ))}
        {Array.from({ length: busy }, (_, i) => <div key={`b${i}`} className="skeleton aspect-square" />)}
        {room - busy > 0 && (
          <button type="button" onClick={() => ref.current?.click()} className="grid aspect-square place-items-center rounded-lg border border-dashed border-ink-600 text-xs text-ivory-200 hover:border-black hover:text-black">
            <span className="flex flex-col items-center gap-1"><Icon name="plus" size={20} />Add photo</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={pick} />
      {err && <p className="mt-1 text-xs font-semibold text-black">{err}</p>}
    </div>
  );
}
