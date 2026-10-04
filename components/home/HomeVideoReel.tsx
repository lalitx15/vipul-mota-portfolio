"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoItem } from "@/lib/supabase/home";

interface HomeVideoReelProps {
  videos: VideoItem[];
}

export function HomeVideoReel({ videos }: HomeVideoReelProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const featured = videos[0];
  const sideVideos = videos.slice(1, 4);

  const currentDisplay = activeVideo || featured;

  return (
    <section className="max-w-site mx-auto px-6 py-24 md:py-36 space-y-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
        <div className="space-y-2">
          <span className="editorial-label text-gold">07 / Motion Archive</span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory">
            Screen Clips &amp; Broadcast Repertoire
          </h2>
        </div>
        <p className="text-stone text-xs sm:text-sm max-w-md font-light leading-relaxed">
          Featured on-screen roles including Crime World (2022) streaming on ShemarooMe, alongside lifestyle philosophy dispatches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Featured Video Player (Lite Click-To-Play Embed) */}
        <div className="lg:col-span-8 bg-charcoal border border-line p-6 md:p-8 space-y-6">
          <div className="relative w-full aspect-video bg-ink overflow-hidden border border-line">
            {isPlaying && currentDisplay ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentDisplay.video_id}?autoplay=1&rel=0`}
                title={currentDisplay.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                data-cursor="play"
                className="group relative w-full h-full cursor-pointer overflow-hidden"
              >
                {currentDisplay?.thumbnail_url && (
                  <Image
                    src={currentDisplay.thumbnail_url}
                    alt={currentDisplay.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-ink/50 group-hover:bg-ink/30 transition-colors" />

                {/* Center Magnetic Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold/60 bg-ink/70 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink transition-all duration-300 group-hover:scale-110 shadow-2xl">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-stone">
                  <span className="editorial-label text-gold bg-ink/80 px-2 py-0.5 border border-line">
                    {currentDisplay?.category || "Featured Broadcast"}
                  </span>
                  <span className="editorial-label text-ivory/80 bg-ink/80 px-2 py-0.5 border border-line">
                    Click to Play
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Current Video Meta */}
          {currentDisplay && (
            <div className="space-y-2 pt-2 border-t border-line/60">
              <span className="editorial-label text-gold text-xs">
                {currentDisplay.platform.toUpperCase()} &middot; {currentDisplay.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light leading-snug">
                {currentDisplay.title}
              </h3>
            </div>
          )}
        </div>

        {/* Right Column: Next 3 Videos Selection Rail */}
        <div className="lg:col-span-4 space-y-4">
          <span className="editorial-label text-stone block">
            Select Broadcast &amp; Episode
          </span>

          <div className="space-y-4">
            {sideVideos.map((vid) => {
              const isSelected = currentDisplay?.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => {
                    setActiveVideo(vid);
                    setIsPlaying(true);
                  }}
                  data-cursor="play"
                  className={`group p-4 bg-charcoal border transition-all duration-300 cursor-pointer ${
                    isSelected ? "border-gold" : "border-line hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-16 shrink-0 bg-ink overflow-hidden border border-line">
                      {vid.thumbnail_url && (
                        <Image
                          src={vid.thumbnail_url}
                          alt={vid.title}
                          fill
                          sizes="96px"
                          className="object-cover transition-all"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-4 h-4 text-gold fill-current" />
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="editorial-label text-gold text-[10px] block truncate">
                        {vid.category}
                      </span>
                      <h4 className="font-serif text-sm text-ivory group-hover:text-gold transition-colors font-light line-clamp-2">
                        {vid.title}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-line/60">
            <Link
              href="/videos"
              className="text-xs text-stone hover:text-gold transition-colors underline underline-offset-4 uppercase tracking-widest inline-flex items-center space-x-2"
            >
              <span>View All Videos &amp; Reels</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
