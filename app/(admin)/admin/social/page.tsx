import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { SocialManager, type SocialSettingsData } from "@/components/admin/SocialManager";

export const metadata: Metadata = {
  title: "Social Presence & Handles — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

const defaultSocialSettings: SocialSettingsData = {
  instagram_url: "https://instagram.com/javigroups",
  youtube_url: "https://youtube.com/@VibewithVipulMota",
  facebook_url: "https://facebook.com/javigroups",
  threads_url: "https://threads.net/@javigroups",
  x_url: null,
  linkedin_url: null,
  whatsapp_url: "https://wa.me/919820000000",
  instagram_followers_count: "1 Million+",
  youtube_subscribers_count: "100K+",
};

export default async function AdminSocialPage() {
  const supabase = createServerClient();

  const { data: rawData } = await supabase
    .from("site_settings")
    .select(
      "instagram_url, youtube_url, facebook_url, threads_url, x_url, linkedin_url, whatsapp_url, instagram_followers_count, youtube_subscribers_count"
    )
    .eq("id", 1)
    .maybeSingle();

  const data = rawData as unknown as Partial<SocialSettingsData> | null;

  const settings: SocialSettingsData = {
    instagram_url: data?.instagram_url || defaultSocialSettings.instagram_url,
    youtube_url: data?.youtube_url || defaultSocialSettings.youtube_url,
    facebook_url: data?.facebook_url || defaultSocialSettings.facebook_url,
    threads_url: data?.threads_url || defaultSocialSettings.threads_url,
    x_url: data?.x_url || defaultSocialSettings.x_url,
    linkedin_url: data?.linkedin_url || defaultSocialSettings.linkedin_url,
    whatsapp_url: data?.whatsapp_url || defaultSocialSettings.whatsapp_url,
    instagram_followers_count:
      data?.instagram_followers_count || defaultSocialSettings.instagram_followers_count,
    youtube_subscribers_count:
      data?.youtube_subscribers_count || defaultSocialSettings.youtube_subscribers_count,
  };

  return <SocialManager initialSettings={settings} />;
}
