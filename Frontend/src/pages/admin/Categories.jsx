import { useEffect, useState } from "react";
import { PageHead, Empty, IconBtn, Chip, useFlash } from "./shared";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import FormMessage from "../../components/ui/FormMessage";
import Icon from "../../components/ui/Icon";
import { categoriesApi, servicesApi, getErrorMessage } from "../../lib/api";

export default function Categories() {
  const [list, setList] = useState(null);
  const [counts, setCounts] = useState({});
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [err, setErr] = useState("");
  const [toast, flash] = useFlash();
  const load = async () => {
    const [c, s] = await Promise.all([categoriesApi.list(true), servicesApi.list({ all: 1 })]);
    setList(c.data.data);
    const m = {}; s.data.data.forEach((x) => x.category && (m[x.category._id] = (m[x.category._id] || 0) + 1)); setCounts(m);
  };
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault(); setErr("");
    try {
      form._id ? await categoriesApi.update(form._id, form) : await categoriesApi.create(form);
      setForm(null); flash("Category saved"); load();
    } catch (x) { setErr(getErrorMessage(x)); }
  }
  async function remove() {
    try { await categoriesApi.remove(del._id); flash("Category deleted"); load(); } catch (x) { flash(getErrorMessage(x)); }
    setDel(null);
  }
  return (
    <>
      {toast}
      <PageHead title="Categories" sub="Groups shown as filters on the customer site." action={<button className="btn-primary" onClick={() => { setErr(""); setForm({ name: "", description: "", isActive: true }); }}><Icon name="plus" size={16} /> New category</button>} />
      {!list ? <div className="skeleton h-40" /> : !list.length ? <Empty>No categories yet. Create one, then add services to it.</Empty> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <div key={c._id} className="flex items-center gap-3 rounded-xl border border-ink-700 bg-white p-4">
              <div className="min-w-0 flex-1"><b>{c.name}</b> {c.isActive === false && <Chip on={false}>Hidden</Chip>}<p className="truncate text-sm text-ivory-200">{counts[c._id] || 0} service{counts[c._id] === 1 ? "" : "s"}{c.description ? ` · ${c.description}` : ""}</p></div>
              <IconBtn icon="edit" label="Edit" onClick={() => { setErr(""); setForm(c); }} /><IconBtn icon="trash" label="Delete" onClick={() => setDel(c)} />
            </div>
          ))}
        </div>
      )}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?._id ? "Edit category" : "New category"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div><label className="label-field">Name *</label><input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Appliances" /></div>
            <div><label className="label-field">Short description</label><input className="input-field" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-black" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Visible to customers</label>
            <FormMessage>{err}</FormMessage>
            <button className="btn-primary w-full">Save category</button>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete category?" message={counts[del?._id] ? `${counts[del._id]} service(s) use this category, so it can't be deleted until they're moved.` : `“${del?.name}” will be deleted.`} onClose={() => setDel(null)} onConfirm={remove} />
    </>
  );
}
