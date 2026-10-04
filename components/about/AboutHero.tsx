"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={containerRef}
      className="relative pt-12 md:pt-20 pb-20 md:pb-32 px-6 overflow-hidden border-b border-line bg-ink"
    >
      <div className="max-w-site mx-auto space-y-16">
        {/* Editorial Top Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-label text-gold">Biography</span>
            <span className="text-stone">/</span>
            <span className="editorial-label text-stone">Mumbai Archive &middot; Born 1975</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-stone tracking-widest uppercase">
            <span>Actor</span>
            <span className="text-line">&middot;</span>
            <span>Fashion Model</span>
            <span className="text-line">&middot;</span>
            <span>Financier</span>
          </div>
        </div>

        {/* Main Grid: Headline & Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Big Serif Typography */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="editorial-label text-stone tracking-[0.24em] block">
                The Personal Brand Sanctuary
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-ivory tracking-tight leading-[0.95]">
                <TextReveal as="span">Vipul Mota</TextReveal>
                <br />
                <span className="italic font-normal text-gold">Mota</span>
              </h1>
            </div>

            <p className="font-serif text-2xl sm:text-3xl text-stone italic font-light leading-relaxed max-w-xl">
              &ldquo;Style is not decoration; it is discipline made visible. Live king size with uncompromising conviction.&rdquo;
            </p>

            <div className="space-y-4 text-stone text-sm sm:text-base font-light leading-relaxed max-w-xl pt-4 border-t border-line/60">
              <p>
                Born on 29 August 1975 in Mumbai, Vipul Mota operates at the intersection of cinematic screen narrative, sharp sartorial discipline, and high-value private wealth stewardship.
              </p>
              <p>
                As the founder of Javi Groups, his career spans over eighteen years of Western Indian business consulting, complemented by his screen appearance in Hindi crime drama <em>Crime World</em> (2022) streaming on ShemarooMe and an engaged digital community exceeding 1,000,000 followers.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs">
              <div className="space-y-1">
                <span className="editorial-label text-gold block">Current Base</span>
                <span className="text-ivory font-mono">Mumbai, Maharashtra</span>
              </div>
              <div className="h-8 w-px bg-line" />
              <div className="space-y-1">
                <span className="editorial-label text-gold block">Principal Firm</span>
                <span className="text-ivory font-mono">Javi Groups</span>
              </div>
              <div className="h-8 w-px bg-line" />
              <div className="space-y-1">
                <span className="editorial-label text-gold block">Screen Title</span>
                <span className="text-ivory font-mono">Crime World (2022)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Parallax Portrait Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal border border-line">
              <m.div
                style={{ y: imageY, scale: imageScale }}
                className="relative w-full h-full"
              >
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                  alt="Vipul Mota Portrait"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-[center_20%]"
                />
              </m.div>

              {/* Editorial Plate Label */}
              <div className="absolute bottom-4 left-4 right-4 bg-ink/90 backdrop-blur-sm border border-line p-3 flex items-center justify-between text-xs">
                <span className="editorial-label text-gold">Plate 01 / Archive Portrait</span>
                <span className="text-stone font-mono">Mumbai &middot; 2026</span>
              </div>
            </div>

            {/* Subtle decorative background frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/20 -z-10 hidden sm:block pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
