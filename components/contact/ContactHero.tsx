"use client";

import React from "react";
import { TextReveal } from "@/components/ui/TextReveal";

export function ContactHero() {
  return (
    <section className="relative pt-12 md:pt-20 pb-12 px-6 border-b border-line bg-ink">
      <div className="max-w-site mx-auto space-y-8">
        {/* Top Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-label text-gold">Representation &amp; Inquiries</span>
            <span className="text-stone">/</span>
            <span className="editorial-label text-stone">Management Office &middot; Mumbai</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-stone tracking-widest uppercase">
            <span>Casting</span>
            <span className="text-line">&middot;</span>
            <span>Brand Alliances</span>
            <span className="text-line">&middot;</span>
            <span>Private Syndication</span>
          </div>
        </div>

        {/* Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="editorial-label text-stone tracking-[0.24em] block">
              Direct Executive Communications
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-ivory tracking-tight leading-[0.95]">
              <TextReveal as="span">Initiate</TextReveal>
              <br />
              <span className="italic font-normal text-gold">Dialogue</span>
            </h1>
          </div>

          <div className="lg:col-span-4 text-stone text-xs sm:text-sm font-light leading-relaxed pb-2">
            <p>
              Whether considering screen casting opportunities, bespoke sartorial campaigns, keynote engagements, or private wealth syndication through Javi Groups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
