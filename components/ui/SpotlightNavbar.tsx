"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
}

export function SpotlightNavbar({
  items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Gallery", href: "/gallery" },
    { label: "Videos", href: "/videos" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
  className,
  onItemClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Sync activeIndex with current pathname
  useEffect(() => {
    if (!pathname) return;
    const idx = items.findIndex(
      (item) => item.href === pathname || (item.href !== "/" && pathname.startsWith(item.href))
    );
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [pathname, items]);

  // Refs for the "light" positions so we can animate them imperatively
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      // Direct update for immediate feedback (no spring for the mouse itself, feels snappier)
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      // When mouse leaves, spring the spotlight back to the active item
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  // Handle the "Ambience" (Active Item) Movement
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    onItemClick?.(item, index);
    if (item.href.startsWith("#")) {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(item.href);
    }
  };

  return (
    <div className={cn("relative flex justify-center", className)}>
      <nav
        ref={navRef}
        style={
          {
            "--spotlight-color": isDark
              ? "rgba(255, 255, 255, 0.18)"
              : "rgba(212, 175, 55, 0.22)",
            "--ambience-color": isDark ? "#ffffff" : "#d4af37",
          } as React.CSSProperties
        }
        className={cn(
          "spotlight-nav relative h-11 rounded-full transition-all duration-300 overflow-hidden",
          "bg-black/60 dark:bg-black/70 backdrop-blur-xl border border-white/10 dark:border-white/15",
          "shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
        )}
      >
        {/* Content */}
        <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
          {items.map((item, idx) => (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <Link
                href={item.href}
                data-index={idx}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item, idx);
                }}
                className={cn(
                  "px-3.5 py-1.5 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 rounded-full select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  // Active vs Inactive Text
                  activeIndex === idx
                    ? "text-gold font-semibold"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* LIGHTING LAYERS: We use CSS variables --spotlight-x and --ambience-x updated by JS */}

        {/* 1. The Moving Spotlight (Follows Mouse) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `
              radial-gradient(
                120px circle at var(--spotlight-x) 100%, 
                var(--spotlight-color, rgba(212,175,55,0.2)) 0%, 
                transparent 50%
              )
            `,
          }}
        />

        {/* 2. The Active State Ambience (Stays on Active) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-[2]"
          style={{
            background: `
              radial-gradient(
                60px circle at var(--ambience-x) 0%, 
                var(--ambience-color, #d4af37) 0%, 
                transparent 100%
              )
            `,
          }}
        />
      </nav>
    </div>
  );
}

export default SpotlightNavbar;
