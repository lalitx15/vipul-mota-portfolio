"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface FluidCursorTrailProps {
  className?: string;
  color?: string;
  particleCount?: number;
  particleSize?: number;
  velocity?: number;
  gravity?: number;
  fadeSpeed?: number;
  zIndex?: number;
  bound?: boolean;
}

export function FluidCursorTrail({
  className,
  color = "#B8860B",
  particleCount = 3,
  particleSize = 4,
  velocity = 4,
  gravity = 0.2,
  fadeSpeed = 0.02,
  zIndex = 9999,
  bound = false,
}: FluidCursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = bound ? containerRef.current : null;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      if (bound && container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      } else {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    let resizeObs: ResizeObserver | undefined;
    if (bound && container) {
      resizeObs = new ResizeObserver(resize);
      resizeObs.observe(container);
    }

    let isRunning = false;
    let raf: number | null = null;

    const animate = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: typeof particlesRef.current = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= fadeSpeed;
        p.vy += gravity;
        if (p.life > 0) {
          next.push(p);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x * dpr, p.y * dpr, particleSize * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      particlesRef.current = next;
      ctx.globalAlpha = 1;

      if (next.length > 0) {
        raf = requestAnimationFrame(animate);
      } else {
        isRunning = false;
        raf = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const startAnimate = () => {
      if (!isRunning) {
        isRunning = true;
        raf = requestAnimationFrame(animate);
      }
    };

    const handleMouse = (e: MouseEvent) => {
      let x: number;
      let y: number;
      if (bound && container) {
        const rect = container.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          return;
        }
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          life: 1,
          vx: (Math.random() - 0.5) * velocity,
          vy: (Math.random() - 0.5) * velocity,
          x,
          y,
        });
      }
      startAnimate();
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });

    return () => {
      resizeObs?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [bound, color, particleCount, particleSize, velocity, gravity, fadeSpeed]);

  const canvas = (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none",
        bound ? "absolute inset-0 size-full" : "fixed inset-0",
        !bound && className,
      )}
      style={{ pointerEvents: "none", zIndex }}
      title="Fluid cursor trail"
    >
      Decorative cursor trail
    </canvas>
  );

  if (bound) {
    return (
      <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
        {canvas}
      </div>
    );
  }

  return canvas;
}

export function FluidCursorTrailDemo() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-xl border border-gold/20 bg-neutral-950 text-neutral-100">
      <FluidCursorTrail bound color="#B8860B" particleCount={4} />
      <div className="pointer-events-none z-10 flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Move your cursor</h2>
        <p className="text-sm text-neutral-400">A fluid particle trail follows the pointer.</p>
      </div>
    </div>
  );
}

export default FluidCursorTrail;
