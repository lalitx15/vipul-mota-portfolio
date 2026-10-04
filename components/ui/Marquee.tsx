"use client";

import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  items?: string[];
  children?: React.ReactNode;
  speed?: number; // duration in seconds
  reverse?: boolean;
  pauseOnHover?: boolean;
  separator?: string;
  className?: string;
}

export function Marquee({
  items,
  children,
  speed = 25,
  reverse = false,
  pauseOnHover = true,
  separator = "—",
  className,
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const content = items ? (
    <div className="flex items-center space-x-8 shrink-0">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-ivory/90 tracking-wide font-light uppercase select-none">
            {item}
          </span>
          <span className="text-gold/60 text-sm font-serif select-none">
            {separator}
          </span>
        </React.Fragment>
      ))}
    </div>
  ) : (
    <div className="flex items-center space-x-8 shrink-0">{children}</div>
  );

  if (isReducedMotion) {
    return (
      <div className={cn("overflow-x-auto py-4 border-y border-line", className)}>
        <div className="flex items-center space-x-8">{content}</div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      className={cn(
        "relative w-full overflow-hidden py-4 border-y border-line bg-charcoal/30 flex select-none",
        className
      )}
    >
      <m.div
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
        className="flex shrink-0 items-center space-x-8 min-w-full"
      >
        {content}
        {content}
        {content}
        {content}
      </m.div>
    </div>
  );
}
