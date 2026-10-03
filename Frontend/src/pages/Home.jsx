import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ServiceCard from "../components/ui/ServiceCard";
import { useServices } from "../lib/useServices";
import useTitle from "../lib/useTitle";

const quick = ["AC Repair", "Plumber", "Home Cleaning", "Electrician"];
const trust = [
  ["shield", "Background-verified", "Every partner is ID and police-verified before their first job."],
  ["tag", "Upfront pricing", "See the visit fee and fees before you book. Parts are quoted first."],
  ["clock", "Pick your slot", "Choose a date and a 3-hour window that fits your day."],
];
const tiles = [
  ["Cleaning", "/img/living.jpg"],
  ["Appliances", "/img/ac.jpg"],
  ["Repairs", "/img/plumber.jpg"],
  ["Renovation", "/img/kitchen.jpg"],
];
const steps = [
  ["Choose a service", "Compare what's included and the starting price."],
  ["Pick date and slot", "Same-day and next-day windows."],
  ["We assign a partner", "You see their name and number in your dashboard."],
  ["Pay after the job", "Review the work, then pay. Rate it when done."],
];
const faqs = [
  ["When do I pay?", "After the job is done. The final price, including any parts, is confirmed with you before work begins."],
  ["Can I cancel or reschedule?", "You can cancel from your dashboard any time before the partner starts the job. To reschedule, cancel and book a new slot."],
  ["Is there a warranty?", "Repairs carry a 30-day service warranty. If the same issue returns, we send someone back."],
  ["How are partners verified?", "ID and address checks, a skills review, and a trial job before they join the platform."],
];

export default function Home() {
  useTitle("SevaNear — Verified home services");
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { services, loading } = useServices();
  const go = (term) => navigate(term ? `/services?q=${encodeURIComponent(term)}` : "/services");
  const counts = useMemo(() => {
    const m = {};
    services.forEach((s) => (m[s.category] = (m[s.category] || 0) + 1));
    return m;
  }, [services]);

  return (
    <>
      <section className="container-page grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-16">
        <div>
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] text-ivory-50 md:text-[4rem]">
            Home services, done properly.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ivory-200">
            Book a verified plumber, electrician, cleaner or AC technician. Choose a time, see the price, pay when it's done.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); go(q.trim()); }}
            role="search"
            className="mt-7 flex max-w-xl items-center gap-2 rounded-2xl border border-ink-600 bg-white p-2 pl-4 focus-within:border-black"
          >
            <Icon name="search" className="shrink-0 text-ivory-200" />
            <input
              className="min-w-0 flex-1 bg-transparent py-2 text-ivory-100 outline-none placeholder:text-ivory-200/70"
              placeholder="Try “AC service” or “plumber”"
              aria-label="Search services"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn-primary">Search</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {quick.map((c) => (
              <button key={c} onClick={() => go(c)} className="rounded-full border border-ink-600 px-4 py-1.5 text-sm hover:border-black">
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 grid-rows-2 gap-3">
          <img src="/img/ac.jpg" alt="Technician cleaning an air conditioner" fetchpriority="high"
            className="col-span-3 row-span-2 h-full min-h-[22rem] w-full rounded-2xl object-cover" />
          <img src="/img/plumber.jpg" alt="Plumber repairing under a sink" className="col-span-2 h-full w-full rounded-2xl object-cover" />
          <img src="/img/kitchen.jpg" alt="Clean modern kitchen" className="col-span-2 h-full w-full rounded-2xl object-cover" />
        </div>
      </section>

      <section className="border-y border-ink-700 bg-ink-900">
        <div className="container-page grid gap-6 py-8 md:grid-cols-3">
          {trust.map(([ic, t, d]) => (
            <div key={t} className="flex gap-4">
              <Icon name={ic} size={26} className="mt-0.5 shrink-0" />
              <div>
                <b className="text-ivory-50">{t}</b>
                <p className="text-sm text-ivory-200">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-3xl font-semibold text-ivory-50">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {tiles.map(([name, src]) => (
            <Link key={name} to={`/services?cat=${name}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink-700">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <b className="font-display text-xl">{name}</b>
                {counts[name] ? <p className="text-xs text-white/70">{counts[name]} services</p> : null}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold text-ivory-50">Popular services</h2>
          <Link to="/services" className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
            View all <Icon name="right" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-64" />)
            : services.slice(0, 4).map((s) => <ServiceCard key={s._id} service={s} />)}
        </div>
      </section>

      <section className="bg-ink-900 py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <img src="/img/living.jpg" alt="Freshly cleaned living room" loading="lazy" className="h-full max-h-[28rem] w-full rounded-2xl object-cover" />
          <div className="self-center">
            <h2 className="font-display text-3xl font-semibold text-ivory-50">How booking works</h2>
            <ol className="mt-6 divide-y divide-ink-600 border-y border-ink-600">
              {steps.map(([t, d], i) => (
                <li key={t} className="flex gap-4 py-4">
                  <span className="font-display text-2xl font-semibold text-ivory-200">0{i + 1}</span>
                  <div><b className="text-ivory-50">{t}</b><p className="text-sm text-ivory-200">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ivory-50">Common questions</h2>
          <p className="mt-2 text-ivory-200">Still unsure? Write to support@sevanear.in.</p>
        </div>
        <div className="divide-y divide-ink-600 border-y border-ink-600">
          {faqs.map(([q2, a]) => (
            <details key={q2} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ivory-50">
                {q2}<Icon name="plus" size={18} className="transition group-open:rotate-45" />
              </summary>
              <p className="mt-2 max-w-xl text-sm text-ivory-200">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid overflow-hidden rounded-3xl bg-black text-white md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h2 className="font-display text-3xl font-semibold">Work with SevaNear</h2>
            <p className="mt-3 max-w-sm text-white/70">Skilled in plumbing, electrical, AC, cleaning or carpentry? Get steady jobs near you with no joining fee.</p>
            <Link to="/become-a-partner" className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-neutral-200">Apply as a partner</Link>
          </div>
          <img src="/img/partner.jpg" alt="SevaNear partner" loading="lazy" className="h-64 w-full object-cover grayscale md:h-full" />
        </div>
      </section>
    </>
  );
}
