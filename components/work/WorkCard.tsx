"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Eye } from "lucide-react";
import type { WorkItem } from "@/lib/supabase/work";

interface WorkCardProps {
  item: WorkItem;
  index: number;
}

export function WorkCard({ item, index }: WorkCardProps) {
  const isActing = item.type === "acting";
  const cursorLabel = isActing ? "play" : "view";

  const typeLabelMap = {
    acting: "Cinema & Acting",
    modeling: "Sartorial Lookbook",
    venture: "Commercial Enterprise",
  };

  return (
    <article
      data-cursor={cursorLabel}
      className="group relative bg-charcoal border border-line flex flex-col justify-between overflow-hidden hover:border-gold/60 transition-all duration-500"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-ink">
        <Image
          src={item.cover_url}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
        />

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/40 opacity-80" />

        {/* Floating Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="editorial-label text-[10px] text-ivory bg-ink/90 backdrop-blur-sm border border-line px-2.5 py-1">
            {typeLabelMap[item.type]}
          </span>
          <span className="font-mono text-xs text-gold bg-ink/90 backdrop-blur-sm border border-line px-2 py-0.5">
            {item.year || "2026"}
          </span>
        </div>

        {/* Center Hover Action Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            {isActing ? (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            ) : (
              <Eye className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-xs text-stone">
            <span className="editorial-label text-gold">Plate {String(index + 1).padStart(2, "0")}</span>
            <span>&middot;</span>
            <span>{item.platform || "Mumbai Archive"}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-ivory font-light group-hover:text-gold transition-colors">
            {item.title}
          </h2>

          {item.role && (
            <p className="text-xs uppercase tracking-widest text-gold/90 font-medium">
              Role / Designation: <span className="text-ivory">{item.role}</span>
            </p>
          )}

          <p className="text-stone text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Action Link Row */}
        <div className="pt-6 border-t border-line/60 flex items-center justify-between text-xs">
          <Link
            href={`/work/${item.slug}`}
            className="text-ivory group-hover:text-gold transition-colors flex items-center space-x-1.5 uppercase tracking-widest font-medium"
          >
            <span>Inspect Portfolio Case</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {item.external_url && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone hover:text-ivory transition-colors text-[11px] underline underline-offset-4"
            >
              Direct Source &nearr;
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
