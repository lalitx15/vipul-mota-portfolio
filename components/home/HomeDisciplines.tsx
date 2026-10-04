"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import BlurText from "@/components/ui/BlurText";
import { Button } from "@/components/ui/Button";

interface DisciplineItem {
  number: string;
  badge: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  ctaText: string;
}

const disciplines: DisciplineItem[] = [
  {
    number: "01",
    badge: "ON-SCREEN CRAFT",
    title: "Acting & Cinema",
    description:
      'Featured in the Hindi crime thriller episodic drama "Crime World" (2022) as Neighbour in Episode 2-12, streaming on ShemarooMe.',
    href: "/work",
    imageUrl: "/library/discipline-01.jpg",
    ctaText: "Examine Screen Credit",
  },
  {
    number: "02",
    badge: "SARTORIAL LOOKBOOK",
    title: "Fashion Modeling",
    description:
      "Personal lookbook combining sharp Italian bespoke silhouette cuts, Marine Drive twilight palette, and aspirational luxury imagery.",
    href: "/gallery",
    imageUrl: "/library/discipline-02.jpg",
    ctaText: "View Lookbook Plates",
  },
  {
    number: "03",
    badge: "PRIVATE VENTURES",
    title: "Javi Groups & Wealth",
    description:
      "Strategic corporate advisory, high-value capital syndication, and wealth inspiration for a network of 1 Million+ followers.",
    href: "/work",
    imageUrl: "/library/discipline-03.jpg",
    ctaText: "Explore Javi Groups",
  },
];

export function HomeDisciplines() {
  return (
    <section className="relative w-full py-24 md:py-36 bg-black text-ivory overflow-hidden border-y border-neutral-900 selection:bg-gold selection:text-ink">

      <div className="max-w-site mx-auto px-6 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6 backdrop-blur-xs">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 py-1 px-3.5 border border-gold/40 bg-navy-surface/90 text-gold text-[10px] uppercase font-mono tracking-widest rounded-full backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-gold shrink-0" />
              <BlurText
                text="03 / The Special Disciplines"
                delay={60}
                animateBy="words"
                direction="top"
                className="inline-flex"
                as="span"
              />
            </div>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight flex flex-wrap items-baseline gap-x-3">
              <BlurText
                text="One Name."
                delay={120}
                animateBy="words"
                direction="top"
                className="inline-flex"
                as="span"
              />
              <span className="italic text-gold inline-flex">
                <BlurText
                  text="Many Worlds."
                  delay={120}
                  animateBy="words"
                  direction="top"
                  className="inline-flex italic text-gold"
                  as="span"
                />
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
            <BlurText
              text="The multi-dimensional universe defining Vipul Mota: screen storytelling, bespoke fashion modeling, and private wealth stewardship."
              delay={50}
              animateBy="words"
              direction="top"
              className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed"
              as="p"
            />
            <Link href="/about">
              <Button variant="outline" size="md" className="border-gold/50 text-gold hover:bg-gold hover:text-black transition-all">
                Biography &rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* The 3 Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {disciplines.map((item, idx) => (
            <m.div
              key={item.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="group relative rounded-3xl bg-navy-surface/90 backdrop-blur-md border border-white/10 overflow-hidden flex flex-col justify-between shadow-2xl hover:border-gold/60 transition-all duration-500"
            >
              {/* Card Image Header */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-surface via-navy-surface/40 to-transparent" />

                {/* Number Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-xs font-mono tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-gold font-medium">
                    {item.number}
                  </span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <BlurText
                    text={item.badge}
                    delay={70}
                    animateBy="words"
                    direction="top"
                    className="text-[10px] font-mono tracking-widest text-gold uppercase block w-full"
                    as="div"
                  />
                  <BlurText
                    text={item.title}
                    delay={90}
                    animateBy="words"
                    direction="top"
                    className="font-display text-2xl font-light text-white group-hover:text-gold transition-colors block w-full"
                    as="h3"
                  />
                  <BlurText
                    text={item.description}
                    delay={45}
                    animateBy="words"
                    direction="top"
                    className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed block w-full"
                    as="p"
                  />
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link
                    href={item.href}
                    className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gold hover:text-white transition-colors group/link"
                  >
                    <BlurText
                      text={item.ctaText}
                      delay={60}
                      animateBy="words"
                      direction="top"
                      className="inline-flex"
                      as="span"
                    />
                    <ArrowUpRight className="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                  </Link>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeDisciplines;

