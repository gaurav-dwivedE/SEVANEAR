import { useState } from "react";

export default function DashboardShell({ eyebrow, title, tabs, children }) {
  const [active, setActive] = useState(tabs[0].key);
  const ActiveContent = children(active);

  return (
    <div className="pb-28 pt-36">
      <div className="container-page">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-4xl text-ivory-50 md:text-5xl">{title}</h1>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[220px,1fr]">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-left text-sm transition-colors lg:rounded-xl ${
                  active === tab.key
                    ? "bg-ivory-100 text-ink-950"
                    : "text-ivory-200/60 hover:bg-ivory-100/5 hover:text-ivory-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">{ActiveContent}</div>
        </div>
      </div>
    </div>
  );
}
