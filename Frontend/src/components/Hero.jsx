import React from "react";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const Hero = () => {
  const popularSearches = [
    "Plumber",
    "Electrician",
    "Painter",
    "AC Repair",
    "Home Cleaning",
  ];

  return (

    
    <section className="relative overflow-hidden bg-white">
  <div className="relative min-h-[500px] w-full px-6 sm:px-12 lg:px-16">

        <div className="absolute inset-0 z-0">

          {/* Hero Image */}
          <img
            src="/images/hero-service.png"
            alt="SevaNear local service professional"
            className="absolute right-0 top-0 h-full w-full object-cover sm:w-[65%]"
          />

          {/* Left White Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/10" />

          {/* Bottom Soft Fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 flex min-h-[520px] items-center">

          <div className="w-full max-w-[650px] pt-10 lg:pt-0">

            {/* Heading */}
            <h1 className="max-w-[650px] text-4xl font-bold leading-[1.08] tracking-tight text-blue-500 sm:text-5xl lg:text-[58px]">
              Trusted Local Services

              <span className="block text-orange-500">
                Just a Click Away
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[590px] text-base leading-7 text-slate-600 sm:text-lg">
              Book verified professionals for all your home & service needs —
              Plumbers, Electricians, Painters, AC Repair, Cleaners and more.
            </p>

            {/* ================= SEARCH BOX ================= */}
            <div className="relative z-20 mt-8 flex w-full max-w-[760px] flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:flex-row">

              {/* Location */}
              <button className="flex h-14 flex-1 items-center gap-3 rounded-xl px-4 text-left transition hover:bg-gray-50">

                <MapPin
                  size={21}
                  strokeWidth={2.5}
                  className="shrink-0 text-blue-600"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-gray-400">
                    Location
                  </p>

                  <p className="truncate text-sm font-semibold text-slate-800">
                    Pune
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className="text-gray-400"
                />
              </button>

              {/* Divider */}
              <div className="hidden h-10 self-center border-l border-gray-200 sm:block" />

              {/* Locality */}
              <div className="flex h-14 flex-[1.5] items-center gap-3 rounded-xl px-4 transition focus-within:bg-gray-50">

                <Search
                  size={20}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Enter your locality (e.g. Wakad)"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Divider */}
              <div className="hidden h-10 self-center border-l border-gray-200 sm:block" />

              {/* Service */}
              <button className="flex h-14 flex-1 items-center gap-3 rounded-xl px-4 text-left transition hover:bg-gray-50">

                <SlidersHorizontal
                  size={19}
                  className="shrink-0 text-slate-500"
                />

                <span className="flex-1 truncate text-sm font-medium text-gray-500">
                  Select Service
                </span>

                <ChevronDown
                  size={17}
                  className="text-gray-400"
                />
              </button>

              {/* Search Button */}
              <button className="h-14 rounded-xl bg-orange-500 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]">
                Find Services
              </button>
            </div>

            {/* ================= POPULAR SEARCHES ================= */}
            <div className="mt-4 flex flex-wrap items-center gap-2">

              <span className="mr-1 text-xs font-semibold text-slate-700">
                Popular Searches:
              </span>

              {popularSearches.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm transition hover:border-orange-300 hover:text-orange-500"
                >
                  {item}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;