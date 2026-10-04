"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { Instagram, ArrowUpRight, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HomeInternetPersonality() {
  const metrics = [
    {
      label: "Digital Community",
      value: "1 Million+",
      desc: "Engaged followers across verified social footprint",
      icon: Users,
    },
    {
      label: "Media Footprint",
      value: "50M+",
      desc: "Annual impressions across cinematic reels & dispatches",
      icon: TrendingUp,
    },
    {
      label: "Category Domain",
      value: "Luxury & Mindset",
      desc: "Sartorial discipline, screen acting & wealth creation",
      icon: Award,
    },
  ];

  return (
    <section
      id="internet-personality"
      className="relative bg-black text-ivory py-24 md:py-36 px-6 border-b border-neutral-900 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-neutral-900/60 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-site mx-auto relative z-10">
        {/* Section Tagline Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-gold/30 text-gold text-[10px] uppercase font-mono tracking-[0.25em] mb-4">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Digital Presence &amp; Influence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
              Vipul Mota &mdash; <span className="italic font-serif text-gold">Internet Personality</span>
            </h2>
          </div>
          <p className="text-stone text-xs sm:text-sm font-mono tracking-wider uppercase max-w-sm">
            Architecting modern aspirational culture through style, discipline, and uncompromising digital charisma.
          </p>
        </div>

        {/* Core Layout: Visual Plate + Narrative Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Personality Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Gold Framing Accents */}
              <div className="absolute -inset-2.5 border border-gold/30 pointer-events-none" />
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-gold" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-gold" />

              {/* Photo Container */}
              <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden shadow-2xl">
                <Image
                  src="/IMG-20261004-WA0023.jpg"
                  alt="Vipul Mota - Internet Personality and Javi Groups Founder"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Plate Tag */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10 text-xs font-mono">
                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white tracking-wider text-[11px]">
                    VIPUL MOTA
                  </span>
                  <span className="text-gold tracking-widest text-[11px] font-semibold">
                    @JAVIGROUPS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Influence Metrics */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="editorial-label text-gold text-xs">A Modern Icon of Presence</span>
              <h3 className="font-serif text-2xl sm:text-4xl text-ivory font-light leading-snug">
                Where screen magnetism meets the power of authentic cultural authority.
              </h3>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
                Beyond the cinematic frames of <em>Crime World</em> (2022) and the boardroom corridors of Javi Groups, Vipul Mota has emerged as one of Mumbai’s most compelling digital personalities. With an audience exceeding 1 Million on Instagram alone, his presence bridges high-fashion aesthetics with hard-earned entrepreneurial wisdom.
              </p>
              <p className="text-stone text-xs sm:text-sm leading-relaxed font-light">
                Each reel, broadcast, and visual dispatch is crafted with bespoke intentionality&mdash;demonstrating that style is never mere ornament, but the ultimate expression of personal discipline, financial focus, and self-mastery.
              </p>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
              {metrics.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="p-4 bg-neutral-950/80 border border-neutral-800/80 hover:border-gold/50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gold mb-2" />
                    <div className="font-serif text-2xl font-light text-white tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mt-1">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-stone mt-1 leading-normal">
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://instagram.com/javigroups"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8965F] text-ink font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                <Instagram className="w-4 h-4 text-ink" />
                <span>Visit Official Instagram (@javigroups)</span>
                <ArrowUpRight className="w-4 h-4 text-ink" />
              </a>

              <Link href="/about">
                <Button variant="outline" size="lg" className="border-neutral-700 text-ivory hover:border-gold">
                  Explore Full Biography &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
