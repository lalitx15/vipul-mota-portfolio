"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "framer-motion";
import type { TimelineItem } from "@/lib/supabase/about";

interface AboutTimelineProps {
  timeline: TimelineItem[];
}

export function AboutTimeline({ timeline }: AboutTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const spineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="w-full bg-white text-black py-24 md:py-36 border-b border-neutral-200"
    >
      <div className="max-w-site mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-black/15 pb-6 gap-4">
          <div className="space-y-1">
            <span className="editorial-label text-gold font-semibold">04 / The Journey</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-black">
              Chronological Milestones
            </h2>
          </div>
          <p className="text-neutral-600 text-xs sm:text-sm font-light max-w-sm">
            A progression of discipline, architectural heritage, screen debut, and private equity growth.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pt-8">
          {/* Vertical Spine (Background Track) */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 -ml-px w-px bg-neutral-200" />

          {/* Dynamic Glowing Progress Spine */}
          <m.div
            style={{ height: spineHeight }}
            className="absolute top-0 left-4 md:left-1/2 -ml-px w-px bg-gradient-to-b from-gold via-gold to-neutral-200"
          />

          <div className="space-y-16 md:space-y-24">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Center Node / Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold z-10 shadow-xs" />

                  {/* Content Card (Half Width on Desktop) */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                      isEven ? "md:pl-12 lg:pl-16" : "md:pr-12 lg:pr-16 md:text-right"
                    }`}
                  >
                    <div className="bg-neutral-50/90 border border-neutral-200 p-6 md:p-8 space-y-4 hover:border-black/30 hover:shadow-lg transition-all group">
                      <div
                        className={`flex items-center gap-3 ${
                          isEven ? "justify-start" : "md:justify-end justify-start"
                        }`}
                      >
                        <span className="editorial-label text-gold text-sm font-mono tracking-widest px-2.5 py-1 bg-white border border-neutral-200 font-semibold shadow-2xs">
                          {item.year}
                        </span>
                        <span className="editorial-label text-neutral-500 text-xs font-medium">
                          Milestone {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl md:text-3xl text-black font-light group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-neutral-600 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>

                      {item.image_url && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 border border-neutral-200 mt-4 rounded-xs">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
