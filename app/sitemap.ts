import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { defaultPosts, type Post } from "@/lib/supabase/journal";
import { defaultWorkItems, type WorkItem } from "@/lib/supabase/work";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vipulmota.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  let postSlugs: string[] = defaultPosts.map((p: Post) => p.slug);
  let workSlugs: string[] = defaultWorkItems.map((w: WorkItem) => w.slug);

  try {
    const supabase = createServerClient();
    const [postsRes, workRes] = await Promise.all([
      supabase.from("posts").select("slug").eq("status", "published"),
      supabase.from("work_items").select("slug").eq("status", "published"),
    ]);

    if (postsRes.data && postsRes.data.length > 0) {
      postSlugs = postsRes.data.map((p: any) => p.slug as string);
    }
    if (workRes.data && workRes.data.length > 0) {
      workSlugs = workRes.data.map((w: any) => w.slug as string);
    }
  } catch {
    // Keep fallbacks
  }

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug: string) => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const workRoutes: MetadataRoute.Sitemap = workSlugs.map((slug: string) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
}
