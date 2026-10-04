"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
  category?: string;
}

export interface LightboxProps {
  isOpen: boolean;
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentImage = images[currentIndex];

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    },
    [onClose, handleNext, handlePrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/95 backdrop-blur-xl"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="fixed top-6 right-6 z-50 p-2 text-stone hover:text-ivory border border-transparent hover:border-line transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Top Info Bar */}
          <div className="fixed top-6 left-6 z-50 flex items-center space-x-4">
            <span className="editorial-label text-gold">
              Plate {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            {currentImage.category && (
              <span className="editorial-label text-stone">
                &middot; {currentImage.category}
              </span>
            )}
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous Image"
                className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-charcoal/80 border border-line text-stone hover:text-ivory hover:border-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Image"
                className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-charcoal/80 border border-line text-stone hover:text-ivory hover:border-gold transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image & Caption Viewport */}
          <m.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-5xl max-h-[82vh] w-full flex flex-col items-center"
          >
            <div className="relative w-full h-[65vh] sm:h-[72vh] flex items-center justify-center">
              <Image
                src={currentImage.src}
                alt={currentImage.alt || currentImage.caption || "Gallery plate"}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            {/* Caption */}
            {currentImage.caption && (
              <div className="mt-4 text-center max-w-xl">
                <p className="font-serif text-lg text-ivory/90 font-light italic">
                  {currentImage.caption}
                </p>
              </div>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
