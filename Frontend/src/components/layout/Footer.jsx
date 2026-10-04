import { Link } from "react-router-dom";

const cols = [
  ["Company", [["/about", "About"], ["/how-it-works", "How it works"], ["/become-a-partner", "Become a partner"]]],
  ["Customers", [["/services", "All services"], ["/signup", "Create account"], ["/login", "Log in"]]],
];

export default function Footer() {
  return (
    <footer className="bg-black pb-24 pt-14 text-white lg:pb-10">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Link to="/" className="font-display text-2xl font-semibold">SevaNear</Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Background-verified local professionals for repairs, cleaning and appliance care. Upfront pricing, no surprises.
            </p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <p className="mb-4 text-xs font-semibold text-white/50">{h}</p>
              <ul className="space-y-2.5 text-sm text-white/80">
                {links.map(([to, l]) => (
                  <li key={to}><Link to={to} className="hover:text-white hover:underline">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-4 text-xs font-semibold text-white/50">Support</p>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>support@xxxxxxxx</li>
              <li>+91 xxxxxxxxxx </li>
              <li>Mon–Sun, 8 AM – 9 PM</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/15 pt-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} SevaNear</p>
          <p>Rewa, Madhya Pradesh, India</p>
        </div>
      </div>
    </footer>
  );
}
