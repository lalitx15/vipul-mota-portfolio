"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isFixed?: boolean;
}

const easeFunc = (t: number, easing: string): number => {
  switch (easing) {
    case "linear":
      return t;
    case "ease-in":
      return t * t;
    case "ease-in-out":
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case "ease-out":
    default:
      return 1 - Math.pow(1 - t, 3);
  }
};

export default function ClickSpark({
  sparkColor = "#ffffff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children,
  className = "",
  style,
  isFixed = false,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const isAnimatingRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  const animate = useCallback(
    (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        isAnimatingRef.current = false;
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        isAnimatingRef.current = false;
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const activeSparks: Spark[] = [];

      for (const spark of sparksRef.current) {
        const elapsed = currentTime - spark.startTime;
        if (elapsed < duration) {
          activeSparks.push(spark);

          const progress = elapsed / duration;
          const eased = easeFunc(progress, easing);

          const distance = sparkRadius * eased * extraScale;
          const lineLength = sparkSize * (1 - eased);

          const x1 = spark.x + distance * Math.cos(spark.angle);
          const y1 = spark.y + distance * Math.sin(spark.angle);
          const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
          const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = sparkColor;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.globalAlpha = Math.max(0, 1 - eased);

          // Subtle luminous glow for high visibility on both light and dark themes
          ctx.shadowColor =
            sparkColor.toLowerCase() === "#ffffff" || sparkColor.toLowerCase() === "#fff"
              ? "rgba(184, 134, 11, 0.75)"
              : sparkColor;
          ctx.shadowBlur = 4;

          ctx.stroke();
        }
      }

      ctx.restore();

      sparksRef.current = activeSparks;

      if (activeSparks.length > 0) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    [duration, easing, extraScale, sparkColor, sparkRadius, sparkSize]
  );

  const triggerSparkAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Ignore clicks outside the bounding box if not full-screen fixed
      if (!isFixed && (x < 0 || y < 0 || x > rect.width || y > rect.height)) {
        return;
      }

      const now = performance.now();
      const newSparks: Spark[] = [];

      for (let i = 0; i < sparkCount; i++) {
        const angle = (2 * Math.PI * i) / sparkCount;
        newSparks.push({
          x,
          y,
          angle,
          startTime: now,
        });
      }

      sparksRef.current.push(...newSparks);

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    },
    [animate, isFixed, sparkCount]
  );

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // If fixed, listen globally on window to catch all clicks anywhere
    if (isFixed) {
      const handleWindowClick = (e: MouseEvent) => {
        triggerSparkAt(e.clientX, e.clientY);
      };

      window.addEventListener("click", handleWindowClick, { capture: true });
      return () => {
        window.removeEventListener("resize", updateCanvasSize);
        window.removeEventListener("click", handleWindowClick, { capture: true });
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isFixed, triggerSparkAt, updateCanvasSize]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFixed) {
      triggerSparkAt(e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={containerRef}
      onClickCapture={handleContainerClick}
      className={`relative ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className={
          isFixed
            ? "pointer-events-none fixed inset-0 z-[99998] h-full w-full"
            : "pointer-events-none absolute inset-0 z-[50] h-full w-full"
        }
        style={{ pointerEvents: "none" }}
      />
      {children}
    </div>
  );
}
