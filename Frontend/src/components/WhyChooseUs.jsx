import React from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Clock3,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description: "Verified local service providers you can rely on.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Service",
    description: "Choose professionals based on ratings and reviews.",
  },
  {
    icon: Clock3,
    title: "Quick & Convenient",
    description: "Find and book the right service in just a few clicks.",
  },
  {
    icon: Headphones,
    title: "Local Support",
    description: "Get help whenever you need it from our support team.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-10 sm:py-12 mb-12">
      <div className="w-full px-6 sm:px-12 lg:px-16">

        {/* Heading */}
        <div className="mb-8">
         

          <div className="mt-1 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="text-2xl font-bold text-blue-950 sm:text-3xl">
              Why Choose Us?
            </h2>

           
          </div>
        </div>

        {/* Features */}
        <div className="grid border-y border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`flex gap-4 px-5 py-6 ${
                  index !== 0 ? "border-t border-slate-100 lg:border-l lg:border-t-0" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl  text-orange-500">
                  <Icon size={21} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-blue-950">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;