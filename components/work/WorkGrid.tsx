"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { WorkCard } from "./WorkCard";
import type { WorkItem } from "@/lib/supabase/work";

interface WorkGridProps {
  items: WorkItem[];
}

type FilterType = "all" | "acting" | "modeling" | "venture";

interface FilterTab {
  id: FilterType;
  label: string;
  count: (items: WorkItem[]) => number;
}

const TABS: FilterTab[] = [
  { id: "all", label: "All Disciplines", count: (items) => items.length },
  {
    id: "acting",
    label: "Acting & Cinema",
    count: (items) => items.filter((i) => i.type === "acting").length,
  },
  {
    id: "modeling",
    label: "Sartorial Lookbook",
    count: (items) => items.filter((i) => i.type === "modeling").length,
  },
  {
    id: "venture",
    label: "Javi Groups & Ventures",
    count: (items) => items.filter((i) => i.type === "venture").length,
  },
];

export function WorkGrid({ items }: WorkGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.type === activeFilter);

  return (
    <section className="space-y-12">
      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-line pb-6">
        {TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          const count = tab.count(items);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`relative py-2.5 px-4 text-xs uppercase tracking-[0.16em] transition-all rounded-none ${
                isActive
                  ? "bg-black text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200 border border-neutral-200"
              }`}
            >
              <span>{tab.label}</span>
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

      {/* Grid of Work Items */}
      <m.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <m.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkCard item={item} index={index} />
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-24 border border-line bg-charcoal space-y-4">
          <p className="font-serif text-2xl text-stone italic">
            No active portfolio cases under this category.
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="text-xs uppercase tracking-widest text-gold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
