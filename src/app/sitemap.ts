import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/sitemap/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}

