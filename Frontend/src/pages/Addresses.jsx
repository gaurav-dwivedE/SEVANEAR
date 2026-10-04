import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import AddressForm from "../components/ui/AddressForm";
import Icon from "../components/ui/Icon";
import { addressesApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import useTitle from "../lib/useTitle";

export default function Addresses() {
  useTitle("Saved addresses — SevaNear");
  const { user } = useAuth();
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null); // null | {} (new) | address
  const [del, setDel] = useState(null);
  const load = () => addressesApi.list().then(({ data }) => setList(data.data || []));
  useEffect(() => { load(); }, []);

  return (
    <div className="container-page max-w-3xl py-10">
      <div className="flex items-end justify-between gap-3">
        <div><h1 className="text-4xl text-ivory-50">Saved addresses</h1><p className="mt-1 text-ivory-200">Used when you book a service. A mobile number is required for each.</p></div>
        <button className="btn-primary" onClick={() => setEdit({})}><Icon name="plus" size={16} /> Add new</button>
      </div>
      <div className="mt-6 grid gap-3">
        {list === null && <div className="skeleton h-28" />}
        {list?.length === 0 && <div className="rounded-xl border border-dashed border-ink-600 p-10 text-center text-ivory-200">No addresses yet. Add one to book faster.</div>}
        {list?.map((a) => (
          <article key={a._id} className="flex items-start justify-between gap-4 rounded-xl border border-ink-700 bg-white p-5">
            <div className="text-sm">
              <span className="rounded bg-black px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">{a.label}</span>
              <p className="mt-2 font-semibold">{a.contactName || user?.name} · {a.mobile}</p>
              <p className="text-ivory-200">{[a.houseNo, a.street, a.landmark].filter(Boolean).join(", ")}</p>
              <p className="text-ivory-200">{a.city}, {a.state} {a.zipCode}</p>
            </div>
            <div className="flex gap-1">
              <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink-700" onClick={() => setEdit(a)} aria-label="Edit address"><Icon name="edit" size={17} /></button>
              <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink-700" onClick={() => setDel(a)} aria-label="Delete address"><Icon name="trash" size={17} /></button>
            </div>
          </article>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?._id ? "Edit address" : "Add new address"} wide>
        {edit && <AddressForm initial={edit._id ? edit : null} defaultName={user?.name} defaultPin={user?.pincode} onCancel={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete address?" message="This address will be removed from your account. Existing bookings are not affected."
        onClose={() => setDel(null)} onConfirm={async () => { await addressesApi.remove(del._id); setDel(null); load(); }} />
    </div>
  );
}
