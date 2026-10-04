import { useEffect, useState } from "react";
import { PageHead, Empty, Chip, useFlash, fmtD } from "./shared";
import { partnerApplicationsApi, getErrorMessage } from "../../lib/api";

export default function Applications() {
  const [tab, setTab] = useState("pending");
  const [rows, setRows] = useState(null);
  const [toast, flash] = useFlash();
  useEffect(() => { setRows(null); partnerApplicationsApi.all(tab).then(({ data }) => setRows(data.data)); }, [tab]);

  async function decide(a, status) {
    try {
      await partnerApplicationsApi.update(a._id, { status });
      setRows((r) => r.filter((x) => x._id !== a._id));
      flash(status === "approved" ? `${a.name} approved and added as a partner` : "Application rejected");
    } catch (e) { flash(getErrorMessage(e)); }
  }
  return (
    <>
      {toast}
      <PageHead title="Partner applications" sub="Approving creates the partner and opens their PIN code for bookings." />
      <div className="mb-4 inline-flex rounded-xl bg-ink-700 p-1">
        {[["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === k ? "bg-white shadow" : "text-ivory-200"}`}>{l}</button>
        ))}
      </div>
      {!rows ? <div className="skeleton h-40" /> : !rows.length ? <Empty>No {tab} applications.</Empty> : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((a) => (
            <article key={a._id} className="rounded-xl border border-ink-700 bg-white p-5 text-sm">
              <div className="flex items-start justify-between gap-2"><div><b className="text-base">{a.name}</b><p className="text-ivory-200">{a.phone}{a.email ? ` · ${a.email}` : ""}</p></div><span className="text-xs text-ivory-200">{fmtD(a.createdAt)}</span></div>
              <div className="mt-3 flex flex-wrap gap-1.5"><Chip>{a.service?.name || "Service"}</Chip><Chip>{a.city} {a.pincode}</Chip><Chip>{a.experience}</Chip></div>
              {a.message && <p className="mt-3 text-ivory-200">“{a.message}”</p>}
              {tab !== "approved" && <div className="mt-4 flex gap-2">
                <button className="btn-primary !py-2" onClick={() => decide(a, "approved")}>Approve</button>
                {tab === "pending" && <button className="btn-ghost !py-2" onClick={() => decide(a, "rejected")}>Reject</button>}
              </div>}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
