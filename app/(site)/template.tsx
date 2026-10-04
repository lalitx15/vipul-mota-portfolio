"use client";

import React, { useState, useEffect } from "react";
import { m } from "framer-motion";

export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <>
      {/* Editorial Curtain Enter Wipe (Top to Bottom) */}
      {!isReducedMotion && (
        <m.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-50 bg-charcoal origin-top pointer-events-none"
        />
      )}

      {/* Page Content Fade-Up */}
      <m.div
        initial={{ opacity: 0, y: isReducedMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isReducedMotion ? 0.2 : 0.65,
          delay: isReducedMotion ? 0 : 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-1"
      >
        {children}
      </m.div>
    </>
  );
}
