import React from "react";
import {
  Droplets,
  Zap,
  PaintRoller,
  Snowflake,
  SprayCan,
  Hammer,
  WashingMachine,
  Car,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    name: "Plumber",
    price: "₹299",
    icon: Droplets,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    name: "Electrician",
    price: "₹249",
    icon: Zap,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    name: "Painter",
    price: "₹999",
    icon: PaintRoller,
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    name: "AC Repair",
    price: "₹399",
    icon: Snowflake,
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-500",
  },
  {
    name: "Home Cleaning",
    price: "₹299",
    icon: SprayCan,
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    name: "Carpenter",
    price: "₹499",
    icon: Hammer,
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Appliance Repair",
    price: "₹349",
    icon: WashingMachine,
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    name: "Vehicle Services",
    price: "₹499",
    icon: Car,
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

const Services = () => {
  return (
    <section className="bg-white sm:py-14 lg:py-18">
      <div className="w-full  px-6  sm:px-12 lg:px-16">

        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
              Our Services
            </h2>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-base" >
              Choose from a wide range of home and personal services
            </p>
          </div>

          <button className="hidden items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-orange-500 sm:flex">
            View All Services
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-8">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <button
                key={service.name}
                className={`group relative overflow-hidden rounded-2xl border border-gray-100 ${service.bg} p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg`}
              >
                {/* Icon */}
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${service.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon
                    size={27}
                    strokeWidth={2}
                    className={service.iconColor}
                  />
                </div>

                {/* Name */}
                <h3 className="mt-4 text-sm font-bold text-blue-950">
                  {service.name}
                </h3>

                {/* Price */}
                <p className="mt-1.5 text-xs text-slate-500">
                  From{" "}
                  <span className="font-bold text-slate-700">
                    {service.price}
                  </span>
                </p>
              </button>
            );
          })}
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

export default Services;