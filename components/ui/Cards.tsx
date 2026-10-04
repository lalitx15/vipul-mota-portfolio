"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberCounter } from "./NumberCounter";

// ========================================================
// 1. EditorialCard (Work, Article, Feature)
// ========================================================
export interface EditorialCardProps {
  title: string;
  category?: string;
  subtitle?: string;
  imageUrl?: string;
  href?: string;
  aspectRatio?: "square" | "portrait" | "video" | "wide";
  index?: string;
  className?: string;
  featured?: boolean;
}

export function EditorialCard({
  title,
  category,
  subtitle,
  imageUrl,
  href,
  aspectRatio = "portrait",
  index,
  className,
  featured = false,
}: EditorialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  // Subtle 3D Tilt for featured cards on desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!featured || isReducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const aspectStyles = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    video: "aspect-video",
    wide: "aspect-[16/10]",
  };

  const cardContent = (
    <m.div
      ref={cardRef}
      data-cursor="view"
      style={{
        rotateX: featured && !isReducedMotion ? rotateX : 0,
        rotateY: featured && !isReducedMotion ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative block bg-charcoal border border-line transition-all duration-500 hover:border-gold/60 overflow-hidden cursor-pointer",
        className
      )}
    >
      {/* Image Container with duotone & scale */}
      {imageUrl && (
        <div className={cn("relative w-full overflow-hidden bg-ink/80", aspectStyles[aspectRatio])}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />

          {/* Top Plate/Index Label */}
          {index && (
            <div className="absolute top-4 left-4 z-10">
              <span className="editorial-label text-ivory/80 bg-ink/70 px-2 py-0.5 border border-line/60">
                {index}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content Meta */}
      <div className="p-6 sm:p-7 space-y-3">
        <div className="flex items-center justify-between">
          {category && (
            <span className="editorial-label text-stone group-hover:text-gold transition-colors duration-300">
              {category}
            </span>
          )}
          <span className="inline-flex text-stone group-hover:text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-ivory group-hover:text-gold transition-colors duration-300 leading-tight">
          {title}
        </h3>

        {subtitle && (
          <p className="text-stone text-xs sm:text-sm font-sans line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </m.div>
  );

  if (href) {
    return <Link href={href} className="block">{cardContent}</Link>;
  }

  return cardContent;
}

// ========================================================
// 2. DisciplineCard (Hero Split Cards: Cinema, Editorial, Ventures)
// ========================================================
export interface DisciplineCardProps {
  numeral: string;
  discipline: string;
  title: string;
  description: string;
  linkText?: string;
  href: string;
  imageUrl?: string;
  cursorLabel?: "view" | "play";
}

export function DisciplineCard({
  numeral,
  discipline,
  title,
  description,
  linkText = "Explore Discipline",
  href,
  imageUrl,
  cursorLabel = "view",
}: DisciplineCardProps) {
  return (
    <Link
      href={href}
      data-cursor={cursorLabel}
      className="group relative block bg-charcoal border border-line p-8 lg:p-10 transition-all duration-500 hover:border-gold/60 overflow-hidden"
    >
      {/* Background Image lift on hover */}
      {imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity duration-700">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[300px] space-y-8">
        {/* Top Header with Numeral */}
        <div className="flex items-start justify-between border-b border-line pb-6">
          <span className="font-serif text-4xl lg:text-5xl text-gold/80 font-light group-hover:text-gold transition-colors">
            {numeral}
          </span>
          <span className="editorial-label text-stone group-hover:text-ivory transition-colors">
            {discipline}
          </span>
        </div>

        {/* Middle Content */}
        <div className="space-y-3">
          <h3 className="font-serif text-3xl lg:text-4xl text-ivory font-light group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-stone text-sm leading-relaxed max-w-sm">
            {description}
          </p>
        </div>

        {/* Bottom Link Action */}
        <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.18em] text-stone group-hover:text-gold transition-colors pt-4 border-t border-line/60">
          <span>{linkText}</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

// ========================================================
// 3. StatCard (Follower counts, Years, Milestones)
// ========================================================
export interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  suffix = "+",
  prefix,
  description,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-charcoal border border-line p-8 space-y-4 hover:border-gold/40 transition-colors duration-500",
        className
      )}
    >
      <span className="editorial-label text-stone block">{label}</span>
      <div className="font-serif text-5xl lg:text-6xl text-ivory font-light">
        <NumberCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          className="text-gold"
        />
      </div>
      {description && (
        <p className="text-stone text-xs leading-relaxed font-sans pt-1">
          {description}
        </p>
      )}
    </div>
  );
}
