import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { useAuth } from "../../context/AuthContext";
import { useLocationCtx } from "../../context/LocationContext";
import useScrollSpy from "../../lib/useScrollSpy";

export const SECTIONS = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "how-it-works", label: "How it works", path: "/how-it-works" },
  { id: "become-a-partner", label: "Become a Partner", path: "/become-a-partner" },
  { id: "about", label: "About", path: "/about" },
];
const ids = SECTIONS.map((s) => s.id);

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const loc = useLocationCtx();
  const [menu, setMenu] = useState(false);
  const [acct, setAcct] = useState(false);
  const refs = useRef({});
  const [bar, setBar] = useState({ x: 0, w: 0, show: false });
  const onHome = pathname === "/";
  const spy = useScrollSpy(ids, onHome);

  let active = null;
  if (onHome) active = spy || "home";
  else active = SECTIONS.find((s) => s.path !== "/" && pathname.startsWith(s.path))?.id || null;

  useLayoutEffect(() => {
    const place = () => {
      const el = refs.current[active];
      setBar(el ? { x: el.offsetLeft, w: el.offsetWidth, show: true } : (b) => ({ ...b, show: false }));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  useEffect(() => {
    const close = (e) => !e.target.closest?.("[data-acct]") && setAcct(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  useEffect(() => { setAcct(false); setMenu(false); }, [pathname]);

  function go(s) {
    setMenu(false);
    if (onHome) {
      s.id === "home" ? window.scrollTo({ top: 0, behavior: "smooth" }) : document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
    } else navigate(s.id === "home" ? "/" : `/#${s.id}`);
  }
  function out() {
    logout();
    navigate("/");
  }
  const initials = (user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-700 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="font-display flex justify-center items-center text-2xl font-extrabold leading-none text-ivory-50">
          <img src="/img/logo.png" alt="ServiceHome" className="h-10 w-10" />
        </Link>

        <nav className="relative ml-4 hidden h-full items-center gap-7 lg:flex" aria-label="Primary">
          {SECTIONS.map((s) => (
            <button key={s.id} ref={(el) => (refs.current[s.id] = el)} onClick={() => go(s)}
              className={`h-full text-sm font-medium transition-colors ${active === s.id ? "text-black" : "text-ivory-200 hover:text-black"}`}>
              {s.label}
            </button>
          ))}
          <span aria-hidden className="absolute bottom-0 left-0 h-[3px] rounded-full bg-black transition-all duration-500 ease-out"
            style={{ width: bar.w, transform: `translateX(${bar.x}px)`, opacity: bar.show ? 1 : 0 }} />
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button onClick={loc.openAsk} className="hidden items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs font-medium hover:border-black sm:flex" title="Change service area">
            <Icon name="pin" size={14} />{loc.pincode ? `${loc.city ? loc.city + " · " : ""}${loc.pincode}` : "Set PIN code"}
          </button>
          {isAuthenticated ? (
            <div className="relative" data-acct>
              <button onClick={() => setAcct((v) => !v)} aria-label="Account menu" aria-expanded={acct}
                className="grid h-10 w-10 place-items-center rounded-full bg-black text-sm font-semibold text-white">{initials}</button>
              {acct && (
                <div className="fade-up absolute right-0 top-12 w-64 rounded-xl border border-ink-600 bg-white p-2 shadow-xl">
                  <div className="border-b border-ink-700 px-3 pb-3 pt-2">
                    <b className="block truncate">{user?.name}</b>
                    <span className="block truncate text-xs text-ivory-200">{user?.email}</span>
                  </div>
                  {[["/bookings", "list", "My bookings"], ["/addresses", "home", "Saved addresses"]].map(([to, ic, l]) => (
                    <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-ink-700"><Icon name={ic} size={17} />{l}</Link>
                  ))}
                  <button onClick={loc.openAsk} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-ink-700"><Icon name="pin" size={17} />Change PIN code</button>
                  <button onClick={out} className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-ink-700 px-3 py-2.5 text-sm font-semibold hover:bg-ink-700"><Icon name="logout" size={17} />Log out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="px-3 py-2 text-sm font-medium hover:underline">Log in</Link>
              <Link to="/signup" className="btn-primary !px-5 !py-2.5">Sign up</Link>
            </div>
          )}
          <button className="grid h-10 w-10 place-items-center lg:hidden" onClick={() => setMenu((v) => !v)} aria-label="Menu"><Icon name={menu ? "x" : "list"} /></button>
        </div>
      </div>

      {menu && (
        <div className="fade-up border-t border-ink-700 bg-white px-5 pb-6 pt-3 lg:hidden">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => go(s)} className={`block w-full border-b border-ink-700 py-3.5 text-left text-base ${active === s.id ? "font-semibold" : "text-ivory-200"}`}>{s.label}</button>
          ))}
          {!isAuthenticated && (
            <div className="mt-4 flex gap-3">
              <Link to="/login" className="btn-ghost flex-1">Log in</Link>
              <Link to="/signup" className="btn-primary flex-1">Sign up</Link>
            </div>
          )}
        </div>
      )}

      <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-700 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        {[["/", "Home", "home"], ["/services", "Services", "search"], isAuthenticated ? ["/bookings", "Bookings", "list"] : ["/login", "Log in", "user"], ...(isAuthenticated ? [["/addresses", "Addresses", "pin"]] : [])].map(([to, l, ic]) => (
          <Link key={to} to={to} className={`flex-1 py-2 text-center text-[11px] ${pathname === to ? "font-semibold text-black" : "text-ivory-200"}`}>
            <Icon name={ic} className="mx-auto mb-0.5" size={21} />{l}
          </Link>
        ))}
      </nav>
    </header>
  );
}
