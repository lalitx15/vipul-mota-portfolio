import type { Metadata } from "next";
import { getAboutData } from "@/lib/supabase/about";
import { Marquee } from "@/components/ui/Marquee";
import {
  AboutHero,
  AboutKeyFacts,
  AboutBioNarrative,
  AboutTimeline,
  AboutPressKit,
} from "@/components/about";

export const metadata: Metadata = {
  title: "Biography & Journey — Vipul Mota | Javi Groups",
  description:
    "Official biography, journey milestones, and archive facts of Vipul Mota. Actor (Crime World, 2022), bespoke fashion model, and founder of Javi Groups. Mumbai, India.",
  openGraph: {
    title: "Biography & Journey — Vipul Mota",
    description:
      "Official biography, journey milestones, and verified facts. Style, wealth, and presence in Mumbai.",
    type: "profile",
    locale: "en_IN",
  },
};

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function AboutPage() {
  const data = await getAboutData();

  const marqueeItems = [
    "VIPUL MOTA",
    "BORN 29 AUGUST 1975",
    "MUMBAI, INDIA",
    "ACTOR · CRIME WORLD (2022)",
    "FOUNDER OF JAVI GROUPS",
    "FASHION MODELING",
    "LIVE KING SIZE",
    "STYLE · WEALTH · PRESENCE",
  ];

  return (
    <div className="relative min-h-screen w-full bg-ink text-ivory">
      {/* 01. Hero with Parallax Portrait & Display Typography */}
      <AboutHero />

      {/* 02. Infinite Scrolling Editorial Marquee Strip */}
      <section className="border-b border-line py-2 bg-charcoal/50">
        <Marquee items={marqueeItems} speed={32} />
      </section>

      {/* 03. Verified Key Facts Dossier */}
      <AboutKeyFacts />

      {/* 04. In-Depth Editorial Narrative & Philosophy */}
      <AboutBioNarrative
        philosophyQuote="Live king size. Style is never superficial; it is discipline, character, and self-possession made visible to the world."
        financeDisclaimer={
          data.settings?.finance_disclaimer ||
          "Content is for inspiration and information only and is not financial advice."
        }
      />

      {/* 05. Animated Vertical Timeline Milestones */}
      <AboutTimeline timeline={data.timeline} />

      {/* 06. Downloadable Press Kit, High-Res Assets & Booking Flow */}
      <AboutPressKit contactEmail={data.settings?.contact_email || "connect@javigroups.com"} />
    </div>
  );
}
