"use client";

import React, { useState } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { Play, Lock, Bookmark, Check, ArrowUpRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { VideoItem } from "@/lib/supabase/videos";

interface VideosGridProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  activeVideoId?: string;
}

export function VideosGrid({
  videos,
  onSelectVideo,
  activeVideoId,
}: VideosGridProps) {
  const { success, info } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Dispatches");
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const categories = [
    "All Dispatches",
    ...Array.from(new Set(videos.map((v) => v.category))),
  ];

  const filteredVideos =
    selectedCategory === "All Dispatches"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  const handleToggleSave = (e: React.MouseEvent, video: VideoItem) => {
    e.stopPropagation();
    const isSaved = !!savedIds[video.id];
    setSavedIds((prev) => ({ ...prev, [video.id]: !isSaved }));

    if (!isSaved) {
      success(`"${video.title}" saved to your Member Collection.`, "Video Saved");
    } else {
      info("Video removed from your Member Collection.", "Video Removed");
    }
  };

  return (
    <section className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-line pb-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count =
            cat === "All Dispatches"
              ? videos.length
              : videos.filter((v) => v.category === cat).length;

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

      {/* Videos Grid */}
      <m.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, index) => {
            const isSaved = !!savedIds[video.id];
            const isCurrent = video.id === activeVideoId;

            return (
              <m.article
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="play"
                onClick={() => onSelectVideo(video)}
                className={`group relative bg-charcoal border cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-500 ${
                  isCurrent
                    ? "border-gold ring-1 ring-gold/40"
                    : "border-line hover:border-gold/60"
                }`}
              >
                {/* Media Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-ink">
                  <Image
                    src={
                      video.thumbnail_url ||
                      "/library/vipul-01.jpg"
                    }
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30 opacity-70" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="editorial-label text-[10px] text-ivory bg-ink/90 backdrop-blur-sm border border-line px-2 py-0.5">
                      {video.category}
                    </span>

                    <div className="flex items-center space-x-2">
                      {video.members_only && (
                        <span className="p-1 bg-ink/90 backdrop-blur-sm border border-gold text-gold" title="Members Only">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}

                      <button
                        onClick={(e) => handleToggleSave(e, video)}
                        aria-label="Save Video to Collection"
                        className={`p-1.5 backdrop-blur-sm border transition-colors ${
                          isSaved
                            ? "bg-gold text-ink border-gold"
                            : "bg-ink/80 text-stone hover:text-gold border-line"
                        }`}
                      >
                        {isSaved ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Bookmark className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] text-stone font-mono">
                      <span className="editorial-label text-gold">
                        Clip {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>&middot;</span>
                      <span className="uppercase">{video.platform}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-ivory font-light group-hover:text-gold transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-line/50 flex items-center justify-between text-xs text-stone">
                    <span className="font-mono text-[10px] uppercase">
                      {isCurrent ? "Currently Playing" : "Click to Play"}
                    </span>
                    {video.url && (
                      <span className="flex items-center space-x-1 group-hover:text-ivory transition-colors">
                        <span>External Source</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </m.article>
            );
          })}
        </AnimatePresence>
      </m.div>
    </section>
  );
}
