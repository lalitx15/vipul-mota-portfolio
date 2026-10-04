"use client";

import React from "react";
import { m } from "framer-motion";
import { Quote } from "lucide-react";

export function HomeMotivationQuote() {
  return (
    <section className="relative w-full py-24 md:py-36 bg-white text-black overflow-hidden border-b border-neutral-200">
      {/* Decorative hairline accents */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Section Pill */}
        <div className="inline-flex items-center space-x-2 py-1.5 px-4 border border-neutral-200 bg-neutral-50 text-neutral-800 text-[10px] uppercase font-mono tracking-[0.25em] rounded-full shadow-xs">
          <Quote className="w-3 h-3 text-gold" />
          <span className="font-semibold text-neutral-700">The Philosophy of Presence</span>
        </div>

        {/* The Quote Heading */}
        <m.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-black leading-[1.25] tracking-tight">
            &ldquo;Live king size. Style is never an ornament; it is{" "}
            <span className="italic font-normal text-gold underline decoration-gold/60 decoration-1 underline-offset-8">
              discipline made visible
            </span>
            . Built with vision, driven by trust.&rdquo;
          </p>
        </m.blockquote>

        {/* Author Sign-off */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-6 flex flex-col items-center space-y-2.5"
        >
          <div className="w-12 h-0.5 bg-gold" />
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-black">
            Written by Vipul Mota
          </h3>
          <p className="text-neutral-600 text-xs tracking-wider uppercase font-sans font-medium">
            Actor · Fashion Model · Founder of Javi Groups · Marine Drive, Mumbai
          </p>
        </m.div>
      </div>
    </section>
  );
}
