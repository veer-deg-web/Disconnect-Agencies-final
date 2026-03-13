import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

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
