"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { JournalCard } from "./JournalCard";
import type { Post } from "@/lib/supabase/journal";

interface JournalGridProps {
  posts: Post[];
}

export function JournalGrid({ posts }: JournalGridProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All Dispatches");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract all unique tags
  const allTags = [
    "All Dispatches",
    ...Array.from(new Set(posts.flatMap((p) => p.tags || []))),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesTag =
      selectedTag === "All Dispatches"
        ? true
        : post.tags?.includes(selectedTag);

    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  return (
    <section className="space-y-12">
      {/* Controls Bar: Tag Chips + Search Input */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            const count =
              tag === "All Dispatches"
                ? posts.length
                : posts.filter((p) => p.tags?.includes(tag)).length;

            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`py-2 px-3.5 text-xs uppercase tracking-[0.16em] transition-all rounded-none ${
                  isActive
                    ? "bg-black text-white font-semibold"
                    : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                <span>{tag}</span>
                <span
                  className={`ml-2 font-mono text-[10px] ${
                    isActive ? "text-gold" : "text-neutral-400"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search dispatches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 pl-10 pr-4 py-2.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <m.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <m.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <JournalCard post={post} index={index} />
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-24 border border-line bg-charcoal space-y-4">
          <p className="font-serif text-2xl text-stone italic">
            No dispatches match the specified filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedTag("All Dispatches");
              setSearchQuery("");
            }}
            className="text-xs uppercase tracking-widest text-gold hover:underline"
          >
            Clear Filters &amp; Search
          </button>
        </div>
      )}
    </section>
  );
}
