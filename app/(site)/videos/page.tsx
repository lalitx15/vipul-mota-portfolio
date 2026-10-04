import type { Metadata } from "next";
import { getVideos } from "@/lib/supabase/videos";
import { Marquee } from "@/components/ui/Marquee";
import { VideosHero, VideosInteractiveContainer } from "@/components/videos";

export const metadata: Metadata = {
  title: "Screen Clips & Broadcast Repertoire — Vipul Mota",
  description:
    "Explore on-screen drama clips from Crime World (2022) streaming on ShemarooMe and strategic conversations on wealth and style from the Vibe with Vipul Mota broadcast archive.",
  openGraph: {
    title: "Screen Clips & Broadcast Repertoire — Vipul Mota",
    description:
      "Watch Crime World (2022) clips, lifestyle reels, and YouTube conversations with Vipul Mota.",
    type: "video.other",
    locale: "en_IN",
  },
};

export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getVideos();

  const marqueeItems = [
    "YOUTUBE @VIBEWITHVIPULMOTA",
    "CRIME WORLD (2022) ON SHEMAROOME",
    "100K+ SUBSCRIBERS",
    "FINANCIAL DISCIPLINE & STYLE",
    "INNER CIRCLE BROADCASTS",
    "1 MILLION+ ON INSTAGRAM",
  ];

  return (
    <div className="min-h-screen bg-ink text-ivory">
      {/* 01. Hero Banner */}
      <VideosHero />

      {/* 02. Infinite Velocity Marquee */}
      <section className="border-b border-line py-2 bg-charcoal/50">
        <Marquee items={marqueeItems} speed={30} />
      </section>

      {/* 03. Interactive Video Player & Categorized Library */}
      <section className="w-full bg-white text-black py-16 md:py-24 border-b border-neutral-200">
        <div className="max-w-site mx-auto px-6">
          <VideosInteractiveContainer videos={videos} />
        </div>
      </section>

      {/* 04. YouTube Channel Authority Banner */}
      <section className="border-t border-line bg-charcoal py-20 px-6">
        <div className="max-w-site mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="editorial-label text-gold">Digital Mission</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
              &ldquo;Build your financial portfolio without compromising your personal image.&rdquo;
            </h2>
            <p className="text-stone text-xs sm:text-sm font-light">
              Subscribe to the official YouTube broadcast channel for regular long-form discussions on capital stewardship and presence.
            </p>
          </div>

          <a
            href="https://youtube.com/@VibewithVipulMota"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center py-4 px-8 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all shrink-0"
          >
            Subscribe on YouTube (100K+) &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
