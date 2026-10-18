import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/db";

const SITE_URL = "https://mishipoojaproducts.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static public routes
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamic — individual products (if the project ever adds per-product pages).
  // Right now products are listed on a single /products page, so the entries below
  // only appear when a product URL exists. Safe no-op otherwise.
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProducts();
    productEntries = (products || [])
      .filter((p) => p.isAvailable !== false)
      .map((p) => ({
        url: `${SITE_URL}/products?p=${encodeURIComponent(p.id)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch {
    // Fail quietly — sitemap builds even if the DB is unreachable at build time.
  }

  return [...staticEntries, ...productEntries];
}
