import React from "react";
import Image from "next/image";

interface AboutBioNarrativeProps {
  philosophyQuote?: string;
  financeDisclaimer?: string;
}

export function AboutBioNarrative({
  philosophyQuote = "Live king size. Style is never superficial; it is discipline, character, and self-possession made visible to the world.",
  financeDisclaimer = "Content is for inspiration and information only and is not financial advice.",
}: AboutBioNarrativeProps) {
  return (
    <section className="bg-charcoal border-y border-line py-24 md:py-36 px-6">
      <div className="max-w-site mx-auto space-y-20">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-6 gap-4">
          <div className="space-y-1">
            <span className="editorial-label text-gold">03 / The Narrative</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-ivory">
              The Bombay Chronicle
            </h2>
          </div>
          <span className="editorial-label text-stone text-xs hidden sm:inline-block">
            In Depth Profile &middot; 2026 Edition
          </span>
        </div>

        {/* Narrative 2-Column Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Column 1: Screen & Tailoring */}
          <div className="lg:col-span-6 space-y-8 text-stone font-light text-base leading-relaxed">
            <h3 className="font-serif text-2xl text-ivory font-normal">
              Architecture, Cinema, and Character Rigour
            </h3>
            <p>
              Growing up in the architectural epicentre of South Mumbai, Vipul Mota developed an early fascination with proportion, heritage stone, and the dramatic interplay of light along Marine Drive. These early aesthetic impressions formed the baseline for a multifaceted career defined by high visual standards.
            </p>
            <p>
              When stepping into on-screen narrative acting, this eye for character subtlety found expression in the Hindi crime thriller series <em>Crime World</em> (2022). Portraying the nuanced character of &ldquo;Neighbour&rdquo; in Episode 2-12, streaming nationally on ShemarooMe, Mota brought quiet intensity and tension to the episodic screen without melodrama.
            </p>
            <p>
              In sartorial modeling, his approach rejects fleeting trends. Favoring sharp Italian tailoring, structured lapels, and monochromatic silhouettes against classic Bombay backdrops, his self-directed lookbook serves as a study in poise and restraint.
            </p>

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink border border-line mt-6">
              <Image
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop"
                alt="Crime World and Cinematic Screen Craft"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 bg-ink/80 px-3 py-1 border border-line text-[10px] editorial-label text-stone">
                Screen Craft &middot; ShemarooMe Still
              </div>
            </div>
          </div>

          {/* Column 2: Javi Groups & Wealth Stewardship */}
          <div className="lg:col-span-6 space-y-8 text-stone font-light text-base leading-relaxed">
            <h3 className="font-serif text-2xl text-ivory font-normal">
              Capital Stewardship &amp; The Javi Groups Ethos
            </h3>
            <p>
              Parallel to his creative pursuits, Mota built a formidable foundation in private commerce and business development. Over eighteen years of advising high-net-worth circles and corporate syndicates across Western India culminated in the founding of Javi Groups.
            </p>
            <p>
              Under his stewardship, Javi Groups represents a private circle anchored in capital preservation, long-term relationship trust, and high-value networking. His conviction has always been that financial strength and immaculate personal taste are mutually reinforcing.
            </p>
            <p>
              Through digital platforms—reaching 1 Million+ followers on Instagram (@javigroups) and cultivating an engaged audience via YouTube (@VibewithVipulMota)—he communicates directly with aspiring entrepreneurs, teaching them to construct lasting portfolios without sacrificing personal presence.
            </p>

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink border border-line mt-6">
              <Image
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop"
                alt="Javi Groups Executive Dialogue"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 bg-ink/80 px-3 py-1 border border-line text-[10px] editorial-label text-stone">
                Private Equity &middot; Executive Dialogue
              </div>
            </div>
          </div>
        </div>

        {/* Central Philosophy Quote Banner */}
        <div className="border border-line bg-ink p-8 md:p-14 text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden">
          <span className="editorial-label text-gold block">The Guiding Principle</span>
          <blockquote className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight italic">
            &ldquo;{philosophyQuote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center space-x-3 text-stone text-xs">
            <span className="editorial-label tracking-widest text-ivory">Vipul Mota</span>
            <span>&middot;</span>
            <span className="editorial-label text-stone">Founder, Javi Groups</span>
          </div>
        </div>

        {/* Mandatory Footer Finance Disclaimer Note */}
        <div className="p-4 border border-line/40 bg-ink/40 text-center text-xs text-stone/80 max-w-2xl mx-auto">
          <p className="font-light italic">
            {financeDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
