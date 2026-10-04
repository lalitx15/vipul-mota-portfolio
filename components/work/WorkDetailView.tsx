"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bookmark, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { WorkItem } from "@/lib/supabase/work";

interface WorkDetailViewProps {
  item: WorkItem;
  relatedItems: WorkItem[];
}

export function WorkDetailView({ item, relatedItems }: WorkDetailViewProps) {
  const { success, info } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const metaObj = (item.meta as Record<string, unknown>) || {};

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      success(
        `"${item.title}" has been saved to your Member Collection.`,
        "Saved to Archive"
      );
    } else {
      info(
        `"${item.title}" removed from your Member Collection.`,
        "Removed from Archive"
      );
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      success("Case study link copied to clipboard.", "Link Copied");
    }
  };

  const typeLabelMap = {
    acting: "Cinema & Screen Acting",
    modeling: "Sartorial Modeling Lookbook",
    venture: "Commercial Enterprise & Wealth",
  };

  return (
    <div className="min-h-screen bg-ink text-ivory pb-28">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-line bg-charcoal/50 sticky top-16 z-20 backdrop-blur-md px-6 py-4">
        <div className="max-w-site mx-auto flex items-center justify-between">
          <Link
            href="/work"
            className="flex items-center space-x-2 text-stone hover:text-gold transition-colors text-xs uppercase tracking-widest font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Work Directory</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-2 border border-line text-stone hover:text-ivory transition-colors text-xs flex items-center space-x-1.5"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`py-1.5 px-3 border transition-colors text-xs flex items-center space-x-1.5 ${
                isSaved
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line text-stone hover:text-gold"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save to Collection</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-site mx-auto px-6 pt-12 md:pt-20 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center space-x-3">
            <span className="editorial-label text-gold">
              {typeLabelMap[item.type]}
            </span>
            <span className="text-stone">/</span>
            <span className="editorial-label text-stone">{item.year || "2026"}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-ivory tracking-tight leading-[1.05]">
            {item.title}
          </h1>

          {item.role && (
            <p className="text-base sm:text-lg text-gold font-light tracking-wide">
              Role &middot; Designation: <span className="text-ivory font-serif italic">{item.role}</span>
            </p>
          )}
        </div>

        {/* Hero Cinematic Cover Still */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal border border-line">
          <Image
            src={item.cover_url}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

          {/* Still caption badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-ink/90 backdrop-blur-md border border-line p-3 text-xs flex items-center space-x-3">
            <span className="editorial-label text-gold">Production Archive Still</span>
            <span className="text-stone font-mono">{item.platform || "Mumbai Archive"}</span>
          </div>
        </div>

        {/* 2-Column Detail Narrative & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Comprehensive Case Narrative */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="editorial-label text-stone tracking-widest block">
                01 / Portfolio Case Examination
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
                Overview &amp; Context
              </h2>
            </div>

            <div className="text-stone text-base md:text-lg font-light leading-relaxed space-y-6">
              <p>{item.description}</p>
              {item.type === "acting" && (
                <p>
                  In <em>Crime World</em> (2022), the narrative relies on quiet tension and calculated pacing rather than exaggerated melodrama. Portraying the pivotal Neighbour in Episode 2-12, Vipul Mota demonstrates screen control, delivering lines with cold composure that anchors the episodic mystery. Streaming nationally on ShemarooMe.
                </p>
              )}
              {item.type === "venture" && (
                <p>
                  Javi Groups operates under the philosophy that true wealth requires both strategic capital discipline and an elevated lifestyle presence. Vipul Mota leads private syndication initiatives and strategic consultations, linking high-net-worth investors across Western India with curated business expansion opportunities.
                </p>
              )}
              {item.type === "modeling" && (
                <p>
                  Volume I of the Mumbai Sartorial Lookbook focuses on architectural lines, structured double-breasted blazers, and lightweight Italian wools set against the monumental backdrops of South Bombay. The lookbook serves as an open visual repertoire for high-fashion houses, bespoke ateliers, and horology brands seeking an authentic mature editorial look.
                </p>
              )}
            </div>

            {/* External Platform Direct Access */}
            {item.external_url && (
              <div className="pt-6 border-t border-line/60">
                <a
                  href={item.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 py-3.5 px-6 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all"
                >
                  <span>
                    {item.type === "acting"
                      ? "Stream Crime World on ShemarooMe"
                      : item.type === "venture"
                      ? "Access Javi Groups Digital Channel"
                      : "View Direct Source"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Project Specifications Table */}
          <div className="lg:col-span-4 bg-charcoal border border-line p-8 space-y-6">
            <h3 className="editorial-label text-gold border-b border-line pb-4">
              Archive Parameters &amp; Specifications
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col space-y-1 pb-3 border-b border-line/40">
                <span className="text-stone">Discipline Type</span>
                <span className="text-ivory font-medium uppercase tracking-wider">
                  {item.type}
                </span>
              </div>

              {item.role && (
                <div className="flex flex-col space-y-1 pb-3 border-b border-line/40">
                  <span className="text-stone">Role / Title</span>
                  <span className="text-ivory font-medium">{item.role}</span>
                </div>
              )}

              {item.year && (
                <div className="flex flex-col space-y-1 pb-3 border-b border-line/40">
                  <span className="text-stone">Timeline Year</span>
                  <span className="text-ivory font-mono">{item.year}</span>
                </div>
              )}

              {item.platform && (
                <div className="flex flex-col space-y-1 pb-3 border-b border-line/40">
                  <span className="text-stone">Platform / Network</span>
                  <span className="text-ivory font-medium">{item.platform}</span>
                </div>
              )}

              {Object.entries(metaObj).map(([key, val]) => (
                <div
                  key={key}
                  className="flex flex-col space-y-1 pb-3 border-b border-line/40 capitalize"
                >
                  <span className="text-stone">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-ivory font-light">{String(val)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/contact" className="w-full block">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                  Initiate Project Enquiry &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Projects / Next Navigation */}
        {relatedItems.length > 0 && (
          <section className="pt-16 border-t border-line space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="editorial-label text-gold">Further Works</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light mt-1">
                  Additional Archive Entries
                </h3>
              </div>
              <Link
                href="/work"
                className="text-stone hover:text-ivory transition-colors text-xs uppercase tracking-widest"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedItems.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/work/${rel.slug}`}
                  className="group bg-charcoal border border-line p-6 flex flex-col justify-between hover:border-gold/60 transition-colors space-y-4"
                >
                  <div className="space-y-2">
                    <span className="editorial-label text-gold text-[10px]">
                      {typeLabelMap[rel.type]}
                    </span>
                    <h4 className="font-serif text-2xl text-ivory font-light group-hover:text-gold transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-stone text-xs line-clamp-2 font-light">
                      {rel.description}
                    </p>
                  </div>
                  <span className="text-stone group-hover:text-ivory transition-colors text-xs flex items-center space-x-1 font-mono">
                    <span>Inspect Entry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
