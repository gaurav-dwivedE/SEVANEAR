import { useEffect, useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import Loader from "../components/ui/Loader";
import StatusBadge from "../components/ui/StatusBadge";
import FormMessage from "../components/ui/FormMessage";
import Reveal from "../components/motion/Reveal";
import {
  applicationsApi,
  servicesApi,
  partnersApi,
  partnerApplicationsApi,
  authApi,
  getErrorMessage,
} from "../lib/api";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings" },
  { key: "services", label: "Services" },
  { key: "partners", label: "Partners" },
  { key: "partner-apps", label: "Partner applications" },
  { key: "users", label: "Users" },
];

export default function AdminDashboard() {
  const [data, setData] = useState({
    applications: [],
    services: [],
    partners: [],
    partnerApplications: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [apps, services, partners, partnerApps, users] = await Promise.allSettled([
      applicationsApi.all(),
      servicesApi.list(),
      partnersApi.list(),
      partnerApplicationsApi.all(),
      authApi.allUsers(),
    ]);
    setData({
      applications: apps.status === "fulfilled" ? apps.value.data.data || [] : [],
      services: services.status === "fulfilled" ? services.value.data.data || [] : [],
      partners: partners.status === "fulfilled" ? partners.value.data.data || [] : [],
      partnerApplications: partnerApps.status === "fulfilled" ? partnerApps.value.data.data || [] : [],
      users: users.status === "fulfilled" ? users.value.data.data || [] : [],
    });
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) return <Loader full label="Loading admin dashboard" />;

  const pendingBookings = data.applications.filter((a) => a.status === "pending").length;
  const pendingPartnerApps = data.partnerApplications.filter((a) => a.status === "pending").length;

  return (
    <DashboardShell eyebrow="Admin" title="Operations dashboard" tabs={tabs}>
      {(active) => {
        if (active === "overview") {
          return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Total bookings" value={data.applications.length} />
              <StatCard label="Pending bookings" value={pendingBookings} />
              <StatCard label="Services listed" value={data.services.length} />
              <StatCard label="Active partners" value={data.partners.length} />
              <StatCard label="Partner applications pending" value={pendingPartnerApps} />
              <StatCard label="Registered users" value={data.users.length} />
            </div>
          );
        }

        if (active === "bookings") {
          return (
            <BookingsPanel
              applications={data.applications}
              partners={data.partners}
              onChange={loadAll}
            />
          );
        }

        if (active === "services") {
          return <ServicesPanel services={data.services} onChange={loadAll} />;
        }

        if (active === "partners") {
          return <PartnersPanel partners={data.partners} services={data.services} onChange={loadAll} />;
        }

        if (active === "partner-apps") {
          return <PartnerApplicationsPanel applications={data.partnerApplications} onChange={loadAll} />;
        }

        if (active === "users") {
          return <UsersPanel users={data.users} />;
        }

        return null;
      }}
    </DashboardShell>
  );
}

function StatCard({ label, value }) {
  return (
    <Reveal className="card-surface p-6">
      <p className="font-display text-3xl text-ivory-50">{value}</p>
      <p className="mt-1 text-sm text-ivory-200/50">{label}</p>
    </Reveal>
  );
}

function EmptyState({ children }) {
  return <p className="text-sm text-ivory-200/50">{children}</p>;
}

// ---------- Bookings ----------
function BookingsPanel({ applications, partners, onChange }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function updateStatus(app, status) {
    setBusyId(app._id);
    setError("");
    try {
      await applicationsApi.update(app._id, { status });
      onChange();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update that booking."));
    } finally {
      setBusyId(null);
    }
  }

  async function assignPartner(app, partnerId) {
    if (!partnerId) return;
    setBusyId(app._id);
    setError("");
    try {
      await applicationsApi.update(app._id, { partner: partnerId });
      onChange();
    } catch (err) {
      setError(getErrorMessage(err, "Could not assign that partner."));
    } finally {
      setBusyId(null);
    }
  }

  if (applications.length === 0) return <EmptyState>No bookings yet.</EmptyState>;

  return (
    <div className="space-y-4">
      <FormMessage>{error}</FormMessage>
      {applications.map((app) => {
        const eligiblePartners = partners.filter((p) =>
          (p.service || []).some((s) => s._id === app.service?._id)
        );
        return (
          <div key={app._id} className="card-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-ivory-50">
                  {app.service?.name || "Service"}
                </p>
                <p className="text-xs text-ivory-200/45">
                  {app.user?.name} · {app.user?.email}
                </p>
                {app.selectedAddress && (
                  <p className="mt-1 text-xs text-ivory-200/45">
                    📍 {app.selectedAddress.city}, {app.selectedAddress.state}
                  </p>
                )}
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select
                className="input-field !w-auto !py-2 text-xs"
                value={app.status}
                disabled={busyId === app._id}
                onChange={(e) => updateStatus(app, e.target.value)}
              >
                <option value="pending">Requested</option>
                <option value="approved">Confirmed</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Declined</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                className="input-field !w-auto !py-2 text-xs"
                value={app.partner?._id || ""}
                disabled={busyId === app._id}
                onChange={(e) => assignPartner(app, e.target.value)}
              >
                <option value="">
                  {app.partner ? `Assigned: ${app.partner.name}` : "Assign partner…"}
                </option>
                {eligiblePartners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} · {p.phone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Services ----------
function ServicesPanel({ services, onChange }) {
  const [form, setForm] = useState({ name: "", description: "", startingPrice: "" });
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await servicesApi.create({
        ...form,
        startingPrice: Number(form.startingPrice) || 0,
      });
      setForm({ name: "", description: "", startingPrice: "" });
      onChange();
    } catch (err) {
      setError(getErrorMessage(err, "Could not create that service."));
    }
  }

  async function handleDelete(id) {
    setBusyId(id);
    try {
      await servicesApi.remove(id);
      onChange();
    } catch (err) {
      setError(getErrorMessage(err, "Could not remove that service."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,320px]">
      <div className="space-y-3">
        {services.length === 0 && <EmptyState>No services yet — add the first one.</EmptyState>}
        {services.map((s) => (
          <div key={s._id} className="card-surface flex items-center justify-between p-5">
            <div>
              <p className="font-display text-lg text-ivory-50">{s.name}</p>
              <p className="text-sm text-ivory-200/50">{s.description}</p>
              <p className="mt-1 text-xs text-ivory-200/40">From ₹{s.startingPrice ?? 0}</p>
            </div>
            <button
              onClick={() => handleDelete(s._id)}
              disabled={busyId === s._id}
              className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              {busyId === s._id ? "Removing…" : "Remove"}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="card-surface h-fit space-y-3 p-5">
        <p className="font-display text-lg text-ivory-50">Add a service</p>
        <input
          className="input-field"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="input-field min-h-[70px] resize-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="input-field"
          type="number"
          min="0"
          placeholder="Starting price (₹)"
          value={form.startingPrice}
          onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
        />
        <FormMessage>{error}</FormMessage>
        <button type="submit" className="btn-primary w-full !py-2 text-xs">
          Add service
        </button>
      </form>
    </div>
  );
}

// ---------- Partners ----------
function PartnersPanel({ partners, services, onChange }) {
  const [form, setForm] = useState({ name: "", phone: "", service: "" });
  const [error, setError] = useState("");

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.service) {
      setError("Name, phone and service are required.");
      return;
    }
    try {
      await partnersApi.create({ ...form, service: [form.service] });
      setForm({ name: "", phone: "", service: "" });
      onChange();
    } catch (err) {
      setError(getErrorMessage(err, "Could not create that partner."));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,320px]">
      <div className="space-y-3">
        {partners.length === 0 && <EmptyState>No partners yet.</EmptyState>}
        {partners.map((p) => (
          <div key={p._id} className="card-surface p-5">
            <p className="font-display text-lg text-ivory-50">{p.name}</p>
            <p className="text-sm text-ivory-200/50">{p.phone}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(p.service || []).map((s) => (
                <span key={s._id} className="rounded-full border border-ivory-100/15 px-3 py-1 text-xs text-ivory-200/60">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="card-surface h-fit space-y-3 p-5">
        <p className="font-display text-lg text-ivory-50">Add a partner</p>
        <input
          className="input-field"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <select
          className="input-field"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          <option value="">Select service</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <FormMessage>{error}</FormMessage>
        <button type="submit" className="btn-primary w-full !py-2 text-xs">
          Add partner
        </button>
      </form>
    </div>
  );
}

// ---------- Partner applications ----------
function PartnerApplicationsPanel({ applications, onChange }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function setStatus(app, status) {
    setBusyId(app._id);
    setError("");
    try {
      await partnerApplicationsApi.update(app._id, { status });
      onChange();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update that application."));
    } finally {
      setBusyId(null);
    }
  }

  if (applications.length === 0) return <EmptyState>No partner applications yet.</EmptyState>;

  return (
    <div className="space-y-4">
      <FormMessage>{error}</FormMessage>
      {applications.map((app) => (
        <div key={app._id} className="card-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg text-ivory-50">{app.name}</p>
              <p className="text-xs text-ivory-200/45">
                {app.phone} {app.email && `· ${app.email}`} · {app.city}
              </p>
              <p className="mt-1 text-xs text-ivory-200/45">
                Service: {app.service?.name} · Experience: {app.experience}
              </p>
              {app.message && <p className="mt-2 text-sm text-ivory-200/55">{app.message}</p>}
            </div>
            <StatusBadge status={app.status} />
          </div>

          {app.status === "pending" && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setStatus(app, "approved")}
                disabled={busyId === app._id}
                className="btn-ghost !py-2 text-xs disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => setStatus(app, "rejected")}
                disabled={busyId === app._id}
                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- Users ----------
function UsersPanel({ users }) {
  if (users.length === 0) return <EmptyState>No users found.</EmptyState>;

  return (
    <div className="card-surface overflow-x-auto p-2">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-ivory-200/40">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-ivory-100/10">
              <td className="p-4 text-ivory-100">{u.name}</td>
              <td className="p-4 text-ivory-200/60">{u.email}</td>
              <td className="p-4 capitalize text-ivory-200/60">{u.role}</td>
              <td className="p-4 text-ivory-200/40">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
