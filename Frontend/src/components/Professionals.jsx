import React from "react";
import {
  Heart,
  MapPin,
  Star,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const professionals = [
  {
    name: "Ramesh Plumbing Services",
    category: "Plumber",
    image: "/images/professionals/plumber.jpg",
    rating: "4.8",
    reviews: "125",
    location: "Wakad, Pune",
    distance: "1.2 km",
    price: "₹299",
    services: ["All Plumbing", "Bathroom Fitting", "Leak Repair"],
  },
  {
    name: "Sharma Electricals",
    category: "Electrician",
    image: "/images/professionals/electrician.jpg",
    rating: "4.7",
    reviews: "98",
    location: "Hinjewadi, Pune",
    distance: "2.4 km",
    price: "₹249",
    services: ["Wiring", "Switch Board", "Fan Installation"],
  },
  {
    name: "Perfect Home Painting",
    category: "Painter",
    image: "/images/professionals/painter.jpg",
    rating: "4.9",
    reviews: "210",
    location: "Baner, Pune",
    distance: "3.1 km",
    price: "₹999",
    services: ["Interior", "Exterior", "Texture Painting"],
  },
  {
    name: "CoolCare AC Services",
    category: "AC Repair",
    image: "/images/professionals/ac-repair.jpg",
    rating: "4.6",
    reviews: "76",
    location: "Aundh, Pune",
    distance: "3.5 km",
    price: "₹399",
    services: ["AC Repair", "Gas Filling", "Installation"],
  },
];

const Professionals = () => {
  return (
     <section className="bg-white sm:py-14 lg:py-18">
      <div className="w-full  px-6  sm:px-12 lg:px-16">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
        
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
              Top Professionals Near You
            </h2>

            <p className="mt-1 text-[15px] text-slate-500 sm:text-base">
              Verified, experienced and highly rated service providers
            </p>
          </div>

          <button className="hidden items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-orange-500 sm:flex">
            View All Services
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.name}
              professional={professional}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <button className="mx-auto mt-7 flex items-center gap-1.5 text-sm font-bold text-blue-600 sm:hidden">
          View All Services
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
};

const ProfessionalCard = ({ professional }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={professional.image}
          alt={professional.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/30 to-transparent" />

        {/* Verified Badge */}
        

        {/* Favorite */}
        <button
          aria-label="Add to favorites"
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
        >
          <Heart
            size={17}
            className="text-slate-400 transition hover:fill-red-500 hover:text-red-500"
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Name */}
        <h3 className="truncate text-[15px] font-bold text-blue-950">
          {professional.name}
        </h3>

        <p className="mt-1 text-xs font-medium text-slate-400">
          {professional.category}
        </p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1.5">
          <Star
            size={15}
            fill="currentColor"
            className="text-orange-400"
          />

          <span className="text-sm font-bold text-slate-700">
            {professional.rating}
          </span>

          <span className="text-xs text-slate-400">
            ({professional.reviews} reviews)
          </span>
        </div>

        {/* Location */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin
            size={14}
            className="shrink-0 text-blue-500"
          />

          <span className="truncate">
            {professional.location}
          </span>

          <span className="shrink-0 text-slate-400">
            ({professional.distance})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-slate-500">
            Starting from{" "}
            <span className="text-base font-extrabold text-blue-950">
              {professional.price}
            </span>
          </p>
        </div>

        {/* Service Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {professional.services.map((service) => (
            <span
              key={service}
              className="rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-slate-500"
            >
              {service}
            </span>
          ))}
        </div>

        {/* Book Button */}
        <button className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Professionals;