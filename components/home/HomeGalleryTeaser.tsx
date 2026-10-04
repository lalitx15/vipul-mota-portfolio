"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lightbox, type LightboxImage } from "@/components/ui/Lightbox";
import type { GalleryItem } from "@/lib/supabase/home";

interface HomeGalleryTeaserProps {
  galleryItems: GalleryItem[];
}

export function HomeGalleryTeaser({ galleryItems }: HomeGalleryTeaserProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const lightboxImages: LightboxImage[] = galleryItems.map((item) => ({
    src: item.image_url,
    caption: item.caption || undefined,
    category: item.category || undefined,
    alt: item.alt_text || undefined,
  }));

  const handleOpenLightbox = (index: number) => {
    setActiveIdx(index);
    setLightboxOpen(true);
  };

  return (
    <section className="max-w-site mx-auto px-6 py-24 md:py-36 space-y-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
        <div className="space-y-2">
          <span className="editorial-label text-gold">06 / Visual Anthology</span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory">
            The Lookbook Collage
          </h2>
        </div>
        <p className="text-stone text-xs sm:text-sm max-w-md font-light leading-relaxed">
          Curated plates across Mumbai Marine Drive, high-contrast studio character studies, and private venture moments. Click any plate to launch full lightbox.
        </p>
      </div>

      {/* Asymmetric Offset Collage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Large Feature Item 01 */}
        {galleryItems[0] && (
          <div
            onClick={() => handleOpenLightbox(0)}
            data-cursor="view"
            className="md:col-span-7 group relative bg-charcoal border border-line overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/11] w-full overflow-hidden">
              <Image
                src={galleryItems[0].image_url}
                alt={galleryItems[0].caption || "Lookbook plate"}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-6 flex items-center justify-between border-t border-line/60">
              <div className="space-y-1">
                <span className="editorial-label text-gold">
                  {galleryItems[0].category || "Lookbook"} &middot; Plate 01
                </span>
                <p className="font-serif text-xl text-ivory font-light">
                  {galleryItems[0].caption || "Marine Drive Twilight Silhouette"}
                </p>
              </div>
              <span className="editorial-label text-stone group-hover:text-gold transition-colors">
                Enlarge &rarr;
              </span>
            </div>
          </div>
        )}

        {/* Stacked Side Column */}
        <div className="md:col-span-5 space-y-8 md:pt-12">
          {galleryItems.slice(1, 3).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(idx + 1)}
              data-cursor="view"
              className="group relative bg-charcoal border border-line overflow-hidden cursor-pointer"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.caption || "Lookbook plate"}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-70" />
              </div>
              <div className="p-5 flex items-center justify-between border-t border-line/60">
                <div className="space-y-0.5">
                  <span className="editorial-label text-gold text-[10px]">
                    Plate {String(idx + 2).padStart(2, "0")} &middot; {item.category}
                  </span>
                  <p className="font-serif text-base text-ivory font-light truncate max-w-xs">
                    {item.caption}
                  </p>
                </div>
                <span className="editorial-label text-stone group-hover:text-gold transition-colors text-[10px]">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Full Gallery CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-line/60 pt-6 gap-4 text-xs text-stone">
        <span>Curated High-Resolution Film Archive</span>
        <Link
          href="/gallery"
          className="text-ivory hover:text-gold transition-colors underline underline-offset-4"
        >
          Explore Complete Photographic Gallery &rarr;
        </Link>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={activeIdx}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setActiveIdx(idx)}
      />
    </section>
  );
}
