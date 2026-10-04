import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import type { PostItem } from "@/lib/supabase/home";

interface HomeJournalPreviewProps {
  posts: PostItem[];
}

export function HomeJournalPreview({ posts }: HomeJournalPreviewProps) {
  return (
    <section className="max-w-site mx-auto px-6 py-24 md:py-36 space-y-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
        <div className="space-y-2">
          <span className="editorial-label text-gold">08 / Thought Leadership</span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory">
            The Journal &amp; Dispatches
          </h2>
        </div>
        <p className="text-stone text-xs sm:text-sm max-w-md font-light leading-relaxed">
          Essays and private perspectives on screen discipline, bespoke sartorial codes, and private capital stewardship in modern Western India.
        </p>
      </div>

      {/* 3 Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            data-cursor="view"
            className="group bg-charcoal border border-line flex flex-col justify-between overflow-hidden hover:border-gold/60 transition-colors duration-500"
          >
            {/* Post Cover Image */}
            {post.cover_url && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
                <Image
                  src={post.cover_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                  {post.tags && post.tags[0] && (
                    <span className="editorial-label text-gold bg-ink/80 px-2 py-0.5 border border-line text-[10px]">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Post Details */}
            <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[11px] text-stone">
                  <span className="inline-flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gold" />
                    <span>{post.reading_minutes || 4} min read</span>
                  </span>
                  <span>&middot;</span>
                  <span>
                    {new Date(post.published_at || post.created_at).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-ivory group-hover:text-gold transition-colors duration-300 leading-snug">
                  {post.title}
                </h3>

                <p className="text-stone text-xs sm:text-sm font-light line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Read Action */}
              <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs">
                <span className="editorial-label text-stone">Dispatch</span>
                <Link
                  href={`/journal/${post.slug}`}
                  className="inline-flex items-center space-x-1.5 text-ivory group-hover:text-gold transition-colors uppercase tracking-[0.16em]"
                >
                  <span>Read Essay</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Archive Link */}
      <div className="flex items-center justify-between border-t border-line/60 pt-6 text-xs text-stone">
        <span>Inner Circle Members Enjoy Commenting &amp; Archival Bookmarks</span>
        <Link
          href="/journal"
          className="text-ivory hover:text-gold transition-colors underline underline-offset-4"
        >
          Read Complete Journal Archives &rarr;
        </Link>
      </div>
    </section>
  );
}
