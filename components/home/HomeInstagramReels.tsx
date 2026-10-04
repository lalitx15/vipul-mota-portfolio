"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import {
  CoverflowCarousel,
  CoverflowCarouselHandle,
  CoverflowSlide,
} from "@/components/ui/coverflow-carousel";

// All 15 videos from user's video library
const videoLibrary = Array.from({ length: 15 }, (_, idx) => {
  const pad = String(idx + 1).padStart(2, "0");
  return {
    id: `reel-${pad}`,
    videoUrl: `/videos/reel-${pad}.mp4`,
    posterUrl: `/library/vipul-${String((idx % 20) + 1).padStart(2, "0")}.jpg`,
  };
});

const reelSlides: CoverflowSlide[] = videoLibrary.map((item, idx) => ({
  src: item.posterUrl,
  videoUrl: item.videoUrl,
  alt: `Vipul Mota Reel ${idx + 1}`,
  title: `Reel #${String(idx + 1).padStart(2, "0")}`,
  subtitle: "Cinematic Reel",
}));

export function HomeInstagramReels() {
  const carouselRef = useRef<CoverflowCarouselHandle>(null);

  return (
    <section className="relative w-full py-16 md:py-24 bg-white text-black overflow-hidden border-b border-neutral-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header & Navigation */}
      <div className="max-w-site mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 py-1 px-3 border border-neutral-200 bg-neutral-100 text-neutral-800 text-[10px] uppercase font-mono tracking-widest rounded-full mb-3 shadow-xs">
            <Video className="w-3 h-3 text-gold" />
            <span className="font-semibold text-neutral-700">Motion Archive &middot; 15 Reels</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-black tracking-tight">
            Motion Stories &amp; <span className="italic text-gold">Repertoire.</span>
          </h2>
          <p className="text-neutral-600 text-xs md:text-sm mt-2 max-w-lg">
            Paused by default. Click any reel to play with audio in vertical cinematic motion.
          </p>
        </div>

        {/* Scroll Controls (connected to 3D Coverflow) */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={() => carouselRef.current?.nudge(-1)}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-neutral-300 bg-neutral-50 hover:border-gold hover:text-gold flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4 text-black" />
          </button>
          <button
            onClick={() => carouselRef.current?.nudge(1)}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-neutral-300 bg-neutral-50 hover:border-gold hover:text-gold flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* 3D Coverflow Carousel with SAME Auto Scroll Speed as Different Worlds */}
      <div className="relative w-full overflow-hidden">
        <CoverflowCarousel
          ref={carouselRef}
          slides={reelSlides}
          cardWidth="clamp(210px, 22vw, 290px)"
          aspectRatio="9/16"
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

export default HomeInstagramReels;
