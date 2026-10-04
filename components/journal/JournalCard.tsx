"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Lock, Bookmark, Check, ArrowUpRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Post } from "@/lib/supabase/journal";

interface JournalCardProps {
  post: Post;
  index: number;
}

export function JournalCard({ post, index }: JournalCardProps) {
  const { success, info } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "2026 Archive";

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);

    if (!isSaved) {
      success(`"${post.title}" saved to your Member Collection.`, "Article Saved");
    } else {
      info("Article removed from your Member Collection.", "Article Removed");
    }
  };

  return (
    <article
      data-cursor="view"
      className="group relative bg-charcoal border border-line flex flex-col justify-between overflow-hidden hover:border-gold/60 transition-all duration-500"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        <Image
          src={
            post.cover_url ||
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
          }
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30 opacity-70" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex flex-wrap gap-1.5">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="editorial-label text-[9px] text-ivory bg-ink/90 backdrop-blur-sm border border-line px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {post.members_only && (
              <span
                className="p-1 bg-ink/90 backdrop-blur-sm border border-gold text-gold"
                title="Inner Circle Exclusive"
              >
                <Lock className="w-3 h-3" />
              </span>
            )}

            <button
              onClick={handleToggleSave}
              aria-label="Save Article to Collection"
              className={`p-1.5 backdrop-blur-sm border transition-colors ${
                isSaved
                  ? "bg-gold text-ink border-gold"
                  : "bg-ink/80 text-stone hover:text-gold border-line"
              }`}
            >
              {isSaved ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center space-x-3 text-[11px] text-stone">
            <span className="editorial-label text-gold">
              Dispatch {String(index + 1).padStart(2, "0")}
            </span>
            <span>&middot;</span>
            <div className="flex items-center space-x-1 font-mono">
              <Clock className="w-3 h-3" />
              <span>{post.reading_minutes || 4} min read</span>
            </div>
            <span>&middot;</span>
            <span className="font-mono">{formattedDate}</span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl text-ivory font-light group-hover:text-gold transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-stone text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs">
          <Link
            href={`/journal/${post.slug}`}
            className="text-ivory group-hover:text-gold transition-colors flex items-center space-x-1 uppercase tracking-widest font-medium"
          >
            <span>Read Full Dispatch</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {post.members_only && (
            <span className="editorial-label text-[10px] text-gold">
              Inner Circle
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
