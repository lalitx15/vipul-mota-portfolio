"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  // ESC key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
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

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative z-10 w-full bg-charcoal border border-line p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col",
              sizeClasses[size]
            )}
          >
            {/* Top Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between pb-6 border-b border-line shrink-0">
                <div className="space-y-1 pr-6">
                  {subtitle && (
                    <span className="editorial-label text-gold block">
                      {subtitle}
                    </span>
                  )}
                  {title && (
                    <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
                      {title}
                    </h3>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="p-1.5 text-stone hover:text-ivory border border-transparent hover:border-line transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pt-6 text-sm text-stone leading-relaxed">
              {children}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
