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

            {/* Additional Profiles: IMDb, Facebook, Grokopedia, Google Search */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 flex items-center gap-2">
                <span>Verified Profiles &amp; Web Dossiers</span>
                <span className="h-px flex-1 bg-neutral-800/80" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* 1. IMDb - Only Icon in Large Size */}
                <a
                  href="https://share.google/HPotBh2mTJcscwzut"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="IMDb Profile - Vipul Mota"
                  title="IMDb Profile - Vipul Mota"
                  className="inline-flex items-center justify-center px-3 py-2 bg-neutral-900/90 border border-neutral-700/80 hover:border-[#F5C518] hover:bg-neutral-800/90 rounded-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md group"
                >
                  <svg
                    viewBox="0 0 575 289.83"
                    className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-105"
                    role="img"
                    aria-label="IMDb"
                  >
                    <path
                      d="M575 24.91C573.44 12.15 563.97 1.98 551.91 0C499.05 0 76.18 0 23.32 0C10.11 2.17 0 14.16 0 28.61C0 51.84 0 237.64 0 260.86C0 276.86 12.37 289.83 27.64 289.83C79.63 289.83 495.6 289.83 547.59 289.83C561.65 289.83 573.26 278.82 575 264.57C575 216.64 575 48.87 575 24.91Z"
                      fill="#f5c518"
                    />
                    <path
                      d="M69.35 58.24L114.98 58.24L114.98 233.89L69.35 233.89L69.35 58.24Z"
                      fill="#000000"
                    />
                    <path
                      d="M201.2 139.15C197.28 112.38 195.1 97.5 194.67 94.53C192.76 80.2 190.94 67.73 189.2 57.09C185.25 57.09 165.54 57.09 130.04 57.09L130.04 232.74L170.01 232.74L170.15 116.76L186.97 232.74L215.44 232.74L231.39 114.18L231.54 232.74L271.38 232.74L271.38 57.09L211.77 57.09L201.2 139.15Z"
                      fill="#000000"
                    />
                    <path
                      d="M346.71 93.63C347.21 95.87 347.47 100.95 347.47 108.89C347.47 115.7 347.47 170.18 347.47 176.99C347.47 188.68 346.71 195.84 345.2 198.48C343.68 201.12 339.64 202.43 333.09 202.43C333.09 190.9 333.09 98.66 333.09 87.13C338.06 87.13 341.45 87.66 343.25 88.7C345.05 89.75 346.21 91.39 346.71 93.63ZM367.32 230.95C372.75 229.76 377.31 227.66 381.01 224.67C384.7 221.67 387.29 217.52 388.77 212.21C390.26 206.91 391.14 196.38 391.14 180.63C391.14 174.47 391.14 125.12 391.14 118.95C391.14 102.33 390.49 91.19 389.48 85.53C388.46 79.86 385.93 74.71 381.88 70.09C377.82 65.47 371.9 62.15 364.12 60.13C356.33 58.11 343.63 57.09 321.54 57.09C319.27 57.09 307.93 57.09 287.5 57.09L287.5 232.74L342.78 232.74C355.52 232.34 363.7 231.75 367.32 230.95Z"
                      fill="#000000"
                    />
                    <path
                      d="M464.76 204.7C463.92 206.93 460.24 208.06 457.46 208.06C454.74 208.06 452.93 206.98 452.01 204.81C451.09 202.65 450.64 197.72 450.64 190C450.64 185.36 450.64 148.22 450.64 143.58C450.64 135.58 451.04 130.59 451.85 128.6C452.65 126.63 454.41 125.63 457.13 125.63C459.91 125.63 463.64 126.76 464.6 129.03C465.55 131.3 466.03 136.15 466.03 143.58C466.03 146.58 466.03 161.58 466.03 188.59C465.74 197.84 465.32 203.21 464.76 204.7ZM406.68 231.21L447.76 231.21C449.47 224.5 450.41 220.77 450.6 220.02C454.32 224.52 458.41 227.9 462.9 230.14C467.37 232.39 474.06 233.51 479.24 233.51C486.45 233.51 492.67 231.62 497.92 227.83C503.16 224.05 506.5 219.57 507.92 214.42C509.34 209.26 510.05 201.42 510.05 190.88C510.05 185.95 510.05 146.53 510.05 141.6C510.05 131 509.81 124.08 509.34 120.83C508.87 117.58 507.47 114.27 505.14 110.88C502.81 107.49 499.42 104.86 494.98 102.98C490.54 101.1 485.3 100.16 479.26 100.16C474.01 100.16 467.29 101.21 462.81 103.28C458.34 105.35 454.28 108.49 450.64 112.7C450.64 108.89 450.64 89.85 450.64 55.56L406.68 55.56L406.68 231.21Z"
                      fill="#000000"
                    />
                  </svg>
                </a>

                {/* 2. Facebook */}
                <a
                  href="https://share.google/qgYQyMaLIfHFB6IvY"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-neutral-900/90 border border-neutral-700/80 hover:border-[#1877F2] hover:bg-[#1877F2]/10 text-neutral-200 hover:text-white rounded-md transition-all duration-300 hover:scale-105 active:scale-95 group text-xs font-mono font-medium tracking-wide shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>

                {/* 3. Grokopedia */}
                <a
                  href="https://grokipedia.com/page/Vipul_Mota"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Grokopedia Profile"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-neutral-900/90 border border-neutral-700/80 hover:border-gold hover:bg-gold/10 text-neutral-200 hover:text-gold rounded-md transition-all duration-300 hover:scale-105 active:scale-95 group text-xs font-mono font-medium tracking-wide shadow-md"
                >
                  <svg viewBox="0 0 256 256" className="w-5 h-5 fill-current text-gold" aria-hidden="true">
                    <path transform="translate(128 128) scale(0.6468438388304832) translate(-275.9955 -277.778)" d="M442.218 143.111L415.107 216H410.218L419.107 165.333C423.107 140 399.996 128 361.773 128C303.107 128 261.773 142.222 219.996 188.889C176.885 236 150.218 308 150.218 351.556C150.218 400 179.551 429.778 231.551 429.778C263.107 429.778 290.662 421.778 306.662 409.333C310.662 406.667 312.44 403.111 314.662 395.556L351.551 303.556C354.662 295.111 351.551 293.778 344.44 293.778H289.773L291.551 286.222H422.662L420.885 293.778H402.218C396.44 293.778 391.996 295.111 390.218 300L349.329 406.667C317.773 419.111 272.885 435.556 230.662 435.556C156.44 435.556 109.773 397.333 109.773 342.667C109.773 296.889 141.773 237.333 193.329 189.778C242.662 144.444 296.44 120 355.996 120C394.218 120 423.996 128.889 442.218 143.111Z" />
                  </svg>
                  <span>Grokopedia</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-gold transition-colors" />
                </a>

                {/* 4. Google Search */}
                <a
                  href="https://share.google/i5rw79SH55IKbRN1f"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Search"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-neutral-900/90 border border-neutral-700/80 hover:border-white/40 hover:bg-white/5 text-neutral-200 hover:text-white rounded-md transition-all duration-300 hover:scale-105 active:scale-95 group text-xs font-mono font-medium tracking-wide shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Google Search</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
