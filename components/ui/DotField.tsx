"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DotField({
  dotRadius = 1.5,
  dotSpacing = 22,
  bulgeStrength = 67,
  glowRadius = 150,
  sparkle = false,
  waveAmplitude = 0,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  gradientFrom = "#A855F7",
  gradientTo = "#B497CF",
  glowColor = "#120F17",
  className,
  style,
}: DotFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = false;
    let isRunning = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (isVisible) {
        drawFrame(performance.now());
      }
    };

    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovering: true,
      };
      if (isVisible && !isRunning) {
        startLoop();
      }
    };

    const onPointerLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, isHovering: false };
      // Draw settled frame once
      if (isVisible) {
        drawFrame(performance.now());
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    const startTime = performance.now();

    const drawFrame = (time: number) => {
      if (!ctx || width === 0 || height === 0) return;
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const mouse = mouseRef.current;

      // Draw subtle ambient glow behind the dots if glowRadius > 0
      if (glowRadius > 0 && mouse.isHovering) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        glowGrad.addColorStop(0, "rgba(168, 85, 247, 0.16)");
        glowGrad.addColorStop(0.5, "rgba(180, 151, 207, 0.08)");
        glowGrad.addColorStop(1, "transparent");

        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Linear gradient for dots
      const dotGrad = ctx.createLinearGradient(0, 0, width, height);
      dotGrad.addColorStop(0, gradientFrom);
      dotGrad.addColorStop(1, gradientTo);
      ctx.fillStyle = dotGrad;

      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const baseX = c * dotSpacing;
          const baseY = r * dotSpacing;

          let posX = baseX;
          let posY = baseY;
          let curRadius = dotRadius;
          let alpha = 0.55;

          // Wave effect if enabled
          if (waveAmplitude > 0) {
            posY += Math.sin(elapsed * 0.002 + baseX * 0.02) * waveAmplitude;
          }

          // Cursor interaction (bulge / push)
          if (mouse.isHovering) {
            const dx = baseX - mouse.x;
            const dy = baseY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < cursorRadius && dist > 0) {
              const factor = 1 - dist / cursorRadius;
              const push =
                Math.sin(factor * Math.PI) * bulgeStrength * (cursorForce || 1);

              const nx = dx / dist;
              const ny = dy / dist;

              posX = baseX + nx * push;
              posY = baseY + ny * push;

              curRadius = dotRadius * (1 + factor * 0.6);
              alpha = Math.min(1, 0.55 + factor * 0.45);
            }
          }

          // Sparkle shimmer if enabled
          if (sparkle) {
            alpha *= 0.7 + 0.3 * Math.sin(elapsed * 0.003 + (c + r) * 1.5);
          }

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(posX, posY, curRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };

    const loop = (time: number) => {
      if (!isVisible) {
        isRunning = false;
        return;
      }

      drawFrame(time);

      // If continuous animation is needed (waves, sparkles, or active hover), keep loop active
      if (waveAmplitude > 0 || sparkle || mouseRef.current.isHovering) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        isRunning = false;
        rafRef.current = null;
      }
    };

    const startLoop = () => {
      if (!isRunning && isVisible) {
        isRunning = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    // IntersectionObserver to only render when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          drawFrame(performance.now());
          if (waveAmplitude > 0 || sparkle) {
            startLoop();
          }
        } else {
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
          isRunning = false;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      resizeObs.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    dotRadius,
    dotSpacing,
    bulgeStrength,
    glowRadius,
    sparkle,
    waveAmplitude,
    cursorRadius,
    cursorForce,
    gradientFrom,
    gradientTo,
    glowColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full relative overflow-hidden pointer-events-auto", className)}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />
    </div>
  );
}

export default DotField;
