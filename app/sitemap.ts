import type { MetadataRoute } from "next";

const SITE_URL = "https://psalm-morning.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/archive`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/news`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
