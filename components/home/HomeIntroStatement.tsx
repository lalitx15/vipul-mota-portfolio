"use client";

import React, { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";

export function HomeIntroStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });

  const statement =
    "Style is not ornament; it is discipline made visible. From the high-stakes narrative tension of Crime World to bespoke Italian tailoring and private wealth syndication, I believe in building an unmistakable presence — one rooted in Bombay's timeless architectural ambition and the conviction to live king size.";

  const words = statement.split(" ");

  return (
    <section
      id="intro"
      ref={containerRef}
      className="max-w-site mx-auto px-6 py-24 md:py-36 space-y-12"
    >
      <div className="flex items-center space-x-4 border-b border-line pb-6">
        <span className="editorial-label text-gold">02 / The Philosophy</span>
        <span className="text-stone">/</span>
        <span className="editorial-label text-stone">A Confident Presence</span>
      </div>

      <div className="max-w-4xl">
        <p className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light leading-[1.25] tracking-tight flex flex-wrap">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <WordHighlight
                key={i}
                word={word}
                range={[start, end]}
                progress={scrollYProgress}
              />
            );
          })}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-8 border-t border-line/60 gap-4 text-xs text-stone">
        <span className="editorial-label tracking-[0.2em] text-ivory">
          Vipul Mota
        </span>
        <span className="font-mono text-stone">
          Mumbai Heritage &middot; Born 29 August 1975
        </span>
      </div>
    </section>
  );
}

function WordHighlight({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: any;
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const color = useTransform(progress, range, ["#8A857C", "#F2EDE4"]);

  return (
    <span className="relative inline-block mr-[0.3em] pb-1">
      <m.span style={{ opacity, color }}>{word}</m.span>
    </span>
  );
}
