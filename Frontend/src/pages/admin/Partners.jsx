import { useEffect, useState } from "react";
import { PageHead, Empty, IconBtn, Chip, useFlash } from "./shared";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ImageUpload from "../../components/ui/ImageUpload";
import PincodeField from "../../components/ui/PincodeField";
import FormMessage from "../../components/ui/FormMessage";
import Icon from "../../components/ui/Icon";
import { partnersApi, servicesApi, getErrorMessage } from "../../lib/api";

const blank = { name: "", phone: "", image: "", service: [], location: { street: "", city: "", state: "", pincode: "" }, serviceablePincodes: [], isActive: true };

export default function Partners() {
  const [list, setList] = useState(null);
  const [services, setServices] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);
  const [extra, setExtra] = useState("");
  const [del, setDel] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, flash] = useFlash();
  const load = () => partnersApi.list().then(({ data }) => setList(data.data));
  useEffect(() => { load(); servicesApi.list({ all: 1 }).then(({ data }) => setServices(data.data)); }, []);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const setLoc = (k, v) => setForm((s) => ({ ...s, location: { ...s.location, [k]: v } }));

  const open = (p) => { setErr(""); setExtra(""); setForm(p ? { ...p, service: p.service.map((s) => s._id) } : { ...blank }); };
  const toggleSvc = (id) => set("service", form.service.includes(id) ? form.service.filter((x) => x !== id) : [...form.service, id]);
  const addPin = () => {
    if (!/^[1-9][0-9]{5}$/.test(extra)) return setErr("Enter a valid 6-digit PIN code to add.");
    if (!form.serviceablePincodes.includes(extra)) set("serviceablePincodes", [...form.serviceablePincodes, extra]);
    setExtra(""); setErr("");
  };
  function locVerified(info) {
    if (!info) return;
    setForm((s) => ({
      ...s,
      location: { ...s.location, city: info.city, state: info.state },
      serviceablePincodes: s.serviceablePincodes.includes(s.location.pincode) || s.location.pincode.length !== 6 ? s.serviceablePincodes : [...s.serviceablePincodes, s.location.pincode],
    }));
  }
  async function save(e) {
    e.preventDefault(); setErr("");
    // Fold in anything typed but not yet added, and always cover the home PIN code.
    const pins = new Set(form.serviceablePincodes);
    if (/^[1-9][0-9]{5}$/.test(extra)) pins.add(extra);
    if (/^[1-9][0-9]{5}$/.test(form.location.pincode)) pins.add(form.location.pincode);
    const body = { ...form, serviceablePincodes: [...pins] };
    if (!body.name.trim()) return setErr("Enter the partner's name.");
    if (!/^[6-9][0-9]{9}$/.test(body.phone)) return setErr("Enter a valid 10-digit mobile number (starts with 6–9).");
    if (!body.service.length) return setErr("Select at least one service.");
    if (!body.serviceablePincodes.length) return setErr("Enter the home PIN code or add at least one service-area PIN code.");
    setBusy(true);
    try {
      form._id ? await partnersApi.update(form._id, body) : await partnersApi.create(body);
      setForm(null); flash("Partner saved"); load();
    } catch (x) { setErr(getErrorMessage(x)); } finally { setBusy(false); }
  }
  const shown = (list || []).filter((p) => (p.name + p.phone + p.serviceablePincodes.join(" ")).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      {toast}
      <PageHead title="Partners" sub="Professionals who fulfil bookings. A service is offered only in PIN codes a partner covers." action={<button className="btn-primary" onClick={() => open(null)}><Icon name="plus" size={16} /> Add partner</button>} />
      <input className="input-field mb-4 max-w-xs" placeholder="Search name, phone or PIN" value={q} onChange={(e) => setQ(e.target.value)} />
      {!list ? <div className="skeleton h-48" /> : !shown.length ? <Empty>No partners found.</Empty> : (
        <div className="grid gap-3 lg:grid-cols-2">
          {shown.map((p) => (
            <div key={p._id} className="flex gap-4 rounded-xl border border-ink-700 bg-white p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-600 text-lg text-white">{p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : p.name[0]}</div>
              <div className="min-w-0 flex-1 text-sm">
                <b>{p.name}</b> {!p.isActive && <Chip on={false}>Inactive</Chip>}
                <p className="text-ivory-200">{p.phone}{p.location?.city ? ` · ${p.location.city}` : ""}</p>
                <p className="mt-1">{p.service.map((s) => s.name).join(", ") || "No services"}</p>
                <div className="mt-2 flex flex-wrap gap-1">{p.serviceablePincodes.map((x) => <Chip key={x}>{x}</Chip>)}</div>
              </div>
              <div className="flex flex-col"><IconBtn icon="edit" label="Edit" onClick={() => open(p)} /><IconBtn icon="trash" label="Delete" onClick={() => setDel(p)} /></div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?._id ? "Edit partner" : "Add partner"} wide>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid items-start gap-3 sm:grid-cols-[auto_1fr_1fr]">
              <ImageUpload round value={form.image} onChange={(u) => set("image", u)} folder="partners" label="Photo" />
              <div><label className="label-field">Name *</label><input required className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div><label className="label-field">Mobile *</label><input required inputMode="numeric" maxLength={10} className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} /></div>
            </div>
            <div>
              <label className="label-field">Services offered *</label>
              <div className="flex flex-wrap gap-2">{services.map((s) => <button type="button" key={s._id} onClick={() => toggleSvc(s._id)} className={`rounded-full border px-3 py-1 text-sm ${form.service.includes(s._id) ? "border-brand-600 bg-brand-600 text-white" : "border-ink-600"}`}>{s.name}</button>)}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
              <PincodeField label="Home PIN code" value={form.location.pincode} onChange={(v) => setLoc("pincode", v)} onVerified={locVerified} />
              <div><label className="label-field">Address {form.location.city && <span className="font-normal text-ivory-200">· {form.location.city}, {form.location.state}</span>}</label>
                <input className="input-field" value={form.location.street} onChange={(e) => setLoc("street", e.target.value)} placeholder="House no., street, area" /></div>
            </div>
            <div>
              <label className="label-field">Service-area PIN codes *</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {form.serviceablePincodes.map((x) => (
                  <span key={x} className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs text-white">{x}<button type="button" aria-label={`Remove ${x}`} onClick={() => set("serviceablePincodes", form.serviceablePincodes.filter((y) => y !== x))}><Icon name="x" size={12} /></button></span>
                ))}
                {!form.serviceablePincodes.length && <span className="text-xs text-ivory-200">Add every PIN code this partner can reach.</span>}
              </div>
              <div className="flex gap-2"><input className="input-field max-w-[160px]" inputMode="numeric" maxLength={6} placeholder="Add PIN code" value={extra} onChange={(e) => setExtra(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPin())} /><button type="button" className="btn-ghost" onClick={addPin}>Add</button></div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-black" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Active (can receive bookings)</label>
            <FormMessage>{err}</FormMessage>
            <div className="flex gap-3"><button className="btn-primary flex-1" disabled={busy}>{busy ? "Saving…" : "Save partner"}</button><button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete partner?" message={`${del?.name} will be removed. Open bookings assigned to them become unassigned.`} onClose={() => setDel(null)}
        onConfirm={async () => { await partnersApi.remove(del._id); setDel(null); flash("Partner deleted"); load(); }} />
    </>
  );
}
