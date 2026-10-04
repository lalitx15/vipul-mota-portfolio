import React from "react";
import { ArrowUpRight } from "lucide-react";
import { NumberCounter } from "@/components/ui/NumberCounter";

export function HomeSocialProof() {
  return (
    <section className="max-w-site mx-auto px-6 py-20 md:py-28 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-6 gap-4">
        <div className="space-y-1">
          <span className="editorial-label text-gold">09 / Digital Authority</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
            Social Proof &amp; Direct Channels
          </h2>
        </div>
        <p className="text-stone text-xs font-light max-w-sm">
          Join an engaged audience of over 1,000,000 across digital brand channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Instagram 1 Million+ Card */}
        <a
          href="https://instagram.com/javigroups"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="view"
          className="group relative bg-charcoal border border-line p-8 lg:p-10 space-y-6 hover:border-gold/60 transition-all duration-500 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="editorial-label text-gold">Instagram</span>
              <p className="text-ivory font-mono text-sm">@javigroups</p>
            </div>
            <span className="p-2 border border-line text-stone group-hover:text-gold group-hover:border-gold transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="font-serif text-5xl lg:text-7xl font-light text-ivory">
              <NumberCounter value={1} suffix=" Million+" className="text-gold" />
            </div>
            <p className="text-stone text-xs leading-relaxed max-w-md">
              Engaging luxury lifestyle aesthetics, Mumbai Marine Drive silhouettes, business development insights, and behind-the-scenes glimpses.
            </p>
          </div>

          <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs uppercase tracking-widest text-stone group-hover:text-gold transition-colors">
            <span>Follow on Instagram</span>
            <span>&rarr;</span>
          </div>
        </a>

        {/* YouTube 100K+ Card */}
        <a
          href="https://youtube.com/@VibewithVipulMota"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="play"
          className="group relative bg-charcoal border border-line p-8 lg:p-10 space-y-6 hover:border-gold/60 transition-all duration-500 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="editorial-label text-gold">YouTube Channel</span>
              <p className="text-ivory font-mono text-sm">@VibewithVipulMota</p>
            </div>
            <span className="p-2 border border-line text-stone group-hover:text-gold group-hover:border-gold transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="font-serif text-5xl lg:text-7xl font-light text-ivory">
              <NumberCounter value={100} suffix="K+" className="text-gold" />
            </div>
            <p className="text-stone text-xs leading-relaxed max-w-md">
              Mission: Build your financial portfolio without compromising your personal image. Real discussions on capital, style, and disciplined wealth stewardship.
            </p>
          </div>

          <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs uppercase tracking-widest text-stone group-hover:text-gold transition-colors">
            <span>Subscribe on YouTube</span>
            <span>&rarr;</span>
          </div>
        </a>
      </div>
    </section>
  );
}
