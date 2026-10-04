"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { m, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";


interface NavItem {
  number: string;
  label: string;
  href: string;
  previewImage: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    number: "01",
    label: "About & Heritage",
    href: "/about",
    previewImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    description: "Born Mumbai 1975. Actor, fashion model, private wealth stewardship.",
  },
  {
    number: "02",
    label: "Selected Work",
    href: "/work",
    previewImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    description: 'Crime World (2022) on ShemarooMe, Lookbook Vol. I & Javi Groups.',
  },
  {
    number: "03",
    label: "Gallery / Lookbook",
    href: "/gallery",
    previewImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    description: "High-contrast portraits, Italian tailoring, and Marine Drive twilight.",
  },
  {
    number: "04",
    label: "Video Reels",
    href: "/videos",
    previewImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    description: "On-screen character episodes, lifestyle reels, and YouTube mission.",
  },
  {
    number: "05",
    label: "Journal",
    href: "/journal",
    previewImage:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    description: "Dispatches on style, luxury presence, and financial discipline.",
  },
  {
    number: "06",
    label: "Contact & Booking",
    href: "/contact",
    previewImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    description: "Screen casting inquiries, brand partnerships, and private syndication.",
  },
];

export function Header() {
  const pathname = usePathname();
  const { user, profile, isAdmin } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePreview, setActivePreview] = useState<NavItem>(navItems[0]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const diff = latest - prev;

    if (latest > 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    if (diff > 8 && latest > 120 && !menuOpen) {
      setHidden(true);
    } else if (diff < -6 || latest < 100) {
      setHidden(false);
    }
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Main Sticky Header */}
      <m.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-colors duration-300",
          scrolled
            ? "bg-ink/85 backdrop-blur-md border-b border-line shadow-lg"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-site mx-auto px-2.5 sm:px-6 h-14 sm:h-20 md:h-24 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-1.5 sm:space-x-2.5 text-ivory hover:text-gold transition-colors shrink-0 pr-1"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gold/40 shadow-md group-hover:scale-105 transition-transform shrink-0 bg-black">
              <Image
                src="/logo.png"
                alt="Vipul Mota Logo"
                fill
                sizes="(max-width: 640px) 32px, 40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden lg:flex flex-col border-l border-line pl-3">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-ivory">
                Vipul Mota
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone">
                Javi Groups &middot; Mumbai
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "editorial-label text-xs tracking-[0.18em] transition-colors relative py-1",
                    isActive
                      ? "text-gold"
                      : "text-stone hover:text-ivory"
                  )}
                >
                  {item.label.split(" ")[0]}
                  {isActive && (
                    <m.span
                      layoutId="header-active-line"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Single-Row Navigation: Micro Luxury Style [About] [Selected] [Gallery] [Video] [Journal] */}
          <nav className="flex md:hidden items-center justify-center space-x-1.5 min-[360px]:space-x-2 min-[390px]:space-x-2.5 px-1 py-0.5 mx-auto">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "editorial-label text-[7.5px] min-[360px]:text-[8px] min-[390px]:text-[9px] tracking-[0.08em] min-[390px]:tracking-[0.1em] uppercase transition-colors shrink-0 relative py-0.5",
                    isActive
                      ? "text-gold font-bold"
                      : "text-neutral-400 hover:text-ivory font-medium"
                  )}
                >
                  {item.label.split(" ")[0]}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster: Mobile & Desktop 3-Lines Menu Trigger */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">

            {/* Mobile App Style Menu Trigger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              className="group flex items-center space-x-1 sm:space-x-1.5 py-1 sm:py-1.5 px-2 min-[360px]:px-2.5 sm:px-3 border border-line bg-charcoal/60 hover:border-gold/50 transition-colors rounded-full"
            >
              <span className="editorial-label text-stone group-hover:text-gold transition-colors text-[9px] min-[360px]:text-[10px] sm:text-xs uppercase tracking-wider">
                {menuOpen ? "Close" : "Menu"}
              </span>
              <span className="flex flex-col space-y-0.5 sm:space-y-1 w-3 sm:w-3.5">
                <span
                  className={cn(
                    "h-[1.5px] bg-ivory transition-transform duration-300",
                    menuOpen && "rotate-45 translate-y-[3px] sm:translate-y-[4px]"
                  )}
                />
                <span
                  className={cn(
                    "h-[1.5px] bg-ivory transition-opacity duration-300",
                    menuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "h-[1.5px] bg-ivory transition-transform duration-300",
                    menuOpen && "-rotate-45 -translate-y-[3px] sm:-translate-y-[4px]"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </m.header>

      {/* Fullscreen Editorial Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-ink flex flex-col justify-between overflow-hidden"
          >
            {/* Overlay Header Bar */}
            <div className="max-w-site mx-auto w-full px-6 h-20 md:h-24 flex items-center justify-between border-b border-line shrink-0">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-ivory hover:text-gold transition-colors group"
              >
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gold/40 shadow-md group-hover:scale-105 transition-transform bg-black shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Vipul Mota Logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="font-serif text-xl tracking-wider text-ivory">
                  Vipul Mota
                </span>
              </Link>

              <span className="editorial-label text-gold hidden sm:inline-block">
                Archive Navigation &middot; 2026
              </span>

              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex items-center space-x-2 p-2 text-stone hover:text-ivory border border-transparent hover:border-line transition-colors"
              >
                <span className="editorial-label text-xs">Close [ESC]</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Center: Two Column Editorial Layout (Refined, Compact Proportion) */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center overflow-y-auto">
              {/* Left Column: Hover Preview Image (Desktop) - Scaled down */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-3">
                <div className="relative w-full max-w-[260px] mx-auto aspect-[3/4] bg-charcoal border border-line overflow-hidden shadow-xl">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={activePreview.href}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activePreview.previewImage}
                        alt={activePreview.label}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
                    </m.div>
                  </AnimatePresence>

                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-0.5">
                    <span className="editorial-label text-gold text-[10px]">
                      Plate {activePreview.number}
                    </span>
                    <p className="font-serif text-xs text-ivory/90 font-light italic line-clamp-2">
                      {activePreview.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Elegant Refined Serif Links (Half Size) */}
              <nav className="lg:col-span-7 flex flex-col justify-center space-y-1.5 sm:space-y-2">
                {navItems.map((item, idx) => (
                  <m.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 * idx,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() => setActivePreview(item)}
                    className="group"
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center space-x-3 sm:space-x-4 py-1.5 group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <span className="font-mono text-xs sm:text-xs text-gold/80 font-light tracking-wider">
                        {item.number}
                      </span>
                      <span className="font-serif text-lg sm:text-2xl lg:text-[28px] text-ivory group-hover:text-gold transition-colors font-light tracking-tight">
                        {item.label}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gold">
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                    </Link>
                  </m.div>
                ))}

                {/* User Membership & Account Access inside the 3-lines menu */}
                <div className="pt-4 mt-2 border-t border-line/60 flex flex-wrap items-center gap-3">
                  <span className="editorial-label text-stone text-[10px] uppercase tracking-[0.2em] block w-full sm:w-auto">
                    Account Access:
                  </span>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <Link
                        href={isAdmin ? "/admin" : "/member"}
                        onClick={closeMenu}
                        className="inline-flex items-center space-x-2 py-2 px-4 border border-gold/50 bg-charcoal/80 text-gold hover:bg-gold hover:text-ink text-xs uppercase tracking-[0.18em] transition-all rounded-full"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                        <span>{isAdmin ? "Admin Dashboard" : "Member Profile"}</span>
                      </Link>
                      <button
                        onClick={async () => {
                          closeMenu();
                          const { logoutAction } = await import("@/lib/supabase/actions");
                          await logoutAction();
                          window.location.reload();
                        }}
                        className="py-2 px-3 text-stone hover:text-red-400 text-xs uppercase tracking-[0.16em] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="py-2 px-5 bg-gold hover:bg-[#A38350] text-ink font-semibold text-xs uppercase tracking-[0.18em] transition-all rounded-full shadow-md"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={closeMenu}
                        className="py-2 px-5 border border-line hover:border-gold text-ivory hover:text-gold text-xs uppercase tracking-[0.18em] transition-all rounded-full bg-charcoal/40"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Bottom Meta Bar */}
            <div className="max-w-site mx-auto w-full px-6 py-6 border-t border-line text-xs text-stone flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center space-x-6">
                <span>connect@javigroups.com</span>
                <span className="text-line">&middot;</span>
                <span>Marine Drive, Mumbai</span>
              </div>

              <div className="flex items-center space-x-6">
                <a
                  href="https://instagram.com/javigroups"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  Instagram 1 Million+
                </a>
                <a
                  href="https://youtube.com/@VibewithVipulMota"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  YouTube
                </a>
                <a
                  href="https://facebook.com/javigroups"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
