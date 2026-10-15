import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";

const siteUrl = "https://kalshisignals.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "always", priority: 1.0 },
    { url: `${siteUrl}/signals`, changeFrequency: "always", priority: 0.9 },
    { url: `${siteUrl}/trending`, changeFrequency: "always", priority: 0.9 },
    { url: `${siteUrl}/popular`, changeFrequency: "always", priority: 0.9 },
    { url: `${siteUrl}/new-markets`, changeFrequency: "always", priority: 0.8 },
    { url: `${siteUrl}/long-term-markets`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
