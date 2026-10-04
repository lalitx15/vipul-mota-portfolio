"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { WorkItem } from "@/lib/supabase/home";

interface HomeSelectedWorkProps {
  workItems: WorkItem[];
}

export function HomeSelectedWork({ workItems }: HomeSelectedWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate transform for horizontal movement
  // If there are 3-4 items, translate from 0% to -65%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);
  const progressBarScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[260vh] bg-white text-black selection:bg-black selection:text-white">
      {/* Sticky Fullscreen Pinned Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-hidden bg-white">

        {/* Top Header & Progress */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/20 pb-6 gap-4 shrink-0 backdrop-blur-xs">
          <div className="space-y-1">
            <span className="editorial-label text-black/80 font-mono tracking-widest text-xs uppercase font-semibold">
              04 / Selected Work
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-black font-semibold tracking-tight">
              Curated Credits &amp; Commercial Archive
            </h2>
          </div>

          <div className="flex items-center space-x-6 text-xs text-black/80 font-mono">
            <span className="hidden sm:inline">Horizontal Scroll Active</span>
            <Link
              href="/work"
              className="text-black font-semibold hover:text-blue-600 transition-colors underline underline-offset-4"
            >
              All Projects &rarr;
            </Link>
          </div>
        </div>

        {/* Horizontal Moving Rail */}
        <div className="relative z-10 flex-1 flex items-center overflow-hidden my-auto py-8">
          <m.div
            style={{
              x: isReducedMotion ? 0 : x,
            }}
            className="flex items-stretch space-x-8 lg:space-x-12 shrink-0 will-change-transform"
          >
            {workItems.map((item, index) => (
              <div
                key={item.id}
                className="w-[85vw] sm:w-[550px] lg:w-[650px] shrink-0 bg-white/90 backdrop-blur-xl border border-black/15 p-8 flex flex-col justify-between space-y-6 group hover:border-black/40 hover:shadow-2xl transition-all duration-500 rounded-2xl shadow-xl text-black"
              >
                {/* Image Viewport */}
                {item.cover_url && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/10 rounded-lg">
                    <Image
                      src={item.cover_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 85vw, 650px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="editorial-label text-black bg-white/95 px-2.5 py-1 border border-black/15 font-mono text-[10px] tracking-wider rounded-sm shadow-xs font-semibold">
                        Plate {String(index + 1).padStart(2, "0")} &middot; {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-black/70 font-mono font-medium">{item.year}</span>
                    <span className="text-black font-semibold">{item.role}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-black group-hover:text-blue-600 transition-colors duration-300 font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-black/85 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-black/15 flex items-center justify-between text-xs">
                  <span className="editorial-label text-black/70 font-mono">
                    Platform: {item.platform || "Private Release"}
                  </span>
                  <Link
                    href={`/work`}
                    className="inline-flex items-center space-x-1 text-black hover:text-blue-600 transition-colors uppercase tracking-[0.16em] font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </m.div>
        </div>

        {/* Bottom Pinned Progress Bar */}
        <div className="relative z-10 shrink-0 pt-4 border-t border-black/20 flex items-center justify-between text-xs text-black font-medium">
          <span className="font-mono text-black font-semibold">01 &mdash; {String(workItems.length).padStart(2, "0")}</span>
          <div className="w-1/2 max-w-xs h-[3px] bg-black/15 relative overflow-hidden rounded-full">
            <m.div
              style={{ scaleX: progressBarScale }}
              className="absolute inset-0 bg-black origin-left"
            />
          </div>
          <span className="font-mono text-black font-medium">Scroll to Navigate</span>
        </div>
      </div>
    </section>
  );
}

export default HomeSelectedWork;

