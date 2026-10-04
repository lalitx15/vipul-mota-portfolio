"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowUpRight, Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { removeSavedItemAction, type EnrichedSavedItem } from "@/lib/supabase/member";

interface MemberSavedTabProps {
  initialItems: EnrichedSavedItem[];
}

export function MemberSavedTab({ initialItems }: MemberSavedTabProps) {
  const { success, error } = useToast();
  const [items, setItems] = useState<EnrichedSavedItem[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((i) => i.item_type === activeFilter);

  const handleRemove = async (id: string, title: string) => {
    setDeletingId(id);
    const res = await removeSavedItemAction(id);
    setDeletingId(null);

    if (res.error) {
      error(res.error, "Removal Failed");
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      success(`"${title}" removed from your Collection.`, "Item Removed");
    }
  };

  const filterTabs = [
    { id: "all", label: "All Items", count: items.length },
    {
      id: "gallery",
      label: "Lookbook Plates",
      count: items.filter((i) => i.item_type === "gallery").length,
    },
    {
      id: "video",
      label: "Motion Clips",
      count: items.filter((i) => i.item_type === "video").length,
    },
    {
      id: "post",
      label: "Journal Essays",
      count: items.filter((i) => i.item_type === "post").length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sub-Filters */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-4">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`py-2 px-3 text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-gold text-ink font-semibold"
                  : "bg-charcoal text-stone hover:text-ivory border border-line"
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 font-mono text-[10px]">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-charcoal border border-line flex flex-col justify-between overflow-hidden group hover:border-gold/60 transition-colors"
            >
              {item.cover_url && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
                  <Image
                    src={item.cover_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-ink/90 backdrop-blur-sm border border-line px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold">
                    {item.item_type}
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="editorial-label text-stone text-[10px]">
                    Saved {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <h3 className="font-serif text-lg text-ivory font-light group-hover:text-gold transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-line/50 flex items-center justify-between text-xs">
                  <Link
                    href={item.url}
                    className="text-ivory hover:text-gold flex items-center space-x-1 uppercase tracking-widest text-[11px]"
                  >
                    <span>Inspect Entry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleRemove(item.id, item.title)}
                    disabled={deletingId === item.id}
                    className="text-stone hover:text-red-400 p-1 transition-colors"
                    title="Remove from Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-charcoal border border-line p-16 text-center space-y-4">
          <Bookmark className="w-10 h-10 text-stone mx-auto" />
          <h3 className="font-serif text-2xl text-ivory font-light">
            Your Collection is Currently Empty
          </h3>
          <p className="text-stone text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed">
            Bookmark items across the portfolio to curate your personal archive of photography plates, screen clips, and editorial essays.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/gallery"
              className="py-2 px-4 border border-line text-xs uppercase tracking-widest hover:border-gold hover:text-gold text-stone transition-colors"
            >
              Explore Lookbook &rarr;
            </Link>
            <Link
              href="/journal"
              className="py-2 px-4 border border-line text-xs uppercase tracking-widest hover:border-gold hover:text-gold text-stone transition-colors"
            >
              Read Dispatches &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
