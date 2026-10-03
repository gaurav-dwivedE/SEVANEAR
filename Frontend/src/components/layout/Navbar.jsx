import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/become-a-partner", label: "Become a Partner" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        "bg-ink-950 border-b border-ink-700"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight text-ivory-50">
          Seva<span className="underline decoration-2 underline-offset-4">Near</span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? "text-ivory-50" : "text-ivory-200/60 hover:text-ivory-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="text-sm text-ivory-200/70 hover:text-ivory-50"
              >
                {user?.name?.split(" ")[0]}'s {isAdmin ? "Admin" : "Dashboard"}
              </Link>
              <button onClick={handleLogout} className="btn-ghost !py-2.5">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ivory-200/70 hover:text-ivory-50">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary !py-2.5">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`h-px w-6 bg-ivory-100 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ivory-100 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ivory-100 transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-700 bg-ink-800 pb-[env(safe-area-inset-bottom)] lg:hidden">
        {[["/", "Home", "home"], ["/services", "Services", "search"], [isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/login", isAuthenticated ? "Bookings" : "Log in", isAuthenticated ? "list" : "user"]].map(([to, l, ic]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex-1 py-2 text-center text-xs ${isActive ? "font-semibold text-black" : "text-ivory-200"}`}>
            <Icon name={ic} className="mx-auto mb-0.5" size={21} />{l}
          </NavLink>
        ))}
      </nav>

      {open && (
        <div className="border-t border-ivory-100/10 bg-ink-950 px-6 pb-8 pt-4 lg:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-lg text-ivory-200/80"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="hairline my-2" />
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="text-lg">
                  {isAdmin ? "Admin dashboard" : "My dashboard"}
                </Link>
                <button onClick={handleLogout} className="btn-ghost w-full">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-lg">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
