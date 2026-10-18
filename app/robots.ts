import type { MetadataRoute } from "next";

const SITE_URL = "https://mishipoojaproducts.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/invoice",
          "/invoice/",
          "/login",
          "/profile",
          "/cart",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
