"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, success, id, value, defaultValue, placeholder, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      Boolean(value || defaultValue)
    );

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(Boolean(e.target.value));
      if (onBlur) onBlur(e);
    };

    return (
      <div className="w-full space-y-1.5 group">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className={cn(
                "editorial-label text-stone block transition-colors duration-300",
                focused && "text-gold",
                error && "text-red-400"
              )}
            >
              {label}
            </label>
            {success && (
              <span className="text-emerald-400 text-[10px] tracking-wider uppercase inline-flex items-center space-x-1">
                <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Valid</span>
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "w-full px-4 py-3.5 bg-charcoal text-ivory text-sm placeholder:text-stone/40 font-sans transition-all duration-300 border border-line focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 disabled:opacity-40 disabled:cursor-not-allowed",
              error && "border-red-500/70 focus:border-red-500 focus:ring-red-500/20",
              success && "border-emerald-500/50",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs font-sans pt-0.5 tracking-wide flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
            <span>{error}</span>
          </p>
        )}

        {helperText && !error && (
          <p className="text-stone text-xs font-sans tracking-wide">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
