import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
} from "@/lib/blogSeo";

/* POST /api/admin/blogs/normalize-seo — Normalize existing blog SEO + heading structure */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(500, Math.max(1, Number(body.limit || 200)));

    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(limit);
    let updated = 0;

    for (const blog of blogs) {
      const title = normalizeDisconnectBrand(String(blog.title || ""));
      const excerpt = normalizeDisconnectBrand(String(blog.excerpt || ""));
      const content = sanitizeBlogHtmlContent(String(blog.content || ""));
      const author = normalizeDisconnectBrand(String(blog.author || "Disconnect Team"));
      const metaTitle = buildProfessionalMetaTitle(title, String(blog.metaTitle || ""));
      const metaDescription = buildProfessionalMetaDescription({
        provided: String(blog.metaDescription || ""),
        excerpt,
        content,
        title,
      });

      const hasChanges =
        title !== blog.title ||
        excerpt !== blog.excerpt ||
        content !== blog.content ||
        author !== blog.author ||
        metaTitle !== blog.metaTitle ||
        metaDescription !== blog.metaDescription;

      if (hasChanges) {
        blog.title = title;
        blog.excerpt = excerpt;
        blog.content = content;
        blog.author = author;
        blog.metaTitle = metaTitle;
        blog.metaDescription = metaDescription;
        await blog.save();
        updated++;
      }
    }

    return NextResponse.json({
      message: "SEO normalization completed",
      processed: blogs.length,
      updated,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
