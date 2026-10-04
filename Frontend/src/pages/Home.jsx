import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ServiceBrowser from "../components/ServiceBrowser";
import AvailabilityChecker from "../components/AvailabilityChecker";
import { useCategories } from "../lib/useCatalog";
import useTitle from "../lib/useTitle";

const steps = [
  ["Enter your PIN code", "We only show services that have a verified partner in your area."],
  ["Choose a service and a time", "Pick a date on the calendar and a three-hour slot."],
  ["A partner is assigned", "You'll see their name and phone number in your bookings."],
  ["Pay after the work", "Review the job, pay the partner, and leave a review."],
];
const faqs = [
  ["When do I pay?", "After the job is done. Any parts or extra work are agreed with you before they're added to the bill."],
  ["Can I cancel?", "Yes. Open My bookings and cancel any time before the partner starts. To change the time, cancel and book a new slot."],
  ["Is there a warranty?", "Repairs carry a 30-day service warranty. If the same problem comes back, we send someone again."],
  ["A service I want isn't listed for my PIN code.", "Services show up only where we have an active partner. Try again later, or ask a professional you know there to apply."],
];

export default function Home() {
  useTitle("SevaNear — Trusted home services near you");
  const [tab, setTab] = useState("service");
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const categories = useCategories();

  return (
    <>
      <section id="home" className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.1] md:text-[3.2rem]">Trusted help for your home, right at your door.</h1>
          <p className="mt-4 max-w-md text-lg text-ivory-200">Plumbers, electricians, AC technicians and cleaners from your neighbourhood. Choose a time, see the price upfront, and pay after the job.</p>

          <div className="mt-7 max-w-xl">
            <div className="mb-3 flex gap-5 border-b border-ink-700 text-sm font-medium" role="tablist">
              {[["service", "Find a service"], ["pin", "Check my area"]].map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-2 ${tab === k ? "border-black text-black" : "border-transparent text-ivory-200 hover:text-black"}`}>{l}</button>
              ))}
            </div>
            {tab === "service" ? (
              <form onSubmit={(e) => { e.preventDefault(); navigate(q.trim() ? `/services?q=${encodeURIComponent(q.trim())}` : "/services"); }} role="search" className="flex gap-2">
                <div className="relative flex-1">
                  <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-200" />
                  <input className="input-field !pl-10" placeholder="AC service, plumber, cleaning…" aria-label="Search services" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <button className="btn-primary">Search</button>
              </form>
            ) : <AvailabilityChecker />}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory-200">
            {["ID-verified partners", "Upfront pricing", "Pay after the job"].map((t) => <li key={t} className="flex items-center gap-1.5"><Icon name="check" size={15} className="text-black" />{t}</li>)}
          </ul>
        </div>
        <div className="grid grid-cols-5 grid-rows-2 gap-3">
          {[["/img/ac.jpg", "AC repair & service", "col-span-3 row-span-2 min-h-[20rem]", "A technician servicing an air conditioner", true], ["/img/plumber.jpg", "Plumbing", "col-span-2", "A plumber repairing a pipe under a sink"], ["/img/kitchen.jpg", "Home & kitchen cleaning", "col-span-2", "A clean modern kitchen"]].map(([src, label, cls, alt, first]) => (
            <figure key={label} className={`relative overflow-hidden rounded-xl bg-ink-700 ${cls}`}>
              <img src={src} alt={alt} fetchpriority={first ? "high" : undefined} className="h-full w-full object-cover" />
            </figure>
          ))}
        </div>
      </section>

      <section id="services" className="border-t border-ink-700 py-14">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><h2 className="text-3xl">Services</h2><p className="mt-1 text-ivory-200">Pick a category, or set your PIN code to see what's available near you.</p></div>
            <Link to="/services" className="hidden text-sm font-semibold underline underline-offset-4 sm:block">See all</Link>
          </div>
          <ServiceBrowser limit={8} />
        </div>
      </section>

      <section id="how-it-works" className="border-t border-ink-700 bg-ink-900 py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <img src="/img/living.jpg" alt="A freshly cleaned living room" loading="lazy" className="h-72 w-full rounded-xl object-cover lg:h-full" />
          <div>
            <h2 className="text-3xl">How it works</h2>
            <ol className="mt-6 space-y-5">
              {steps.map(([t, d], i) => (
                <li key={t} className="flex gap-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black text-sm font-semibold">{i + 1}</span><div><p className="font-semibold">{t}</p><p className="text-ivory-200">{d}</p></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="become-a-partner" className="border-t border-ink-700 py-14">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl">Are you a skilled professional?</h2>
            <p className="mt-3 max-w-lg text-ivory-200">If you work as a plumber, electrician, AC technician, cleaner or carpenter, join SevaNear as a service partner. Choose the PIN codes you want to work in, get booked by customers nearby, and there's no joining fee.</p>
            <Link to="/become-a-partner" className="btn-primary mt-6">Apply as a partner</Link>
          </div>
          <img src="/img/partner.jpg" alt="A SevaNear service partner" loading="lazy" className="h-64 w-full rounded-xl object-cover" />
        </div>
      </section>

      <section id="about" className="border-t border-ink-700 bg-ink-900 py-14">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">About SevaNear</h2>
            <p className="mt-4 text-ivory-200">SevaNear connects households with trusted local professionals. We verify every partner, show prices before you book, and keep you updated from the request to the finished job.</p>
            <p className="mt-3 text-ivory-200">We grow area by area. A service is offered only in PIN codes where a verified partner is ready, so a confirmed booking means someone can really come.</p>
            <p className="mt-6 text-sm"><b>Need help?</b> <span className="text-ivory-200">Write to support@sevanear.in, every day 8 AM to 9 PM.</span></p>
          </div>
          <div>
            <h3 className="text-xl">Questions people ask</h3>
            <div className="mt-3 divide-y divide-ink-600 border-y border-ink-600">
              {faqs.map(([a, b]) => (
                <details key={a} className="group py-3.5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">{a}<Icon name="plus" size={18} className="shrink-0 transition group-open:rotate-45" /></summary>
                  <p className="mt-2 text-sm text-ivory-200">{b}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
