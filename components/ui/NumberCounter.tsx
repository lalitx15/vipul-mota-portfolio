"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NumberCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function NumberCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <span ref={ref} className={cn("inline-flex items-baseline font-serif", className)}>
      {prefix && <span>{prefix}</span>}
      <span>{displayValue.toLocaleString()}</span>
      {suffix && <span className="text-gold ml-0.5">{suffix}</span>}
    </span>
  );
}
