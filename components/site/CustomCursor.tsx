"use client";

import React, { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring for the outer ring
  const springX = useSpring(mouseX, { damping: 28, stiffness: 350 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Only enable on desktop with fine pointer and no reduced-motion preference
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      return;
    }

    setIsEnabled(true);
    document.body.classList.add("custom-cursor-enabled");

    let currentHovered = false;
    let currentText = "";
    let checkTimeout: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Throttled target check to avoid layout thrashing on every pixel
      if (checkTimeout === null) {
        checkTimeout = window.setTimeout(() => {
          checkTimeout = null;
          const target = e.target as HTMLElement | null;
          if (!target) return;

          const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
          const interactiveEl = target.closest("a, button, [role='button'], input, textarea, select");

          let nextText = "";
          let nextHovered = false;

          if (cursorEl) {
            nextText = cursorEl.getAttribute("data-cursor") || "";
            nextHovered = true;
          } else if (interactiveEl) {
            nextText = "";
            nextHovered = true;
          }

          if (nextHovered !== currentHovered) {
            currentHovered = nextHovered;
            setIsHovered(nextHovered);
          }
          if (nextText !== currentText) {
            currentText = nextText;
            setCursorText(nextText);
          }
        }, 32);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      if (checkTimeout !== null) clearTimeout(checkTimeout);
      document.body.classList.remove("custom-cursor-enabled");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Inner Dot */}
      <m.div
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-opacity duration-200"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isVisible ? (cursorText ? 0 : 1) : 0,
        }}
      />

      {/* Outer Ring / Label Bubble */}
      <m.div
        className="fixed left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-ink/40 backdrop-blur-[2px] transition-all duration-300"
        style={{
          x: springX,
          y: springY,
          width: cursorText ? 76 : isHovered ? 48 : 28,
          height: cursorText ? 76 : isHovered ? 48 : 28,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovered ? "rgba(184, 150, 95, 0.85)" : "rgba(184, 150, 95, 0.35)",
        }}
      >
        {cursorText && (
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ivory">
            {cursorText}
          </span>
        )}
      </m.div>
    </div>
  );
}
