import type { MetadataRoute } from "next";
import { seoCities } from "@/Data/seoCities";

const SITE_URL = "https://disconnect.agency";

const basePaths = [
  "/",
  "/WebDevelopment",
  "/AppDevelopment",
  "/Uiux",
  "/SEO",
  "/Cloud",
  "/AIModels",
  "/book-call",
];

const cityServiceSegments = [
  "WebDevelopment",
  "AppDevelopment",
  "Uiux",
  "SEO",
  "Cloud",
  "AIModels",
];

const buildAbsoluteUrl = (path: string): string => `${SITE_URL}${path}`;

export const buildSitemapEntries = (): MetadataRoute.Sitemap => {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = basePaths.map((path) => ({
    url: buildAbsoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const cityEntries: MetadataRoute.Sitemap = cityServiceSegments.flatMap((service) =>
    seoCities.map((city) => ({
      url: buildAbsoluteUrl(`/${service}/${city.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...cityEntries];
};

