"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, CheckCircle2, Shield } from "lucide-react";
import type { ProfileRow } from "@/lib/supabase/user";
import { ThemeToggle } from "@/components/site/ThemeToggle";

interface AdminTopNavProps {
  profile: ProfileRow | null;
}

export function AdminTopNav({ profile }: AdminTopNavProps) {
  const pathname = usePathname();

  // Simple breadcrumb generator
  const segments = pathname.split("/").filter(Boolean);
  const currentTitle =
    segments.length <= 1
      ? "Executive Pulse & Telemetry"
      : segments[1].charAt(0).toUpperCase() + segments[1].slice(1);

  return (
    <header className="sticky top-0 z-20 bg-charcoal/80 backdrop-blur-md border-b border-line px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumb Path */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="editorial-label text-gold">Terminal</span>
          <span className="text-stone">/</span>
          <span className="editorial-label text-stone">{currentTitle}</span>
        </div>

        {/* Status Indicators & Public Site Shortcut */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="hidden sm:flex items-center space-x-2 border border-line px-3 py-1 bg-ink text-stone text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Postgres DB: Live</span>
          </div>

          <div className="flex items-center space-x-2 text-stone">
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span className="text-ivory font-medium text-xs">
              {profile?.full_name || "Vipul Mota"}
            </span>
          </div>

          <ThemeToggle />

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 px-3 border border-gold/40 text-gold hover:bg-gold hover:text-ink text-[10px] uppercase tracking-widest transition-all flex items-center space-x-1.5 rounded-full"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}
