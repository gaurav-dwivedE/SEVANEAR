import { useEffect, useState } from "react";
import { PageHead, Empty, Chip, useFlash, fmtD } from "./shared";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { authApi, getErrorMessage } from "../../lib/api";

export default function Users() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [del, setDel] = useState(null);
  const [toast, flash] = useFlash();
  useEffect(() => { authApi.allUsers().then(({ data }) => setRows(data.data)); }, []);

  async function block(u) {
    try {
      await authApi.block(u._id, !u.isBlocked);
      setRows((r) => r.map((x) => (x._id === u._id ? { ...x, isBlocked: !u.isBlocked } : x)));
      flash(u.isBlocked ? "User unblocked" : "User blocked");
    } catch (e) { flash(getErrorMessage(e)); }
  }
  const shown = (rows || []).filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      {toast}
      <PageHead title="Users" sub="Blocked users can't log in or book. Deleting removes their addresses and bookings." />
      <input className="input-field mb-4 max-w-xs" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
      {!rows ? <div className="skeleton h-48" /> : !shown.length ? <Empty>No users found.</Empty> : (
        <div className="overflow-x-auto rounded-xl border border-ink-700 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-ink-700 bg-ink-900 text-xs uppercase tracking-wide text-ivory-200"><tr>{["Name", "Email", "PIN", "Joined", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-ink-700">
              {shown.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 font-semibold">{u.name} {u.role === "admin" && <Chip>Admin</Chip>}</td>
                  <td className="px-4 py-3 text-ivory-200">{u.email}</td><td className="px-4 py-3">{u.pincode || "—"}</td><td className="px-4 py-3">{fmtD(u.createdAt)}</td>
                  <td className="px-4 py-3">{u.isBlocked ? <Chip on={false}>Blocked</Chip> : <Chip>Active</Chip>}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">{u.role !== "admin" && (<>
                    <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => block(u)}>{u.isBlocked ? "Unblock" : "Block"}</button>{" "}
                    <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setDel(u)}>Delete</button></>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={!!del} title="Delete user?" message={`${del?.name} and all of their addresses and bookings will be permanently deleted.`} onClose={() => setDel(null)}
        onConfirm={async () => { await authApi.removeUser(del._id); setRows((r) => r.filter((x) => x._id !== del._id)); setDel(null); flash("User deleted"); }} />
    </>
  );
}
