"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Unlock, Play, ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/supabase/journal";
import type { VideoItem } from "@/lib/supabase/videos";

interface MemberVaultTabProps {
  exclusivePosts: Post[];
  exclusiveVideos: VideoItem[];
}

export function MemberVaultTab({
  exclusivePosts,
  exclusiveVideos,
}: MemberVaultTabProps) {
  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center space-x-2 text-gold">
            <Unlock className="w-4 h-4" />
            <span className="editorial-label text-gold text-xs">Unlocked Privilege</span>
          </div>
          <h2 className="font-serif text-2xl text-ivory font-light mt-1">
            Inner Circle Media Vault
          </h2>
          <p className="text-stone text-xs pt-1">
            Proprietary dispatches, behind-the-scenes camera stills, and private equity briefings.
          </p>
        </div>

        <span className="editorial-label text-stone text-[10px] hidden sm:inline-block">
          Authenticated Member Access
        </span>
      </div>

      {/* Section 1: Exclusive Dispatches */}
      <div className="space-y-6">
        <h3 className="editorial-label text-stone">Exclusive Journal Dispatches</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exclusivePosts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group bg-charcoal border border-line p-6 flex flex-col justify-between hover:border-gold/60 transition-colors space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="editorial-label text-gold text-[10px]">
                    Vault Dispatch
                  </span>
                  <span className="text-stone font-mono text-[10px]">
                    {post.reading_minutes || 4} min read
                  </span>
                </div>

                <h4 className="font-serif text-2xl text-ivory font-light group-hover:text-gold transition-colors">
                  {post.title}
                </h4>

                <p className="text-stone text-xs font-light leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs">
                <span className="text-stone group-hover:text-ivory transition-colors uppercase tracking-widest text-[11px]">
                  Read Unlocked Dispatch
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section 2: Exclusive Videos & Briefings */}
      <div className="space-y-6 pt-6 border-t border-line">
        <h3 className="editorial-label text-stone">Exclusive Private Video Briefings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exclusiveVideos.map((video) => (
            <div
              key={video.id}
              className="bg-charcoal border border-line flex flex-col justify-between overflow-hidden group hover:border-gold/60 transition-colors"
            >
              {video.thumbnail_url && (
                <div className="relative aspect-video w-full overflow-hidden bg-ink">
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30 opacity-70" />

                  <div className="absolute top-3 left-3 bg-gold text-ink text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 flex items-center space-x-1">
                    <Unlock className="w-2.5 h-2.5" />
                    <span>Member Exclusive</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gold/90 text-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="editorial-label text-gold text-[10px]">
                    {video.category}
                  </span>
                  <h4 className="font-serif text-xl text-ivory font-light group-hover:text-gold transition-colors">
                    {video.title}
                  </h4>
                </div>

                <div className="pt-4 border-t border-line/50 flex items-center justify-between text-xs">
                  <Link
                    href="/videos"
                    className="text-ivory hover:text-gold uppercase tracking-widest text-[11px] flex items-center space-x-1"
                  >
                    <span>Stream in Cinema Player</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
