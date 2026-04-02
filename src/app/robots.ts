import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/book-call", "/api/", "/_next/"],
    },
    sitemap: "https://disconnect.software/sitemap.xml",
  };
}
