import type { Metadata } from "next";
import { getHomeData } from "@/lib/supabase/home";
import { Marquee } from "@/components/ui/Marquee";
import {
  HomeHero,
  HomeMotivationQuote,
  HomePhotoCarousel,
  HomeInstagramReels,
  HomeDisciplines,
  HomeSelectedWork,
  HomeInternetPersonality,
  HomeCollaborateCTA,
} from "@/components/home";

export const metadata: Metadata = {
  title: "Vipul Mota — Actor, Fashion Model & Founder of Javi Groups",
  description:
    "Official brand home and personal archive of Vipul Mota. Actor (Crime World, 2022), fashion model, and founder of Javi Groups. Style, wealth, and presence in Mumbai, India.",
  openGraph: {
    title: "Vipul Mota — Actor, Fashion Model & Founder of Javi Groups",
    description:
      "Official brand home and personal archive of Vipul Mota. Style, wealth, and presence in Mumbai.",
    type: "website",
    locale: "en_IN",
  },
};

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const data = await getHomeData();

  const marqueeItems = [
    "VIPUL MOTA",
    "ACTOR",
    "CRIME WORLD (2022)",
    "FASHION MODEL",
    "FOUNDER OF JAVI GROUPS",
    "STYLE · WEALTH · PRESENCE",
    "1 MILLION+ ON INSTAGRAM",
    "MUMBAI EDITORIAL",
  ];

  return (
    <div className="relative min-h-screen w-full bg-ink text-ivory">
      {/* 01. Hero Section (Plate 01) */}
      <HomeHero
        headlineLine1={data.hero?.headline_line1 || "VIPUL"}
        headlineLine2={data.hero?.headline_line2 || "MOTA"}
        tagline={data.hero?.tagline || "Actor · Fashion Model · Founder of Javi Groups"}
        imageUrl={
          data.hero?.image_url ||
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop"
        }
        ctaText={data.hero?.cta_text || "Explore Archive"}
        ctaLink={data.hero?.cta_link || "/work"}
      />

      {/* 02. Infinite Velocity Marquee Strip */}
      <section className="border-y border-line py-2.5 bg-charcoal/60 backdrop-blur-sm">
        <Marquee items={marqueeItems} speed={32} />
      </section>

      {/* 03. Motivation Quote Written by Vipul Mota */}
      <HomeMotivationQuote />

      {/* 04. Scrollable Lookbook & Editorial Photo Cards */}
      <HomePhotoCarousel />

      {/* 05. Instagram Video Reels (Paused by default, click to play) */}
      <HomeInstagramReels />

      {/* 06. Special Section: 03 / The Disciplines (One Name. Many Worlds.) */}
      <HomeDisciplines />

      {/* 07. Special Section: 04 / Selected Work (Curated Credits) */}
      <HomeSelectedWork workItems={data.workItems} />

      {/* 08. Dedicated Section: Vipul Mota - Internet Personality */}
      <HomeInternetPersonality />

      {/* 09. Collaborate & Inquiries Direct CTA */}
      <HomeCollaborateCTA />
    </div>
  );
}
