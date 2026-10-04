import { useEffect, useState } from "react";
import { PageHead, Empty, IconBtn, Chip, useFlash } from "./shared";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import MultiImageUpload from "../../components/ui/MultiImageUpload";
import FormMessage from "../../components/ui/FormMessage";
import Icon from "../../components/ui/Icon";
import { categoriesApi, servicesApi, getErrorMessage } from "../../lib/api";
import { img, onImgError, rupee } from "../../lib/format";

const blank = { name: "", category: "", description: "", startingPrice: "", durationMins: 60, inclusions: "", images: [], isActive: true };

export default function AdminServices() {
  const [list, setList] = useState(null);
  const [cats, setCats] = useState([]);
  const [fc, setFc] = useState("");
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, flash] = useFlash();
  const load = () => servicesApi.list({ all: 1 }).then(({ data }) => setList(data.data));
  useEffect(() => { load(); categoriesApi.list(true).then(({ data }) => setCats(data.data)); }, []);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const shown = (list || []).filter((s) => (!fc || s.category?._id === fc) && s.name.toLowerCase().includes(q.toLowerCase()));

  function openEdit(s) {
    setErr("");
    setForm(s ? { ...s, images: s.images?.length ? s.images : s.image ? [s.image] : [], category: s.category?._id || "", inclusions: (s.inclusions || []).join("\n") } : { ...blank, category: cats[0]?._id || "" });
  }
  async function save(e) {
    e.preventDefault(); setErr("");
    if (!form.category) return setErr("Please select a category.");
    setBusy(true);
    try {
      form._id ? await servicesApi.update(form._id, form) : await servicesApi.create(form);
      setForm(null); flash(form._id ? "Service updated" : "Service created"); load();
    } catch (x) { setErr(getErrorMessage(x)); } finally { setBusy(false); }
  }
  async function remove() {
    try { await servicesApi.remove(del._id); setDel(null); flash("Service deleted"); load(); }
    catch (x) { setDel(null); flash(getErrorMessage(x)); }
  }
  return (
    <>
      {toast}
      <PageHead title="Services" sub="What customers can book." action={<button className="btn-primary" onClick={() => openEdit(null)} disabled={!cats.length}><Icon name="plus" size={16} /> Add service</button>} />
      {!cats.length && <div className="mb-4"><FormMessage>Create a category first, then add services to it.</FormMessage></div>}
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input-field max-w-xs" placeholder="Search services" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input-field max-w-[200px]" value={fc} onChange={(e) => setFc(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      </div>
      {!list ? <div className="skeleton h-64" /> : !shown.length ? <Empty>No services found.</Empty> : (
        <div className="divide-y divide-ink-700 rounded-xl border border-ink-700 bg-white">
          {shown.map((s) => (
            <div key={s._id} className="flex items-center gap-4 p-3">
              <img src={img(s)} onError={onImgError} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <b>{s.name}</b> {s.isActive === false && <Chip on={false}>Hidden</Chip>}
                <p className="truncate text-sm text-ivory-200">{s.category?.name || "No category"} · from {rupee(s.startingPrice)} · {s.durationMins} min</p>
              </div>
              <IconBtn icon="edit" label="Edit" onClick={() => openEdit(s)} /><IconBtn icon="trash" label="Delete" onClick={() => setDel(s)} />
            </div>
          ))}
        </div>
      )}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?._id ? "Edit service" : "Add service"} wide>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label-field">Name *</label><input required className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div><label className="label-field">Category *</label>
                <select required className="input-field" value={form.category} onChange={(e) => set("category", e.target.value)}><option value="">Select category</option>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div><label className="label-field">Starting price (₹) *</label><input required type="number" min="0" className="input-field" value={form.startingPrice} onChange={(e) => set("startingPrice", e.target.value)} /></div>
              <div><label className="label-field">Typical duration (min)</label><input type="number" min="15" className="input-field" value={form.durationMins} onChange={(e) => set("durationMins", e.target.value)} /></div>
            </div>
            <div><label className="label-field">Description *</label><textarea required rows={2} className="input-field" value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
            <div><label className="label-field">What's included <span className="font-normal text-ivory-200">(one per line)</span></label><textarea rows={3} className="input-field" value={form.inclusions} onChange={(e) => set("inclusions", e.target.value)} placeholder={"Visit & inspection\n30-day warranty"} /></div>
            <MultiImageUpload value={form.images} onChange={(v) => set("images", v)} folder="services" label="Service photos" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-black" checked={form.isActive !== false} onChange={(e) => set("isActive", e.target.checked)} /> Visible to customers</label>
            <FormMessage>{err}</FormMessage>
            <div className="flex gap-3"><button className="btn-primary flex-1" disabled={busy}>{busy ? "Saving…" : "Save service"}</button><button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete service?" message={`“${del?.name}” will be removed from the catalogue. This can't be undone.`} onClose={() => setDel(null)} onConfirm={remove} />
    </>
  );
}
