import React from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/Cards";
import type { StatItem } from "@/lib/supabase/home";

interface HomeVenturesProps {
  stats: StatItem[];
}

export function HomeVentures({ stats }: HomeVenturesProps) {
  return (
    <section className="max-w-site mx-auto px-6 py-24 md:py-36 space-y-16">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-line pb-12 items-end">
        <div className="lg:col-span-7 space-y-3">
          <span className="editorial-label text-gold">05 / Commercial Enterprise</span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory">
            Javi Groups &amp; Private Equity
          </h2>
          <p className="font-serif text-xl sm:text-2xl text-stone italic font-light pt-2">
            &ldquo;Building a robust financial portfolio without compromising personal distinction.&rdquo;
          </p>
        </div>

        <div className="lg:col-span-5 space-y-4 text-stone text-xs sm:text-sm font-light leading-relaxed">
          <p>
            Founded by Vipul Mota, Javi Groups operates as a multi-disciplinary vehicle in Western India. Headquartered in Mumbai, the firm specializes in corporate business development, strategic private syndication, and luxury lifestyle investments.
          </p>
          <div className="pt-2">
            <Link
              href="/work"
              className="text-ivory hover:text-gold transition-colors underline underline-offset-4 text-xs uppercase tracking-widest inline-flex items-center space-x-2"
            >
              <span>Explore Javi Groups Venture</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Numerical Proof Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const numericValue = parseInt(stat.value, 10) || 0;
          return (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={numericValue}
              suffix={stat.suffix || "+"}
              description={stat.description || undefined}
            />
          );
        })}
      </div>

      {/* Finance Disclaimer Note */}
      <div className="p-4 border border-line bg-charcoal/40 text-stone text-xs text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="editorial-label text-stone/80 text-[10px]">
          Regulatory &amp; Ethics Notice
        </span>
        <span className="text-[11px] text-stone/70">
          Content is for inspiration and information only and is not financial advice.
        </span>
      </div>
    </section>
  );
}
