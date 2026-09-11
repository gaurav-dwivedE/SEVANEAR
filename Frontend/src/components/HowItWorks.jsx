import React from "react";
import { Search, Users, CalendarCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose a Service",
    description: "Select the service you need in your area.",
    icon: Search,
  },
  {
    number: "02",
    title: "Find a Professional",
    description: "Compare trusted professionals and their prices.",
    icon: Users,
  },
  {
    number: "03",
    title: "Book & Get Service",
    description: "Book your professional and get the job done.",
    icon: CalendarCheck,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 sm:py-12">
      <div className="w-full px-6 sm:px-12 lg:px-16">

 <div>
            
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
               How It Works
            </h2>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-base" >
              Get Service in 3 Simple Steps
            </p>
          </div>


       
        <div className="relative mx-auto mt-9 max-w-5xl">

          {/* Connecting line */}
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-orange-200 md:block" />

          <div className="grid gap-7 md:grid-cols-3 md:gap-10">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-50 bg-orange-500 text-white shadow-sm">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  {/* Number */}
                  <span className="mt-3 text-[11px] font-bold text-orange-500">
                    {step.number}
                  </span>

                  {/* Content */}
                  <h3 className="mt-1 text-base font-bold text-blue-950">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 max-w-xs text-sm leading-5 text-slate-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;