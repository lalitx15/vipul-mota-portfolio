"use client";

import React from "react";
import type { ProfileRow } from "@/lib/supabase/member";

export type MemberTab = "overview" | "saved" | "enquiries" | "vault";

interface MemberHeaderProps {
  profile: ProfileRow | null;
  activeTab: MemberTab;
  onTabChange: (tab: MemberTab) => void;
  savedCount: number;
  enquiriesCount: number;
  exclusiveCount: number;
}

export function MemberHeader({
  profile,
  activeTab,
  onTabChange,
  savedCount,
  enquiriesCount,
  exclusiveCount,
}: MemberHeaderProps) {
  const tabs: { id: MemberTab; label: string; count?: number }[] = [
    { id: "overview", label: "Profile & Security" },
    { id: "saved", label: "My Collection", count: savedCount },
    { id: "enquiries", label: "Inquiries & Bookings", count: enquiriesCount },
    { id: "vault", label: "Inner Circle Vault", count: exclusiveCount },
  ];

  return (
    <div className="border-b border-line pb-8 space-y-6">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="editorial-label text-gold">Inner Circle Sanctuary</span>
          <span className="text-stone">/</span>
          <span className="editorial-label text-stone">Member Dossier</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="py-1 px-3 text-[10px] uppercase tracking-widest border border-gold/40 bg-gold/10 text-gold font-medium">
            Tier: {profile?.role === "admin" ? "Principal Admin" : "Inner Circle Member"}
          </span>
          <span className="py-1 px-2.5 text-[10px] uppercase tracking-widest border border-line bg-charcoal text-stone">
            {profile?.status === "active" ? "Active Status" : "Under Review"}
          </span>
        </div>
      </div>

      {/* Greeting Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-ivory">
          Welcome, {profile?.full_name || "Inner Circle Member"}
        </h1>
        <p className="text-stone text-xs sm:text-sm max-w-xl font-light leading-relaxed">
          Manage your executive profile details, review submitted booking inquiries, inspect saved lookbook plates, and access unreleased Inner Circle media dispatches.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 pt-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2.5 px-4 text-xs uppercase tracking-[0.16em] transition-all rounded-none ${
                isActive
                  ? "bg-gold text-ink font-semibold"
                  : "bg-charcoal text-stone hover:text-ivory hover:bg-charcoal/80 border border-line"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`ml-2 font-mono text-[10px] ${
                    isActive ? "text-ink/80" : "text-stone"
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
