"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "right",
      fullWidth = false,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Size styles
    const sizeStyles = {
      sm: "text-[11px] py-2 px-4 gap-2",
      md: "text-xs py-2.5 px-5 gap-2.5",
      lg: "text-xs sm:text-sm py-3 px-6 gap-3",
    };

    // Clean normal variant styles
    const variantStyles = {
      gold: "bg-gold text-ink font-semibold hover:bg-[#c49e2e] border border-gold shadow-sm",
      primary: "bg-gold text-ink font-semibold hover:bg-[#c49e2e] border border-gold shadow-sm",
      secondary: "bg-charcoal text-ivory border border-line hover:border-gold/60 hover:text-gold",
      outline: "border border-line bg-transparent text-ivory hover:border-gold hover:text-gold",
      ghost: "text-stone hover:text-ivory bg-transparent hover:bg-white/5",
    }[variant];

    const baseStyles =
      "relative inline-flex items-center justify-center font-sans tracking-[0.14em] font-medium uppercase rounded-full select-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-[0.98]";

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseStyles,
          variantStyles,
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="inline-flex shrink-0">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="inline-flex shrink-0">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
