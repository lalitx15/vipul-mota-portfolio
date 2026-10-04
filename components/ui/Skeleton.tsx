import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "image";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded-none",
    rectangular: "w-full rounded-none",
    image: "w-full aspect-[4/5] rounded-none",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-charcoal border border-line/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-ivory/5 before:to-transparent",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-charcoal p-6 border border-line space-y-4">
      <Skeleton variant="image" className="h-64" />
      <div className="space-y-2 pt-2">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-4/5 h-6" />
        <Skeleton variant="text" className="w-full h-3" />
        <Skeleton variant="text" className="w-2/3 h-3" />
      </div>
    </div>
  );
}
