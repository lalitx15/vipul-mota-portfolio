import type { Metadata } from "next";
import Link from "next/link";
import { getWorkItems } from "@/lib/supabase/work";
import { Marquee } from "@/components/ui/Marquee";
import { WorkHero, WorkGrid } from "@/components/work";

export const metadata: Metadata = {
  title: "Selected Work & Portfolio — Vipul Mota",
  description:
    "Explore on-screen acting in Crime World (2022) streaming on ShemarooMe, bespoke sartorial modeling lookbooks, and private equity initiatives through Javi Groups. Mumbai, India.",
  openGraph: {
    title: "Selected Work & Portfolio — Vipul Mota",
    description:
      "Acting, Fashion Modeling, and Javi Groups commercial portfolio of Vipul Mota.",
    type: "website",
    locale: "en_IN",
  },
};

export const revalidate = 60;

export default async function WorkPage() {
  const items = await getWorkItems();

  const marqueeItems = [
    "CRIME WORLD (2022)",
    "ROLE: NEIGHBOUR",
    "SHEMAROOME",
    "JAVI GROUPS MUMBAI",
    "SARTORIAL LOOKBOOK",
    "STYLE · WEALTH · PRESENCE",
    "1 MILLION+ COMMUNITY",
  ];

  return (
    <div className="min-h-screen bg-ink text-ivory">
      {/* 01. Hero Banner */}
      <WorkHero />

      {/* 02. Infinite Velocity Marquee */}
      <section className="border-b border-line py-2 bg-charcoal/50">
        <Marquee items={marqueeItems} speed={30} />
      </section>

      {/* 03. Filterable Portfolio Grid with Category Tabs */}
      <section className="w-full bg-white text-black py-16 md:py-24 border-b border-neutral-200">
        <div className="max-w-site mx-auto px-6">
          <WorkGrid items={items} />
        </div>
      </section>

      {/* 04. Bottom Casting & Collaboration CTA */}
      <section className="border-t border-line bg-charcoal py-20 px-6">
        <div className="max-w-site mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="editorial-label text-gold">Representation &amp; Inquiries</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
              Interested in casting, editorial lookbook collaboration, or private syndication?
            </h2>
            <p className="text-stone text-xs sm:text-sm font-light">
              Direct discussions with Vipul Mota and the Javi Groups management team.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center py-4 px-8 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all shrink-0"
          >
            Initiate Conversation &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
