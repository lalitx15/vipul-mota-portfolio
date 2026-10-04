"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

export function VideosHero() {
  return (
    <section className="relative pt-12 md:pt-20 pb-12 px-6 border-b border-line bg-ink">
      <div className="max-w-site mx-auto space-y-8">
        {/* Top Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-label text-gold">Broadcast Repertoire</span>
            <span className="text-stone">/</span>
            <span className="editorial-label text-stone">Screen Clips &middot; YouTube &middot; Reels</span>
          </div>

          <a
            href="https://youtube.com/@VibewithVipulMota"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-stone hover:text-gold transition-colors text-xs uppercase tracking-widest font-mono"
          >
            <span>@VibewithVipulMota &middot; 100K+</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="editorial-label text-stone tracking-[0.24em] block">
              Motion Archive &amp; Thought Leadership
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-ivory tracking-tight leading-[0.95]">
              <TextReveal as="span">Screen</TextReveal>
              <br />
              <span className="italic font-normal text-gold">&amp; Repertoire</span>
            </h1>
          </div>

          <div className="lg:col-span-4 text-stone text-xs sm:text-sm font-light leading-relaxed pb-2">
            <p>
              On-screen drama clips from <em>Crime World</em> (2022) streaming on ShemarooMe, alongside long-form strategic conversations from the <em>Vibe with Vipul Mota</em> broadcast series.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
