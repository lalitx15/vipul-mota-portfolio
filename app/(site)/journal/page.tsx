import type { Metadata } from "next";
import { getPosts } from "@/lib/supabase/journal";
import { Marquee } from "@/components/ui/Marquee";
import { JournalHero, JournalGrid } from "@/components/journal";

export const metadata: Metadata = {
  title: "The Journal & Thought Leadership — Vipul Mota",
  description:
    "Editorial dispatches and perspectives on screen discipline, bespoke sartorial codes, and private capital stewardship in modern Bombay. By Vipul Mota.",
  openGraph: {
    title: "The Journal & Thought Leadership — Vipul Mota",
    description:
      "Essays on screen acting, bespoke fashion, and wealth stewardship from Vipul Mota.",
    type: "website",
    locale: "en_IN",
  },
};

export const revalidate = 60;

export default async function JournalPage() {
  const posts = await getPosts();

  const marqueeItems = [
    "THE JOURNAL",
    "SCREEN DISCIPLINE",
    "BESPOKE SARTORIAL CODES",
    "CAPITAL STEWARDSHIP",
    "JAVI GROUPS ESSAYS",
    "VIPUL MOTA",
  ];

  return (
    <div className="min-h-screen bg-ink text-ivory">
      {/* 01. Hero Banner */}
      <JournalHero />

      {/* 02. Infinite Velocity Marquee */}
      <section className="border-b border-line py-2 bg-charcoal/50">
        <Marquee items={marqueeItems} speed={30} />
      </section>

      {/* 03. Filterable & Searchable Post Grid */}
      <section className="w-full bg-white text-black py-16 md:py-24 border-b border-neutral-200">
        <div className="max-w-site mx-auto px-6">
          <JournalGrid posts={posts} />
        </div>
      </section>
    </div>
  );
}
