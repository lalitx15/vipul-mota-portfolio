"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Film, Instagram } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";

const TOTAL_FRAMES = 226;

const getFramePath = (index: number) => {
  const pad = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${pad}.jpg`;
};

interface HomeHeroProps {
  headlineLine1?: string;
  headlineLine2?: string;
  tagline?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HomeHero({
  headlineLine1 = "VIPUL",
  headlineLine2 = "MOTA",
  tagline = "Actor · Fashion Model · Founder of Javi Groups",
  ctaText = "Explore Archive",
  ctaLink = "/work",
}: HomeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef<number>(0);
  const lastRenderedIndex = useRef<number>(0);

  const [isLoaded, setIsLoaded] = useState(false);

  // Framer Motion scroll progress tracking across the sticky scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apple-grade smooth spring physics for scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });

  // Subtle opacity & transform on hero text as user scrolls through cinematic sequence
  const textOpacity = useTransform(smoothProgress, [0, 0.45, 0.75], [1, 0.85, 0.15]);
  const textY = useTransform(smoothProgress, [0, 0.75], [0, -40]);

  // Canvas draw helper with aspect-ratio cover
  const drawCover = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const cWidth = canvas.width;
      const cHeight = canvas.height;
      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;

      const scale = Math.max(cWidth / imgWidth, cHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const drawX = (cWidth - drawWidth) / 2;
      const drawY = (cHeight - drawHeight) / 2;

      ctx.clearRect(0, 0, cWidth, cHeight);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    },
    []
  );

  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const img = imagesRef.current[index];
      if (img && img.complete && img.naturalWidth > 0) {
        lastRenderedIndex.current = index;
        drawCover(ctx, canvas, img);
      } else {
        // Fallback to nearest loaded frame
        const fallback =
          imagesRef.current[lastRenderedIndex.current] || imagesRef.current[0];
        if (fallback && fallback.complete && fallback.naturalWidth > 0) {
          drawCover(ctx, canvas, fallback);
        }
      }
    },
    [drawCover]
  );

  // Resize canvas to match screen resolution and DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderFrame(currentIndexRef.current);
  }, [renderFrame]);

  // Preload frames progressively
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // Load Frame 0 immediately
    const firstImg = new window.Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      setIsLoaded(true);
      resizeCanvas();
      renderFrame(0);
    };

    // Load subsequent frames in prioritized batches
    let isCancelled = false;
    let nextIndex = 1;

    const loadNextBatch = () => {
      if (isCancelled || nextIndex >= TOTAL_FRAMES) return;
      const BATCH_SIZE = 12;
      for (let i = 0; i < BATCH_SIZE && nextIndex < TOTAL_FRAMES; i++, nextIndex++) {
        const img = new window.Image();
        img.src = getFramePath(nextIndex);
        images[nextIndex] = img;
      }

      if (nextIndex < TOTAL_FRAMES) {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 120 });
        } else {
          setTimeout(loadNextBatch, 20);
        }
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadNextBatch, { timeout: 250 });
    } else {
      setTimeout(loadNextBatch, 60);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas, renderFrame]);

  // Subscribe to smooth scroll spring to scrub frames with RAF throttle
  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;

    const unsubscribe = smoothProgress.on("change", (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      const targetIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(clamped * (TOTAL_FRAMES - 1))
      );

      if (targetIndex !== currentIndexRef.current) {
        currentIndexRef.current = targetIndex;
        if (!ticking) {
          ticking = true;
          rafId = requestAnimationFrame(() => {
            renderFrame(targetIndex);
            ticking = false;
          });
        }
      }
    });

    return () => {
      unsubscribe();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [smoothProgress, renderFrame]);

  const scrollToNext = () => {
    if (containerRef.current) {
      const nextY = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({ top: nextY - 80, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[280vh] bg-ink select-none"
    >
      {/* Sticky Fullscreen Cinematic Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between px-6 md:px-12 pt-24 md:pt-28 pb-8">
        {/* HTML5 Canvas Background with Apple-style Frame Scrubbing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700"
          style={{ opacity: isLoaded ? 1 : 0 }}
        />

        {/* Fallback image before canvas paints */}
        {!isLoaded && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 z-0 pointer-events-none"
            style={{ backgroundImage: `url(${getFramePath(0)})` }}
          />
        )}

        {/* Cinematic Vignette Overlays for High Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/50 to-transparent pointer-events-none z-[1]" />

        {/* Top-Left Hero Typography Block */}
        <m.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative z-10 max-w-site mx-auto w-full flex flex-col items-start text-left space-y-5 pt-2 md:pt-4 pb-6"
        >
          <div className="space-y-3">
            <p className="editorial-label text-stone tracking-[0.3em] uppercase text-xs md:text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold inline-block animate-pulse" />
              {tagline}
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.92] text-ivory">
              <span className="block overflow-hidden">
                <TextReveal as="span" delay={0.15} stagger={0.05}>
                  {headlineLine1}
                </TextReveal>
              </span>
              <span className="block overflow-hidden mt-1">
                <span className="italic font-normal text-gold inline-block">
                  {headlineLine2}
                </span>
              </span>
            </h1>
          </div>

          <p className="text-stone text-sm md:text-base leading-relaxed font-light max-w-xl text-left">
            A Mumbai presence at the confluence of Hindi cinematic storytelling, bespoke luxury tailoring, and high-value private wealth stewardship. Founder of Javi Groups.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href={ctaLink}>
              <Button variant="gold" size="lg">
                {ctaText} &rarr;
              </Button>
            </Link>
            <a
              href="https://instagram.com/javigroups"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Vipul Mota on Instagram"
              className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 border border-gold/60 bg-charcoal/60 hover:bg-gold text-gold hover:text-ink hover:border-gold transition-all duration-300 shadow-md group"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </m.div>

        {/* Bottom Bar: Coordinates + Scroll Down */}
        <div className="relative z-10 max-w-site mx-auto w-full flex items-center justify-between pt-4 border-t border-line/40 text-xs text-stone">
          <span className="editorial-label tracking-widest text-[11px]">
            Coordinates: 18.9438&deg; N, 72.8234&deg; E &middot; Marine Drive
          </span>

          <button
            onClick={scrollToNext}
            className="flex items-center space-x-2 text-stone hover:text-gold transition-colors cursor-pointer"
            aria-label="Scroll to explore"
          >
            <span className="editorial-label text-[10px]">Scroll to Explore</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
