import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const routes = [
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

  const baseEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("pricing") ? "weekly" : "daily",
    priority: route === "" ? 1 : route.includes("pricing") ? 0.9 : 0.8,
  }));

  try {
    await dbConnect();
    const blogs = await Blog.find({ status: "published" })
      .select("slug updatedAt")
      .lean();

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...baseEntries, ...blogEntries];
  } catch (error) {
    console.error("Sitemap generation fell back to static entries:", error);
    return baseEntries;
  }
}
