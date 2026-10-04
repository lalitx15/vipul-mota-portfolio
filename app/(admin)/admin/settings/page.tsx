import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import {
  SettingsManager,
  type SiteSettingsData,
  type SeoSettingsData,
  type PageSeoItem,
} from "@/components/admin/SettingsManager";

export const metadata: Metadata = {
  title: "Site Settings & SEO — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

const defaultSiteSettings: SiteSettingsData = {
  site_name: "Vipul Mota",
  tagline: "Style. Wealth. Presence.",
  contact_email: "connect@javigroups.com",
  contact_phone: "+91 98200 00000",
  address: "Marine Drive, Mumbai, Maharashtra, India",
  announcement_bar: "Founder of Javi Groups · Actor · Fashion Model · Mumbai",
  maintenance_mode: false,
  footer_text: "© 2026 Vipul Mota. All rights reserved. Javi Groups Mumbai.",
  finance_disclaimer:
    "Content is for inspiration and information only and is not financial advice.",
};

const defaultSeoSettings: SeoSettingsData = {
  default_title: "Vipul Mota — Actor, Fashion Model & Javi Groups Founder",
  title_template: "%s | Vipul Mota",
  default_description:
    "Official portfolio of Vipul Mota. Mumbai-based actor (Crime World 2022), fashion model lookbook, and founder of Javi Groups.",
  og_image_url:
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  google_analytics_id: null,
  search_console_tag: null,
  meta_pixel_id: null,
  robots_txt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /member/\n\nSitemap: https://vipulmota.com/sitemap.xml",
};

export default async function AdminSettingsPage() {
  const supabase = createServerClient();

  const [settingsRes, seoRes, pageSeoRes] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("page_seo").select("*").order("page_path", { ascending: true }),
  ]);

  const rawSettings = settingsRes.data as any;
  const rawSeo = seoRes.data as any;

  const siteSettings: SiteSettingsData = {
    site_name: rawSettings?.site_name || defaultSiteSettings.site_name,
    tagline: rawSettings?.tagline || defaultSiteSettings.tagline,
    contact_email: rawSettings?.contact_email || defaultSiteSettings.contact_email,
    contact_phone: rawSettings?.contact_phone || defaultSiteSettings.contact_phone,
    address: rawSettings?.address || defaultSiteSettings.address,
    announcement_bar: rawSettings?.announcement_bar ?? defaultSiteSettings.announcement_bar,
    maintenance_mode: rawSettings?.maintenance_mode ?? defaultSiteSettings.maintenance_mode,
    footer_text: rawSettings?.footer_text || defaultSiteSettings.footer_text,
    finance_disclaimer:
      rawSettings?.finance_disclaimer || defaultSiteSettings.finance_disclaimer,
  };

  const seoSettings: SeoSettingsData = {
    default_title: rawSeo?.default_title || defaultSeoSettings.default_title,
    title_template: rawSeo?.title_template || defaultSeoSettings.title_template,
    default_description: rawSeo?.default_description || defaultSeoSettings.default_description,
    og_image_url: rawSeo?.og_image_url ?? defaultSeoSettings.og_image_url,
    google_analytics_id: rawSeo?.google_analytics_id ?? defaultSeoSettings.google_analytics_id,
    search_console_tag: rawSeo?.search_console_tag ?? defaultSeoSettings.search_console_tag,
    meta_pixel_id: rawSeo?.meta_pixel_id ?? defaultSeoSettings.meta_pixel_id,
    robots_txt: rawSeo?.robots_txt || defaultSeoSettings.robots_txt,
  };

  const pageSeoList: PageSeoItem[] = (pageSeoRes.data as unknown as PageSeoItem[]) || [];

  return (
    <SettingsManager
      initialSettings={siteSettings}
      initialSeo={seoSettings}
      initialPageSeo={pageSeoList}
    />
  );
}
