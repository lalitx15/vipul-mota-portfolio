import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vipulmota.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/member/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
