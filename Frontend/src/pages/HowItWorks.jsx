import { Link } from "react-router-dom";
import SplitHeading from "../components/motion/SplitHeading";
import Reveal from "../components/motion/Reveal";

const journey = [
  {
    n: "01",
    title: "Choose your service",
    copy:
      "Browse the catalog — plumbing, electrical, painting, cleaning and more — and pick what you need. Each listing shows a starting price so there are no surprises.",
  },
  {
    n: "02",
    title: "Add your address & details",
    copy:
      "Select a saved address or add a new one, then tell us anything the partner should know before they arrive.",
  },
  {
    n: "03",
    title: "We match a verified partner",
    copy:
      "Your request is reviewed and a background-checked local professional is assigned to your job.",
  },
  {
    n: "04",
    title: "Track it from your dashboard",
    copy:
      "Follow the status of every booking — pending, approved, or completed — from one place, anytime.",
  },
  {
    n: "05",
    title: "Job done, rate the experience",
    copy:
      "Once the work is finished, your booking is marked complete and ready for your next request.",
  },
];

const faqs = [
  {
    q: "How are partners verified?",
    a: "Every partner listed on SevaNear goes through an identity and background check, plus a skills review for their listed service category before they're allowed to accept jobs.",
  },
  {
    q: "What if I need to change my address after booking?",
    a: "Reach out through your dashboard before the partner is assigned, and our team will help update the request.",
  },
  {
    q: "Is there a cancellation fee?",
    a: "Cancelling before a partner is assigned is free. Once assigned, check the specific service's policy shown at booking.",
  },
  {
    q: "Do I need to create an account to browse services?",
    a: "No — browsing and prices are open to everyone. You'll only need an account to submit a booking.",
  },
];

export default function HowItWorks() {
  return (
    <div className="pb-28 pt-40">
      <section className="container-page">
        <p className="eyebrow mb-4">The process</p>
        <SplitHeading
          as="h1"
          trigger="mount"
          text="Simple by design, reliable by default."
          className="font-display max-w-3xl text-5xl text-ivory-50 md:text-6xl"
        />
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory-200/60">
            Five steps stand between "I need help" and "it's handled." Here's exactly what
            happens at each one.
          </p>
        </Reveal>
      </section>

      <section className="container-page mt-24">
        <div className="relative border-l border-ivory-100/10 pl-8 md:pl-14">
          {journey.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05} className="relative pb-16 last:pb-0">
              <span className="absolute -left-[42px] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-ivory-100/20 bg-ink-950 font-display text-xs text-clay-400 md:-left-[62px] md:h-10 md:w-10 md:text-sm">
                {step.n}
              </span>
              <h3 className="font-display text-2xl text-ivory-50 md:text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory-200/55 md:text-base">
                {step.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink-900/60 py-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-4">Good to know</p>
            <h2 className="font-display max-w-xl text-4xl text-ivory-50 md:text-5xl">
              Frequently asked questions
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.04} className="border-t border-ivory-100/10 pt-5">
                <p className="font-display text-lg text-ivory-50">{faq.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-ivory-200/55">{faq.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-28 text-center">
        <Reveal>
          <h2 className="font-display text-4xl text-ivory-50 md:text-5xl">Ready to get started?</h2>
          <Link to="/services" className="btn-primary mt-9 inline-flex">
            Book your first service
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
