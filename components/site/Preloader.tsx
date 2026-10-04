"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("vm_preloader_seen");
    if (seen) {
      setLoading(false);
      return;
    }

    const duration = 2200; // 2.2 seconds fancy luxury reveal
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          sessionStorage.setItem("vm_preloader_seen", "true");
        }, 250);
      }
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLoading(false);
        sessionStorage.setItem("vm_preloader_seen", "true");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSkip = () => {
    setLoading(false);
    sessionStorage.setItem("vm_preloader_seen", "true");
  };

  return (
    <AnimatePresence>
      {loading && (
        <m.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-black text-ivory flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
        >
          {/* Ambient Golden Luminescence */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-gold/15 via-gold/5 to-transparent blur-[100px] pointer-events-none rounded-full" />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="editorial-label text-neutral-400 tracking-[0.25em] text-[11px] uppercase">
              Vipul Mota &middot; Mumbai
            </span>
            <button
              onClick={handleSkip}
              className="editorial-label text-neutral-400 hover:text-gold transition-colors text-[11px] tracking-widest uppercase cursor-pointer"
            >
              Skip [ESC]
            </button>
          </div>

          {/* Center Fancy Luxury Emblem Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-8">
            {/* The Emblem Structure */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Outer Pulsing Geometry Ring */}
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-gold/30 border-dashed"
              />

              {/* Counter-rotating Inner Hex/Octagon Ring */}
              <m.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-gold/40"
              />

              {/* Decorative Compass Ticks */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="absolute top-0 w-1 h-2 bg-gold" />
                <span className="absolute bottom-0 w-1 h-2 bg-gold" />
                <span className="absolute left-0 h-1 w-2 bg-gold" />
                <span className="absolute right-0 h-1 w-2 bg-gold" />
              </div>

              {/* Luxury Circular Logo Center with Glow */}
              <m.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: [0.96, 1.03, 0.96], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gold/70 shadow-[0_0_50px_rgba(212,175,55,0.45)] bg-black"
              >
                <Image
                  src="/logo.png"
                  alt="Vipul Mota Luxury Emblem"
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-cover"
                  priority
                />
              </m.div>
            </div>

            {/* Typography Reveal */}
            <div className="text-center space-y-2">
              <m.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif text-2xl sm:text-3xl font-light tracking-[0.25em] text-white uppercase"
              >
                Vipul Mota
              </m.h1>
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="editorial-label text-gold text-[10px] sm:text-[11px] tracking-[0.3em] uppercase"
              >
                Cinema &middot; Sartorial &middot; Javi Groups
              </m.p>
            </div>

            {/* Fancy Golden Loading Progress Beam */}
            <div className="w-56 sm:w-72 space-y-3 pt-2">
              {/* Progress Line with Glowing Bead */}
              <div className="relative w-full h-[2px] bg-neutral-900 overflow-hidden rounded-full">
                <m.div
                  className="h-full bg-gradient-to-r from-transparent via-gold to-white relative"
                  style={{ width: `${progress}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
                </m.div>
              </div>

              {/* Percentage & Status Label */}
              <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-neutral-400">
                <span className="tracking-widest uppercase text-neutral-500">
                  Initializing Sanctuary
                </span>
                <span className="text-gold font-medium">
                  {String(progress).padStart(2, "0")}%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] sm:text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
            <span>Coordinates: 18.9438&deg; N, 72.8234&deg; E</span>
            <span>Marine Drive &middot; Mumbai</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
