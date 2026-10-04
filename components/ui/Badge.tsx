import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "stone" | "outline" | "active" | "subtle";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "outline",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    outline: "border border-line text-stone bg-charcoal/40",
    gold: "border border-gold/40 text-gold bg-gold/10",
    stone: "border border-line text-ivory bg-charcoal",
    active: "border border-gold text-ink bg-gold font-medium",
    subtle: "border border-transparent text-stone bg-ink/50",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 tracking-[0.18em]",
    md: "text-xs px-3 py-1 tracking-[0.18em]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center uppercase font-sans select-none whitespace-nowrap transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
