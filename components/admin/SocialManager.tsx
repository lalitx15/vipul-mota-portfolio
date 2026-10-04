"use client";

import React, { useState } from "react";
import {
  Share2,
  Instagram,
  Youtube,
  Facebook,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Sparkles,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { updateSocialSettingsAction } from "@/lib/supabase/admin-actions";

export interface SocialSettingsData {
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  threads_url: string;
  x_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;
  instagram_followers_count: string;
  youtube_subscribers_count: string;
}

interface SocialManagerProps {
  initialSettings: SocialSettingsData;
}

export function SocialManager({ initialSettings }: SocialManagerProps) {
  const { success, error } = useToast();

  const [form, setForm] = useState<SocialSettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateSocialSettingsAction(form);
    setIsSaving(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Social channels and audience reach metrics saved.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            Multi-Channel Footprint & Public Metrics
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Social Presence & Handles
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Manage your verified social profiles, follower audience metrics, and direct concierge links across the portfolio.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={isSaving}
          className="shrink-0 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving Footprint..." : "Save Social Settings"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Primary Channels: Instagram & YouTube */}
          <div className="p-6 bg-charcoal border border-line space-y-5">
            <div className="flex items-center gap-2 text-ivory font-serif text-lg border-b border-line pb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Primary Flagship Channels</span>
            </div>

            {/* Instagram Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram Profile URL *</span>
                </label>
                <input
                  type="url"
                  required
                  value={form.instagram_url}
                  onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/javigroups"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Follower Count *
                </label>
                <input
                  type="text"
                  required
                  value={form.instagram_followers_count}
                  onChange={(e) =>
                    setForm({ ...form, instagram_followers_count: e.target.value })
                  }
                  placeholder="1 Million+"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* YouTube Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>YouTube Channel URL *</span>
                </label>
                <input
                  type="url"
                  required
                  value={form.youtube_url}
                  onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/@VibewithVipulMota"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Subscriber Count *
                </label>
                <input
                  type="text"
                  required
                  value={form.youtube_subscribers_count}
                  onChange={(e) =>
                    setForm({ ...form, youtube_subscribers_count: e.target.value })
                  }
                  placeholder="100K+"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Secondary Social Handles */}
          <div className="p-6 bg-charcoal border border-line space-y-5">
            <div className="flex items-center gap-2 text-ivory font-serif text-lg border-b border-line pb-3">
              <Share2 className="w-4 h-4 text-gold" />
              <span>Syndication & Community Channels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Facebook Page URL *
                </label>
                <input
                  type="url"
                  required
                  value={form.facebook_url}
                  onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/javigroups"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Threads Profile URL *
                </label>
                <input
                  type="url"
                  required
                  value={form.threads_url}
                  onChange={(e) => setForm({ ...form, threads_url: e.target.value })}
                  placeholder="https://threads.net/@javigroups"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  X (formerly Twitter) URL
                </label>
                <input
                  type="url"
                  value={form.x_url || ""}
                  onChange={(e) => setForm({ ...form, x_url: e.target.value })}
                  placeholder="https://x.com/..."
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  LinkedIn Professional Profile
                </label>
                <input
                  type="url"
                  value={form.linkedin_url || ""}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Direct Concierge WhatsApp */}
          <div className="p-6 bg-charcoal border border-line space-y-4">
            <div className="flex items-center gap-2 text-ivory font-serif text-lg border-b border-line pb-3">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Concierge Link</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                WhatsApp Direct Link (e.g. https://wa.me/919820000000)
              </label>
              <input
                type="url"
                value={form.whatsapp_url || ""}
                onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
                placeholder="https://wa.me/919820000000"
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </form>

        {/* Live Audience Proof Preview */}
        <div className="space-y-6">
          <div className="p-6 bg-charcoal border border-line space-y-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-gold">
              Live Preview: Audience Reach Cards
            </div>

            <div className="space-y-3">
              {/* Instagram Card Preview */}
              <div className="p-4 bg-ink border border-line hover:border-pink-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-stone font-mono">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>@javigroups</span>
                  </div>
                  <a
                    href={form.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="font-display text-3xl text-ivory mt-2">
                  {form.instagram_followers_count}
                </div>
                <div className="text-[11px] text-stone mt-0.5">Verified Audience &amp; Looks</div>
              </div>

              {/* YouTube Card Preview */}
              <div className="p-4 bg-ink border border-line hover:border-red-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-stone font-mono">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>@VibewithVipulMota</span>
                  </div>
                  <a
                    href={form.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="font-display text-3xl text-ivory mt-2">
                  {form.youtube_subscribers_count}
                </div>
                <div className="text-[11px] text-stone mt-0.5">
                  Financial Strategy &amp; Discipline Mission
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-stone/80">
              * Updating these metrics synchronizes the home marquee counters, social proof section, and footer syndication links across the entire website.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
