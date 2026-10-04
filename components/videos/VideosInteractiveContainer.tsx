"use client";

import React, { useState, useRef } from "react";
import { FeaturedVideoPlayer } from "./FeaturedVideoPlayer";
import { VideosGrid } from "./VideosGrid";
import type { VideoItem } from "@/lib/supabase/videos";

interface VideosInteractiveContainerProps {
  videos: VideoItem[];
}

export function VideosInteractiveContainer({
  videos,
}: VideosInteractiveContainerProps) {
  const initialFeatured = videos.find((v) => v.is_featured) || videos[0];
  const [activeVideo, setActiveVideo] = useState<VideoItem>(initialFeatured);
  const [startPlaying, setStartPlaying] = useState<boolean>(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleSelectVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setStartPlaying(true);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-16">
      {/* Primary Featured Player */}
      <div ref={playerRef}>
        {activeVideo && <FeaturedVideoPlayer video={activeVideo} startPlaying={startPlaying} />}
      </div>

      {/* Categorized Video Library Grid */}
      <VideosGrid
        videos={videos}
        onSelectVideo={handleSelectVideo}
        activeVideoId={activeVideo?.id}
      />
    </div>
  );
}
