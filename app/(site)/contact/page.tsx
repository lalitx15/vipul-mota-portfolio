import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { Marquee } from "@/components/ui/Marquee";
import { ContactHero, ContactForm, ContactDirectCards } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact & Representation — Vipul Mota",
  description:
    "Direct communication channel for film and screen casting, bespoke fashion modeling alliances, or private capital syndication through Javi Groups. Marine Drive, Mumbai.",
  openGraph: {
    title: "Contact & Representation — Vipul Mota",
    description:
      "Direct communication channel for film casting, lookbook alliances, and Javi Groups syndication.",
    type: "website",
    locale: "en_IN",
  },
};

interface ContactPageProps {
  searchParams?: {
    tab?: string;
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  let settings: Record<string, string> = {
    contact_email: "connect@javigroups.com",
    contact_phone: "+91 98200 00000",
    address: "Marine Drive, Mumbai, Maharashtra, India",
    instagram_url: "https://instagram.com/javigroups",
    youtube_url: "https://youtube.com/@VibewithVipulMota",
  };

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (data) {
      const d = data as any;
      settings = {
        contact_email: d.contact_email || settings.contact_email,
        contact_phone: d.contact_phone || settings.contact_phone,
        address: d.address || settings.address,
        instagram_url: d.instagram_url || settings.instagram_url,
        youtube_url: d.youtube_url || settings.youtube_url,
      };
    }
  } catch {
    // Graceful fallback to verified client settings
  }

  const tabParam = searchParams?.tab;
  const initialType =
    tabParam === "brand"
      ? "brand"
      : tabParam === "booking"
      ? "booking"
      : "general";

  const marqueeItems = [
    "REPRESENTATION & CASTING",
    "BRAND ALLIANCES",
    "PRIVATE SYNDICATION",
    "JAVI GROUPS MUMBAI",
    "VIPUL MOTA",
    "STYLE · WEALTH · PRESENCE",
  ];

  return (
    <div className="min-h-screen bg-ink text-ivory pb-28">
      {/* 01. Hero Banner */}
      <ContactHero />

      {/* 02. Infinite Velocity Marquee */}
      <section className="border-b border-line py-2 bg-charcoal/50">
        <Marquee items={marqueeItems} speed={30} />
      </section>

      {/* 03. Inquiry Flow & Direct Cards */}
      <div className="max-w-site mx-auto px-6 py-16 md:py-24 space-y-16">
        <ContactForm initialType={initialType} />

        <div className="space-y-6 pt-8 border-t border-line">
          <div className="space-y-1">
            <span className="editorial-label text-gold">Direct Channels</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
              Executive Presence &amp; Offices
            </h2>
          </div>

          <ContactDirectCards
            contactEmail={settings.contact_email}
            contactPhone={settings.contact_phone}
            address={settings.address}
            instagramUrl={settings.instagram_url}
            youtubeUrl={settings.youtube_url}
          />
        </div>
      </div>
    </div>
  );
}
