"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Aspect ratio of the card, e.g. "3/4" for portraits or "1/1" for square. */
  aspectRatio?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Enable automatic medium-speed progression. */
  autoPlay?: boolean;
  /** Interval in ms between auto-scroll steps. */
  autoPlayInterval?: number;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
  onSelect?: (index: number) => void;
}

export interface CoverflowCarouselHandle {
  nudge: (by: number) => void;
  goTo: (index: number) => void;
}

export const CoverflowCarousel = React.forwardRef<
  CoverflowCarouselHandle,
  CoverflowCarouselProps
>(function CoverflowCarousel(
  {
    slides,
    rotate = 38,
    depth = 0.55,
    perspective = 3,
    falloff = 0.58,
    fade = 0.12,
    cardWidth = "clamp(200px, 24vw, 320px)",
    aspectRatio = "3/4",
    gap = 0.08,
    loop = true,
    showCaption = false,
    showPagination = false,
    showNavigation = false,
    autoPlay = true,
    autoPlayInterval = 2800,
    label = "Cover carousel",
    className,
    cardClassName,
    onSelect,
  },
  ref
) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const isHoveredRef = React.useRef(false);
  const isInteractingRef = React.useRef(false);

  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count]
  );

  // Paint straight to the DOM for 60fps performance
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 80) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      const newIndex = indexAt(target);
      setSelected(newIndex);
      if (onSelect) onSelect(newIndex);

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // Smooth exponential ease-out (faster response)
        posRef.current += remaining * 0.18;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, onSelect, paint]
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle]
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle]
  );

  // Expose nudge and goTo to parent components through ref
  React.useImperativeHandle(
    ref,
    () => ({
      nudge,
      goTo,
    }),
    [goTo, nudge]
  );

  // Medium speed Auto-Scroll
  React.useEffect(() => {
    if (!autoPlay || count <= 1) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current && !isInteractingRef.current && playingIndex === null) {
        nudge(1);
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, count, nudge, playingIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    isInteractingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) {
      setSelected(index);
      if (onSelect) onSelect(index);
    }
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    isInteractingRef.current = false;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{
        ["--cf-card" as string]: cardWidth,
        ["--cf-aspect" as string]: aspectRatio,
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: `calc(var(--cf-card) / (${aspectRatio}))`,
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                onClick={() => {
                  if (index !== selected) {
                    goTo(index);
                    if (playingIndex !== null) {
                      videoRefs.current[playingIndex]?.pause();
                      setPlayingIndex(null);
                    }
                  } else if (slide.videoUrl) {
                    const video = videoRefs.current[index];
                    if (video) {
                      if (playingIndex === index) {
                        video.pause();
                        setPlayingIndex(null);
                      } else {
                        video.muted = false;
                        video
                          .play()
                          .then(() => setPlayingIndex(index))
                          .catch(() => {
                            video.play();
                            setPlayingIndex(index);
                          });
                      }
                    }
                  }
                }}
                className={cn(
                  "absolute left-1/2 top-0 overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl border border-white/10 will-change-transform cursor-pointer transition-colors duration-300 group",
                  index === selected
                    ? "border-gold/80 shadow-[0_15px_35px_rgba(184,134,11,0.25)]"
                    : "hover:border-white/30",
                  cardClassName
                )}
                style={{
                  width: "var(--cf-card)",
                  aspectRatio: "var(--cf-aspect)",
                }}
              >
                {slide.videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={slide.videoUrl}
                      poster={slide.src}
                      preload="none"
                      playsInline
                      loop
                      muted={playingIndex !== index}
                      className="h-full w-full select-none object-cover object-center pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border border-gold/80 bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 shadow-xl",
                          playingIndex === index
                            ? "opacity-0 scale-90"
                            : "opacity-95 scale-100 group-hover:scale-110 group-hover:bg-gold group-hover:text-black"
                        )}
                      >
                        {playingIndex === index ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      draggable={false}
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full select-none object-cover object-center pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-4 top-1/2 z-[200] -translate-y-1/2 rounded-full border border-white/20 bg-neutral-900/80 p-3 text-white backdrop-blur-md transition hover:border-gold hover:text-gold cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-4 top-1/2 z-[200] -translate-y-1/2 rounded-full border border-white/20 bg-neutral-900/80 p-3 text-white backdrop-blur-md transition hover:border-gold hover:text-gold cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-4 flex flex-col items-center px-6 text-center duration-300 animate-in fade-in"
        >
          <p className="font-serif text-lg font-bold tracking-tight text-ivory">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-0.5 text-xs text-stone-400">
              {active.subtitle}
            </p>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === selected
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default CoverflowCarousel;
