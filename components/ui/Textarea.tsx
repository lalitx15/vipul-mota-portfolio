"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, onFocus, onBlur, rows = 4, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 group">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "editorial-label text-stone block transition-colors duration-300",
              focused && "text-gold",
              error && "text-red-400"
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          className={cn(
            "w-full px-4 py-3.5 bg-charcoal text-ivory text-sm placeholder:text-stone/40 font-sans transition-all duration-300 border border-line focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 disabled:opacity-40 disabled:cursor-not-allowed resize-y",
            error && "border-red-500/70 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />

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

Textarea.displayName = "Textarea";
