import { useState } from "react";
import {
  MapPin,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navItems = [
  "Home",
  "Services",
  "How it works",
  "Become a partner",
  "About Us",
];

export default function Navbar() {
  const [activeNav, setActiveNav] = useState("Home");
  const [location, setLocation] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <span className="text-xl font-extrabold">L</span>
            </div>

            {/* Logo Text */}
            <div className="leading-none">
              <div className="text-xl font-extrabold tracking-tight text-blue-500">
                SEVANEAR
              </div>

              <div className="mt-1 text-[9px] font-semibold tracking-[0.16em] text-gray-500">
                Local Services, Trusted People.
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = activeNav === item;

            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`relative whitespace-nowrap py-7 text-sm  transition-colors font-semibold ${
                  active
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {item}

                {active && (
                  <span className="absolute bottom-5 left-0 h-[2px] w-full rounded-full bg-orange-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* Location */}
          <button
            className="group flex min-w-[150px] items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-gray-50"
            onClick={() => {
              // Open Google Maps / location picker here
              window.open(
                "https://www.google.com/maps",
                "_blank"
              );
            }}
          >
            <MapPin
              size={21}
              strokeWidth={2.3}
              className="shrink-0 text-blue-500"
            />

            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Location
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`max-w-[110px] truncate text-sm font-semibold ${
                    location ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {location || "Select location"}
                </span>

                <ChevronDown
                  size={14}
                  className="text-gray-400"
                />
              </div>
            </div>
          </button>

          {/* Login */}
          <button
            className="rounded-lg border border-blue-500 bg-white px-5 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
          >
            Login
          </button>

          {/* Signup */}
          <button
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-5 pb-5 lg:hidden">

          <div className="flex flex-col">
            {navItems.map((item) => {
              const active = activeNav === item;

              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    setMobileOpen(false);
                  }}
                  className={`border-b border-gray-100 py-4 text-left text-sm font-semibold ${
                    active
                      ? "text-orange-500"
                      : "text-gray-700"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Mobile Location */}
          <button
            onClick={() =>
              window.open(
                "https://www.google.com/maps",
                "_blank"
              )
            }
            className="mt-4 flex w-full items-center gap-3 rounded-lg bg-gray-50 p-3"
          >
            <MapPin
              size={21}
              className="text-blue-500"
            />

            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                Location
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {location || "Select location"}
              </div>
            </div>

            <ChevronDown
              size={16}
              className="ml-auto text-gray-400"
            />
          </button>

          {/* Mobile Auth */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="rounded-lg border border-blue-500 bg-white py-2.5 text-sm font-semibold text-blue-500">
              Login
            </button>

            <button className="rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white">
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}