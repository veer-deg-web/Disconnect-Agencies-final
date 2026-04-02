import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { seoCities } from "@/Data/seoCities";

const BASE = "https://disconnect.software";
const SERVICES = ["Cloud", "WebDevelopment", "AppDevelopment", "AIModels", "SEO", "Uiux"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Homepage ────────────────────────────────────────────────────────────
  const homepage: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  ];

  // ── Service Pages (priority 0.9, weekly) ────────────────────────────────
  const serviceEntries: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${BASE}/${s}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // ── Pricing Pages (priority 0.7, monthly) ──────────────────────────────
  const pricingEntries: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${BASE}/${s}/pricing`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Supporting Pages (priority 0.5–0.6, monthly) ───────────────────────
  const supportingEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/how-we-work`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/feedback`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  // ── Legal Pages (priority 0.3, yearly) ─────────────────────────────────
  const legalEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // ── City Pages (6 services × 48 cities = 288, priority 0.65, monthly) ─
  // Only canonical slugs — aliases are excluded
  const cityEntries: MetadataRoute.Sitemap = SERVICES.flatMap((service) =>
    seoCities.map((city) => ({
      url: `${BASE}/${service}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  );

  // ── Blog Entries ────────────────────────────────────────────────────────
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const blogs = await Blog.find({ status: "published" })
      .select("slug updatedAt")
      .lean();

    blogEntries = blogs.map((blog) => ({
      url: `${BASE}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: blog fetch fell back to static entries:", error);
  }

  // book-call is EXCLUDED from sitemap entirely
  return [
    ...homepage,
    ...serviceEntries,
    ...pricingEntries,
    ...supportingEntries,
    ...legalEntries,
    ...cityEntries,
    ...blogEntries,
  ];
}
