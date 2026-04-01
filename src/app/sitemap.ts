import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getSiteUrl } from "@/lib/site";
import { seoCities } from "@/lib/seoCities";

const SERVICES = ["Cloud", "WebDevelopment", "AppDevelopment", "AIModels", "SEO", "Uiux"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes = [
    "",
    "/WebDevelopment",
    "/WebDevelopment/pricing",
    "/AppDevelopment",
    "/AppDevelopment/pricing",
    "/AIModels",
    "/AIModels/pricing",
    "/Cloud",
    "/Cloud/pricing",
    "/SEO",
    "/SEO/pricing",
    "/Uiux",
    "/Uiux/pricing",
    "/blog",
    "/careers",
    "/about",
    "/feedback",
    "/book-call",
    "/how-we-work",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
  ];

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("pricing") ? "weekly" : "daily",
    priority: route === "" ? 1 : route.includes("pricing") ? 0.9 : 0.8,
  }));

  // ── City + Service Entries (288 pages) ───────────────────────────────
  const cityEntries: MetadataRoute.Sitemap = SERVICES.flatMap((service) =>
    seoCities.map((city) => ({
      url: `${siteUrl}/${service}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const blogs = await Blog.find({ status: "published" })
      .select("slug updatedAt")
      .lean();

    blogEntries = blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap generation fell back to static entries:", error);
  }

  return [...baseEntries, ...cityEntries, ...blogEntries];
}
