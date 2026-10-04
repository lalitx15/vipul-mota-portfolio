"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export function ThemeToggle({ className = "", showLabels = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-line bg-charcoal/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`group relative inline-flex items-center gap-2 p-2 rounded-full border border-line bg-charcoal/70 hover:bg-charcoal text-ivory hover:text-gold transition-all duration-300 shadow-sm backdrop-blur-md cursor-pointer ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>

      {showLabels && (
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone group-hover:text-ivory pr-1">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
