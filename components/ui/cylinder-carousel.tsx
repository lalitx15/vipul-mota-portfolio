"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";

export interface CarouselImage {
  src: string;
  alt?: string;
  videoUrl?: string;
  id?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number; // in seconds
  cardWidth?: number; // in pixels
  aspectRatio?: string;
  onItemClick?: (item: CarouselImage, index: number) => void;
  playingId?: string | null;
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 32,
      cardWidth = 230,
      aspectRatio = "9/16",
      onItemClick,
      playingId,
      ...props
    },
    ref
  ) => {
    const N = images.length;
    const videoRefs = React.useRef<{ [key: string]: HTMLVideoElement | null }>({});

    // Compute CSS variables
    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    // Radius calculation in JS as solid fallback for tan()
    const angleRad = Math.PI / Math.max(N, 1);
    const radiusPx = (cardWidth / 2 + 8) / Math.tan(angleRad);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[520px] md:min-h-[580px] grid place-items-center overflow-hidden relative select-none py-8",
          className
        )}
        style={{
          perspective: "60em",
          maskImage: "linear-gradient(90deg, transparent, #000 12% 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12% 88%, transparent)",
        }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] motion-reduce:!animate-[ry_128s_linear_infinite] hover:[animation-play-state:paused]",
            playingId && "[animation-play-state:paused]",
            containerClassName
          )}
          style={{
            ...customStyle,
            animation: "ry var(--anim-dur) linear infinite",
          }}
        >
          {/* Keyframes inline definition */}
          <style>
            {`
              @keyframes ry {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(-360deg); }
              }
            `}
          </style>

          {images.map((img, i) => {
            const isPlaying = playingId && (playingId === img.id || playingId === String(i));
            const hasVideo = Boolean(img.videoUrl);

            return (
              <div
                key={img.id || i}
                onClick={() => {
                  if (onItemClick) {
                    onItemClick(img, i);
                  }
                }}
                className={cn(
                  "[grid-area:1/1] overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-700/60 shadow-2xl cursor-pointer will-change-transform group transition-all duration-300",
                  isPlaying
                    ? "border-gold shadow-[0_0_30px_rgba(184,134,11,0.5)] scale-105 z-30"
                    : "hover:border-gold/80 hover:shadow-xl",
                  cardClassName
                )}
                style={
                  {
                    width: "var(--w)",
                    aspectRatio: aspectRatio,
                    "--i": i,
                    transform: `rotateY(calc(var(--i) * var(--ba))) translateZ(${radiusPx}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  } as React.CSSProperties
                }
              >
                {hasVideo ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => {
                        const key = img.id || String(i);
                        videoRefs.current[key] = el;
                      }}
                      src={img.videoUrl}
                      poster={img.src}
                      playsInline
                      loop
                      muted={!isPlaying}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                    {/* Play / Pause button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border border-gold/80 bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 shadow-xl",
                          isPlaying
                            ? "opacity-0 scale-90 group-hover:opacity-100"
                            : "opacity-95 scale-100 group-hover:scale-110 group-hover:bg-gold group-hover:text-black"
                        )}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt={img.alt || `Carousel item ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";

export default CylinderCarousel;
