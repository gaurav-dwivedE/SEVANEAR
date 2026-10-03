import SplitHeading from "../components/motion/SplitHeading";
import Reveal from "../components/motion/Reveal";

const values = [
  { title: "Trust, verified", copy: "Every partner is background-checked before they ever see a job." },
  { title: "Local, always", copy: "We match you with professionals who actually know your neighborhood." },
  { title: "Fair to everyone", copy: "Transparent pricing for customers, steady work for partners." },
];

const timeline = [
  { year: "2023", copy: "SevaNear starts as a small directory of trusted local plumbers and electricians." },
  { year: "2024", copy: "Expanded into cleaning, painting, appliance repair and vehicle services." },
  { year: "2025", copy: "Crossed 500 verified partners across a dozen cities." },
  { year: "2026", copy: "Rebuilt the platform around a real-time booking and partner-matching engine." },
];

export default function About() {
  return (
    <div className="pb-28 pt-40">
      <section className="container-page">
        <p className="eyebrow mb-4">About SevaNear</p>
        <SplitHeading
          as="h1"
          trigger="mount"
          text="Home services, done properly."
          className="font-display max-w-3xl text-5xl text-ivory-50 md:text-6xl"
        />
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory-200/60">
            We started SevaNear because finding a plumber you actually trust shouldn't take five
            phone calls and a leap of faith. Today we connect thousands of households with
            verified local professionals across every service a home might need.
          </p>
        </Reveal>
      </section>

      <section className="container-page mt-24 grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.06} className="card-surface p-7">
            <p className="font-display text-2xl text-ivory-50">{v.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory-200/55">{v.copy}</p>
          </Reveal>
        ))}
      </section>

      <section className="bg-ink-900/60 py-28 mt-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-4">Our journey</p>
            <h2 className="font-display max-w-xl text-4xl text-ivory-50 md:text-5xl">
              A short history
            </h2>
          </Reveal>

          <div className="mt-14 space-y-10">
            {timeline.map((t, i) => (
              <Reveal
                key={t.year}
                delay={i * 0.05}
                className="flex flex-col gap-2 border-t border-ivory-100/10 pt-6 md:flex-row md:gap-10"
              >
                <span className="font-display w-24 shrink-0 text-2xl text-clay-500">{t.year}</span>
                <p className="max-w-xl text-sm leading-relaxed text-ivory-200/60 md:text-base">
                  {t.copy}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-28 text-center">
        <Reveal>
          <h2 className="font-display text-4xl text-ivory-50 md:text-5xl">
            Want to be part of the story?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ivory-200/55">
            Whether you need help at home or want to offer your skills — there's a place for you
            here.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
