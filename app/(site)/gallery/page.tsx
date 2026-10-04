import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/supabase/gallery";
import { Marquee } from "@/components/ui/Marquee";
import { GalleryHero, GalleryGrid } from "@/components/gallery";

export const metadata: Metadata = {
  title: "Visual Gallery & Lookbook Plates — Vipul Mota",
  description:
    "Curated visual anthology of Vipul Mota. High-contrast studio portraits, bespoke tailoring across Mumbai Marine Drive, and Crime World production stills.",
  openGraph: {
    title: "Visual Gallery & Lookbook Plates — Vipul Mota",
    description:
      "Curated photographic anthology, fashion lookbook, and screen stills of Vipul Mota.",
    type: "website",
    locale: "en_IN",
  },
};

export const revalidate = 60;

export default async function GalleryPage() {
  const items = await getGalleryItems();

  const marqueeItems = [
    "LOOKBOOK PLATES",
    "MONOCHROME TAILORING",
    "CRIME WORLD PRODUCTION STILLS",
    "MARINE DRIVE ANTHOLOGY",
    "VIPUL MOTA",
    "STYLE · WEALTH · PRESENCE",
  ];

  return (
    <div className="min-h-screen bg-ink text-ivory">
      {/* 01. Hero Banner */}
      <GalleryHero />

      {/* 02. Infinite Velocity Marquee */}
      <section className="border-b border-line py-2 bg-charcoal/50">
        <Marquee items={marqueeItems} speed={30} />
      </section>

      {/* 03. Filterable Gallery Grid with Lightbox */}
      <section className="w-full bg-white text-black py-16 md:py-24 border-b border-neutral-200">
        <div className="max-w-site mx-auto px-6">
          <GalleryGrid items={items} />
        </div>
      </section>
    </div>
  );
}
