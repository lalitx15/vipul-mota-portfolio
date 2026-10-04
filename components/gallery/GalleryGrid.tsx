"use client";

import React, { useState } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { Maximize2, Bookmark, Check } from "lucide-react";
import { Lightbox, type LightboxImage } from "@/components/ui/Lightbox";
import { useToast } from "@/components/ui/Toast";
import type { GalleryItem } from "@/lib/supabase/gallery";

interface GalleryGridProps {
  items: GalleryItem[];
}

const CATEGORIES = [
  "All Plates",
  "Portraits",
  "Editorial",
  "Lifestyle",
  "Events",
  "Behind the scenes",
] as const;

export function GalleryGrid({ items }: GalleryGridProps) {
  const { success, info } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Plates");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const filteredItems =
    selectedCategory === "All Plates"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const lightboxImages: LightboxImage[] = filteredItems.map((item) => ({
    src: item.image_url,
    alt: item.alt_text || "Editorial plate",
    caption: item.caption || undefined,
    category: item.category || undefined,
  }));

  const handleToggleSave = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    const isSaved = !!savedIds[item.id];
    setSavedIds((prev) => ({ ...prev, [item.id]: !isSaved }));

    if (!isSaved) {
      success(
        `Plate ${item.caption ? `"${item.caption}"` : item.id} added to your Member Collection.`,
        "Plate Saved"
      );
    } else {
      info("Plate removed from your Member Collection.", "Plate Removed");
    }
  };

  return (
    <section className="space-y-12">
      {/* Category Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-line pb-6">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const count =
            cat === "All Plates"
              ? items.length
              : items.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 text-xs uppercase tracking-[0.16em] transition-all rounded-none ${
                isActive
                  ? "bg-black text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200 border border-neutral-200"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`ml-2 font-mono text-[10px] ${
                  isActive ? "text-gold" : "text-neutral-400"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Asymmetric Gallery Grid */}
      <m.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const isSaved = !!savedIds[item.id];

            return (
              <m.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="view"
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-charcoal border border-line cursor-pointer overflow-hidden flex flex-col justify-between hover:border-gold/60 transition-all duration-500"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                  <Image
                    src={item.image_url}
                    alt={item.alt_text || "Editorial plate"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30 opacity-70" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="editorial-label text-[10px] text-ivory bg-ink/90 backdrop-blur-sm border border-line px-2.5 py-1">
                      {item.category}
                    </span>
                  </div>

                  {/* Top Right Save Bookmark Action */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => handleToggleSave(e, item)}
                      aria-label="Save Plate to Collection"
                      className={`p-2 backdrop-blur-sm border transition-colors ${
                        isSaved
                          ? "bg-gold text-ink border-gold"
                          : "bg-ink/80 text-stone hover:text-gold border-line"
                      }`}
                    >
                      {isSaved ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Center Expand Icon Hover */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-5 border-t border-line/60 bg-charcoal space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone">
                    <span className="editorial-label text-gold">
                      Plate {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] text-stone">2026 Archive</span>
                  </div>
                  <p className="text-ivory font-serif text-sm font-light leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                    {item.caption || "Mumbai Editorial & Lookbook Series"}
                  </p>
                </div>
              </m.div>
            );
          })}
        </AnimatePresence>
      </m.div>

      {/* Lightbox Component */}
      {lightboxIndex !== null && (
        <Lightbox
          isOpen={lightboxIndex !== null}
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
        />
      )}
    </section>
  );
}
