"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import {
  CoverflowCarousel,
  CoverflowCarouselHandle,
  CoverflowSlide,
} from "@/components/ui/coverflow-carousel";

// All 20 photos from user's photo library
const photoLibrary = Array.from({ length: 20 }, (_, idx) => {
  const pad = String(idx + 1).padStart(2, "0");
  return {
    id: `vipul-${pad}`,
    imageUrl: `/library/vipul-${pad}.jpg`,
    alt: `Vipul Mota Portfolio Photo ${idx + 1}`,
  };
});

const slides: CoverflowSlide[] = photoLibrary.map((photo, idx) => ({
  src: photo.imageUrl,
  alt: photo.alt,
  title: `Vipul Mota — Visual Archive #${String(idx + 1).padStart(2, "0")}`,
  subtitle: "Editorial & Cinema Character Study",
}));

export function HomePhotoCarousel() {
  const carouselRef = useRef<CoverflowCarouselHandle>(null);

  return (
    <section className="relative w-full py-16 md:py-24 bg-black text-white overflow-hidden border-b border-neutral-900">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header & Navigation */}
      <div className="max-w-site mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 py-1 px-3 border border-white/15 bg-neutral-900/90 text-gold text-[10px] uppercase font-mono tracking-widest rounded-full mb-3 backdrop-blur-sm">
            <Camera className="w-3 h-3 text-gold" />
            <span>Curated Anthology</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Different Worlds. <span className="italic text-gold">One Signature.</span>
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-lg">
            Drag or scroll through the visual archive capturing actor character craft, Italian tailored lookbooks, and high-value presence.
          </p>
        </div>

        {/* Scroll Controls (connected to 3D Coverflow) */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={() => carouselRef.current?.nudge(-1)}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-gold hover:text-gold flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => carouselRef.current?.nudge(1)}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-gold hover:text-gold flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 3D Coverflow Carousel with Medium-Speed Auto Scroll */}
      <div className="relative w-full overflow-hidden">
        <CoverflowCarousel
          ref={carouselRef}
          slides={slides}
          cardWidth="clamp(220px, 24vw, 320px)"
          aspectRatio="3/4"
          rotate={36}
          depth={0.55}
          perspective={3}
          falloff={0.58}
          gap={0.06}
          loop={true}
          autoPlay={true}
          autoPlayInterval={1600}
          showNavigation={false}
          showPagination={true}
        />
      </div>
    </section>
  );
}

export default HomePhotoCarousel;
