import { useEffect, useState } from "react";
import SplitHeading from "../components/motion/SplitHeading";
import Reveal from "../components/motion/Reveal";
import FormMessage from "../components/ui/FormMessage";
import Loader from "../components/ui/Loader";
import PincodeField from "../components/ui/PincodeField";
import { servicesApi, partnerApplicationsApi, getErrorMessage } from "../lib/api";

const perks = [
  { title: "Steady local work", copy: "Get matched with nearby customers — no lead-buying or bidding." },
  { title: "Fair, transparent pay", copy: "See starting prices upfront; no hidden platform cuts sprung on you later." },
  { title: "Flexible schedule", copy: "Accept jobs that fit your availability, on your own terms." },
  { title: "Verified badge", copy: "Approved partners are marked verified, building customer trust from day one." },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  pincode: "",
  service: "",
  experience: "0-1 years",
  message: "",
};

export default function BecomePartner() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    servicesApi
      .list()
      .then(({ data }) => setServices(data.data || []))
      .catch(() => setServices([]));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.city || !form.service || !/^[1-9][0-9]{5}$/.test(form.pincode)) {
      setError("Name, phone, city, a valid 6-digit PIN code and service are required.");
      return;
    }

    setSubmitting(true);
    try {
      await partnerApplicationsApi.submit(form);
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err, "Could not submit your application."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-28 pt-40">
      <section className="container-page grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr,1fr]">
        <div>
          <p className="eyebrow mb-4">For professionals</p>
          <SplitHeading
            as="h1"
            trigger="mount"
            text="Bring your skills. We'll bring the customers."
            className="font-display text-5xl leading-[1.02] text-ivory-50 md:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ivory-200/60">
              ServiceHome partners get a steady stream of verified local jobs — no cold calling, no
              race-to-the-bottom bidding. Just quality work, near you.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {perks.map((perk, i) => (
              <Reveal key={perk.title} delay={0.05 * i} className="border-t border-ivory-100/10 pt-5">
                <p className="font-display text-lg text-ivory-50">{perk.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ivory-200/55">{perk.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="card-surface p-8">
            {done ? (
              <div className="py-6 text-center">
                <p className="font-display text-2xl text-ivory-50">Application received</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory-200/60">
                  Thanks for applying, {form.name.split(" ")[0]}. Our team reviews every partner
                  application manually — we'll reach out on {form.phone} once yours is approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-2xl text-ivory-50">Apply to join</h2>

                <div>
                  <label className="label-field">Full name</label>
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Ramesh Kumar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Phone</label>
                    <input
                      className="input-field"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="98000 00000"
                    />
                  </div>
                  <div>
                    <label className="label-field">Email (optional)</label>
                    <input
                      className="input-field"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <PincodeField label="PIN code of your main work area" value={form.pincode} onChange={(v) => update("pincode", v)}
                  onVerified={(i) => i && update("city", i.city)} />

                <div>
                  <label className="label-field">City</label>
                  <input
                    className="input-field"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Pune"
                  />
                </div>

                <div>
                  <label className="label-field">Primary service</label>
                  <select
                    className="input-field"
                    value={form.service}
                    onChange={(e) => update("service", e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {services.length === 0 && (
                    <p className="mt-2 text-xs text-ivory-200/40">
                      No services found — ask the site admin to seed / add services first.
                    </p>
                  )}
                </div>

                <div>
                  <label className="label-field">Experience</label>
                  <select
                    className="input-field"
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                  >
                    <option>0-1 years</option>
                    <option>2-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>

                <div>
                  <label className="label-field">Anything else? (optional)</label>
                  <textarea
                    className="input-field min-h-[80px] resize-none"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tools you own, areas you cover, etc."
                  />
                </div>

                <FormMessage>{error}</FormMessage>

                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
