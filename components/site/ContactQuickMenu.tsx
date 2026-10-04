"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Mail, ChevronDown, ArrowUpRight } from "lucide-react";

export function ContactQuickMenu({ triggerClassName }: { triggerClassName?: string } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Contact options"
        className={triggerClassName || "flex items-center space-x-2 py-1.5 px-3.5 border border-gold/50 bg-charcoal/80 hover:border-gold hover:bg-gold/10 text-gold rounded-full transition-all duration-300 shadow-sm cursor-pointer"}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
        </span>
        <span className="editorial-label text-[11px] tracking-[0.16em] uppercase font-medium">
          Contact
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-gold" : "text-stone"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 rounded-2xl bg-ink/95 backdrop-blur-2xl border border-gold/30 shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-3.5 z-50 overflow-hidden"
          >
            {/* Header info */}
            <div className="px-3 py-2 border-b border-white/10 mb-2">
              <span className="editorial-label text-[10px] text-gold tracking-widest uppercase block">
                Direct Communication
              </span>
              <p className="text-white text-xs font-serif font-light mt-0.5">
                Vipul Mota &middot; Javi Groups
              </p>
            </div>

            {/* Channels */}
            <div className="space-y-1.5">
              {/* Phone Call */}
              <a
                href="tel:+919321029306"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-gold/15 border border-white/5 hover:border-gold/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="editorial-label text-[10px] text-stone group-hover:text-gold block uppercase">
                      Call Direct
                    </span>
                    <span className="text-sm font-mono text-white font-medium">
                      +91 93210 29306
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone group-hover:text-gold transition-colors" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919321029306?text=Hello%20Vipul%20Mota%2C%20I%20would%20like%20to%20connect%20with%20you."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="editorial-label text-[10px] text-stone group-hover:text-emerald-400 block uppercase">
                      WhatsApp Chat
                    </span>
                    <span className="text-sm font-mono text-white font-medium">
                      +91 93210 29306
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:connect@javigroups.com"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-gold/15 border border-white/5 hover:border-gold/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="editorial-label text-[10px] text-stone group-hover:text-gold block uppercase">
                      Official Email
                    </span>
                    <span className="text-xs font-mono text-white font-medium break-all">
                      connect@javigroups.com
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone group-hover:text-gold transition-colors" />
              </a>
            </div>

            {/* Bottom link to full booking form */}
            <div className="mt-2.5 pt-2.5 border-t border-white/10 text-center">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center space-x-1.5 text-xs text-gold hover:text-white font-mono uppercase tracking-wider transition-colors"
              >
                <span>Full Booking &amp; Casting Inquiries</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactQuickMenu;
