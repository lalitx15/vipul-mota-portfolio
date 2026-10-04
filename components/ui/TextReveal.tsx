"use client";

import React, { useRef } from "react";
import { m, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
}

export function TextReveal({
  children,
  as: Component = "h2",
  className,
  delay = 0,
  stagger = 0.04,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const words = children.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: "110%",
      opacity: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.6,
      },
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.8,
      },
    },
  };

  return (
    <div ref={ref} className="overflow-hidden">
      <m.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-wrap"
      >
        {words.map((word, idx) => (
          <span key={idx} className="overflow-hidden inline-block mr-[0.25em] pb-1">
            <m.span
              variants={wordVariants}
              className={cn("inline-block", className)}
            >
              {word}
            </m.span>
          </span>
        ))}
      </m.div>
    </div>
  );
}

export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <m.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
