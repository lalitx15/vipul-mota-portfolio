"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ArrowUpRight, Lock } from "lucide-react";
import type { VideoItem } from "@/lib/supabase/videos";

interface FeaturedVideoPlayerProps {
  video: VideoItem;
  startPlaying?: boolean;
}

export function FeaturedVideoPlayer({ video, startPlaying = false }: FeaturedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(startPlaying);

  React.useEffect(() => {
    if (startPlaying) {
      setIsPlaying(true);
    }
  }, [video.id, startPlaying]);

  const isYouTube = video.platform === "youtube";
  const isDirectMp4 = Boolean(video.url?.endsWith(".mp4") || (video.platform as string) === "video");
  const embedUrl = isYouTube
    ? `https://www.youtube-nocookie.com/embed/${video.video_id}?autoplay=1&rel=0`
    : video.url;

  return (
    <div className="bg-charcoal border border-line p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center space-x-3">
          <span className="editorial-label text-gold">Featured Broadcast</span>
          <span className="text-stone">/</span>
          <span className="editorial-label text-stone">{video.category}</span>
        </div>

        {video.members_only ? (
          <span className="flex items-center space-x-1.5 text-xs text-gold border border-gold/40 px-2.5 py-0.5">
            <Lock className="w-3 h-3" />
            <span className="editorial-label text-[10px]">Inner Circle Only</span>
          </span>
        ) : (
          <span className="editorial-label text-[10px] text-stone uppercase">
            Platform: {video.platform}
          </span>
        )}
      </div>

      {/* Video Frame */}
      <div className="relative aspect-video w-full overflow-hidden bg-black border border-line">
        {isPlaying ? (
          isDirectMp4 ? (
            <video
              key={video.id}
              src={video.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )
        ) : (
          <div
            data-cursor="play"
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer group bg-black"
          >
            <Image
              src={
                video.thumbnail_url ||
                "/library/vipul-01.jpg"
              }
              alt={video.title}
              fill
              priority
              sizes="100vw"
              className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/40 opacity-70" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gold text-ink flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 fill-current translate-x-1" />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-ink/90 backdrop-blur-md px-3 py-1 border border-line text-xs text-stone">
              Click to initiate broadcast
            </div>
          </div>
        )}
      </div>

      {/* Title & Platform Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
            {video.title}
          </h2>
          <p className="text-stone text-xs font-light">
            From the official digital archive of Vipul Mota.
          </p>
        </div>

        {video.url && (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-stone hover:text-gold transition-colors text-xs uppercase tracking-widest shrink-0"
          >
            <span>Watch on {video.platform === "youtube" ? "YouTube" : "Instagram"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
