import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  generateBlogExcerpt,
  normalizeBlogSlug,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
  validateBlogSeo,
} from "@/lib/blogSeo";

/* POST /api/admin/blogs/normalize-seo — Normalize existing blog SEO + heading structure */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizeInput(rawBody);
    const limit = Math.min(500, Math.max(1, Number(body.limit || 200)));

    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(limit);
    let updated = 0;
    const warnings: Array<{ slug: string; issues: string[] }> = [];

    for (const blog of blogs) {
      const title = normalizeDisconnectBrand(String(blog.title || ""));
      const slug = normalizeBlogSlug(String(blog.slug || title));
      const excerpt = generateBlogExcerpt({
        excerpt: normalizeDisconnectBrand(String(blog.excerpt || "")),
        content: String(blog.content || ""),
        title,
      });
      const content = sanitizeBlogHtmlContent(String(blog.content || ""), {
        fallbackAlt: title || "Blog article illustration",
      });
      const author = normalizeDisconnectBrand(String(blog.author || "Disconnect Team"));
      const metaTitle = buildProfessionalMetaTitle(title, String(blog.metaTitle || ""));
      const metaDescription = buildProfessionalMetaDescription({
        provided: String(blog.metaDescription || ""),
        excerpt,
        content,
        title,
      });
      const seoIssues = validateBlogSeo({
        title,
        slug,
        excerpt,
        content,
        featuredImage: String(blog.featuredImage || ""),
        metaTitle,
        metaDescription,
      });

      const hasChanges =
        title !== blog.title ||
        slug !== blog.slug ||
        excerpt !== blog.excerpt ||
        content !== blog.content ||
        author !== blog.author ||
        metaTitle !== blog.metaTitle ||
        metaDescription !== blog.metaDescription;

      if (hasChanges) {
        blog.title = title;
        blog.slug = slug;
        blog.excerpt = excerpt;
        blog.content = content;
        blog.author = author;
        blog.metaTitle = metaTitle;
        blog.metaDescription = metaDescription;
        await blog.save();
        updated++;
      }

      if (seoIssues.length > 0) {
        warnings.push({
          slug,
          issues: seoIssues.map((issue) => issue.message),
        });
      }
    }

    return NextResponse.json({
      message: "SEO normalization completed",
      processed: blogs.length,
      updated,
      warnings,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
