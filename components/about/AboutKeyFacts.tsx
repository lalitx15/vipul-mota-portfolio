import React from "react";

interface FactRow {
  label: string;
  value: string;
  note?: string;
}

const FACTS: FactRow[] = [
  {
    label: "Full Name",
    value: "Vipul Mota",
    note: "Official personal brand & legal designation",
  },
  {
    label: "Date of Birth",
    value: "29 August 1975",
    note: "Born in Mumbai, Maharashtra, India",
  },
  {
    label: "Current Base",
    value: "Mumbai, India",
    note: "South Mumbai / Marine Drive aesthetic anchor",
  },
  {
    label: "Creative & Professional Disciplines",
    value: "Actor · Fashion Model · Financier · Brand Principal",
    note: "The Triad: Cinema, Sartorial Craft, and Private Wealth",
  },
  {
    label: "On-Screen Screen Credits",
    value: 'Crime World (2022) — Role: "Neighbour"',
    note: "Episode 2-12; Hindi crime thriller streaming on ShemarooMe",
  },
  {
    label: "Fashion Modeling Practice",
    value: "Bespoke Italian Suiting & Mumbai Sartorial Lookbook",
    note: "Self-curated editorial lookbook; open for luxury campaigns",
  },
  {
    label: "Commercial Enterprise",
    value: "Owner & Founder, Javi Groups",
    note: "Strategic wealth advisory, private syndication, lifestyle consulting",
  },
  {
    label: "Digital Channels & Reach",
    value: "1 Million+ on Instagram (@javigroups) · 100K+ on YouTube (@VibewithVipulMota)",
    note: "Also active on Facebook & Threads (@javigroups)",
  },
  {
    label: "Personal Brand Philosophy",
    value: "“Live King Size”",
    note: "Living with scale, confidence, and deliberate discipline",
  },
  {
    label: "Core Brand Tagline",
    value: "Style. Wealth. Presence.",
    note: "Three pillars of the modern Vipul Mota portfolio",
  },
];

export function AboutKeyFacts() {
  return (
    <section className="w-full bg-white text-black py-20 md:py-32 border-b border-neutral-200">
      <div className="max-w-site mx-auto px-6 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-black/15 pb-6 gap-4">
          <div className="space-y-1">
            <span className="editorial-label text-gold font-semibold">02 / Verified Dossier</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-black">
              Key Facts &amp; Archive Parameters
            </h2>
          </div>
          <p className="text-neutral-600 text-xs sm:text-sm font-light max-w-sm">
            Strictly verified facts from the official brand archive of Vipul Mota.
          </p>
        </div>

        {/* Editorial Fact Sheet Grid */}
        <div className="border-t border-black/15 divide-y divide-black/10">
          {FACTS.map((fact, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 py-5 md:py-6 gap-2 md:gap-6 hover:bg-neutral-50 transition-colors px-2 md:px-4"
            >
              <div className="md:col-span-4 flex items-center space-x-3">
                <span className="editorial-label text-gold text-[10px] font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="editorial-label text-neutral-600 text-xs tracking-wider">
                  {fact.label}
                </span>
              </div>

              <div className="md:col-span-5 flex items-center">
                <span className="text-black font-serif text-lg md:text-xl font-normal">
                  {fact.value}
                </span>
              </div>

              <div className="md:col-span-3 flex items-center md:justify-end">
                {fact.note && (
                  <span className="text-neutral-500 text-xs font-light tracking-wide">
                    {fact.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
