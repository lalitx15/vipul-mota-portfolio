"use client";

import React from "react";
import { TextReveal } from "@/components/ui/TextReveal";

export function WorkHero() {
  return (
    <section className="relative pt-12 md:pt-20 pb-12 px-6 border-b border-line bg-ink">
      <div className="max-w-site mx-auto space-y-8">
        {/* Top Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-label text-gold">Archive Directory</span>
            <span className="text-stone">/</span>
            <span className="editorial-label text-stone">Selected Works &middot; 2022&ndash;2026</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-stone tracking-widest uppercase">
            <span>Cinema</span>
            <span className="text-line">&middot;</span>
            <span>Lookbook</span>
            <span className="text-line">&middot;</span>
            <span>Enterprise</span>
          </div>
        </div>

        {/* Hero Title & Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="editorial-label text-stone tracking-[0.24em] block">
              The Creative &amp; Commercial Portfolio
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-ivory tracking-tight leading-[0.95]">
              <TextReveal as="span">Selected</TextReveal>
              <br />
              <span className="italic font-normal text-gold">Repertoire</span>
            </h1>
          </div>

          <div className="lg:col-span-4 text-stone text-xs sm:text-sm font-light leading-relaxed pb-2">
            <p>
              On-screen acting in Hindi crime thriller <em>Crime World</em> (2022) streaming on ShemarooMe, bespoke Italian sartorial lookbooks along Mumbai Marine Drive, and private capital stewardship at Javi Groups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
