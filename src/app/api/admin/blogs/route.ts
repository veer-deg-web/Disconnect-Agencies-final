export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { ensureWebpImage } from "@/lib/blogImageWebp";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  generateBlogExcerpt,
  normalizeBlogSlug,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
} from "@/lib/blogSeo";
import { sanitizeInput } from "@/lib/sanitizer";
import { verifyAdminToken } from "@/lib/adminAuth";

/* GET /api/admin/blogs — Admin blog list (all statuses) */
export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(200, parseInt(searchParams.get("limit") || "100"));
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [blogs, total, publishedCount, draftCount, scrapedCount, aiCount] =
      await Promise.all([
        Blog.find(filter)
          .select("-content")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Blog.countDocuments(filter),
        Blog.countDocuments({ status: "published" }),
        Blog.countDocuments({ status: "draft" }),
        Blog.countDocuments({ source: "scraped" }),
        Blog.countDocuments({ source: "ai-generated" }),
      ]);

    return NextResponse.json({
      blogs,
      stats: {
        total: publishedCount + draftCount,
        published: publishedCount,
        draft: draftCount,
        scraped: scrapedCount,
        aiGenerated: aiCount,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* POST /api/admin/blogs — Create blog manually */
export async function POST(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await dbConnect();
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = normalizeBlogSlug(String(body.slug || body.title || ""));

    // Ensure unique
    let counter = 0;
    while (await Blog.findOne({ slug })) {
      counter++;
      slug = `${slug.replace(/-\d+$/, "")}-${counter}`;
    }

    const normalizedTitle = normalizeDisconnectBrand(String(body.title || "").trim());
    const normalizedContent = sanitizeBlogHtmlContent(String(body.content || ""), {
      fallbackAlt: normalizedTitle || "Blog article illustration",
    });
    const normalizedExcerpt = generateBlogExcerpt({
      excerpt: normalizeDisconnectBrand(String(body.excerpt || "").trim()),
      content: normalizedContent,
      title: normalizedTitle,
    });

    // Calculate reading time
    const text = normalizedContent.replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const featuredImage = await ensureWebpImage(
      String(body.featuredImage || ""),
      String(body.title || "blog-image")
    );

    const blog = await Blog.create({
      title: normalizedTitle,
      slug,
      category: body.category || "Web Development",
      excerpt: normalizedExcerpt,
      metaTitle: buildProfessionalMetaTitle(
        normalizedTitle,
        String(body.metaTitle || "")
      ),
      metaDescription: buildProfessionalMetaDescription({
        provided: String(body.metaDescription || ""),
        excerpt: normalizedExcerpt,
        content: normalizedContent,
        title: normalizedTitle,
      }),
      featuredImage,
      content: normalizedContent,
      tags: body.tags || [],
      readingTime,
      author: normalizeDisconnectBrand(String(body.author || "Disconnect Team")),
      status: body.status || "published",
      source: "manual",
      faq: body.faq || [],
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* PUT /api/admin/blogs — Update blog */
export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await dbConnect();
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    if (!body.id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    const allowedFields = [
      "title", "slug", "category", "excerpt", "metaTitle",
      "metaDescription", "featuredImage", "content", "tags",
      "author", "status", "faq",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    if (body.title !== undefined) {
      update.title = normalizeDisconnectBrand(String(body.title || ""));
    }
    if (body.author !== undefined) {
      update.author = normalizeDisconnectBrand(String(body.author || ""));
    }
    if (body.excerpt !== undefined) {
      update.excerpt = normalizeDisconnectBrand(String(body.excerpt || ""));
    }
    if (body.content !== undefined) {
      update.content = sanitizeBlogHtmlContent(String(body.content || ""), {
        fallbackAlt: String(body.title || update.title || "Blog article illustration"),
      });
    }
    if (body.slug !== undefined || body.title !== undefined) {
      update.slug = normalizeBlogSlug(String(body.slug || body.title || update.slug || ""));
    }

    if (body.featuredImage !== undefined) {
      update.featuredImage = await ensureWebpImage(
        String(body.featuredImage || ""),
        String(body.title || "blog-image")
      );
    }

    // Recalculate reading time if content changed
    if (update.content && typeof update.content === "string") {
      const text = update.content.replace(/<[^>]+>/g, " ");
      const words = text.split(/\s+/).filter(Boolean).length;
      update.readingTime = Math.max(1, Math.ceil(words / 200));
    }

    const resolvedTitle = String(update.title || body.title || "");
    const resolvedContent = String(update.content || body.content || "");
    const resolvedExcerpt = generateBlogExcerpt({
      excerpt: String(update.excerpt || body.excerpt || ""),
      content: resolvedContent,
      title: resolvedTitle,
    });

    if (body.excerpt !== undefined || body.content !== undefined || body.title !== undefined) {
      update.excerpt = resolvedExcerpt;
    }

    if (body.metaTitle !== undefined || body.title !== undefined) {
      update.metaTitle = buildProfessionalMetaTitle(
        resolvedTitle,
        String(body.metaTitle || update.metaTitle || "")
      );
    }
    if (
      body.metaDescription !== undefined ||
      body.excerpt !== undefined ||
      body.content !== undefined ||
      body.title !== undefined
    ) {
      update.metaDescription = buildProfessionalMetaDescription({
        provided: String(body.metaDescription || update.metaDescription || ""),
        excerpt: resolvedExcerpt,
        content: resolvedContent,
        title: resolvedTitle,
      });
    }

    const blog = await Blog.findByIdAndUpdate(body.id, update, { new: true });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* DELETE /api/admin/blogs — Delete blog */
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await dbConnect();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const blog = await Blog.findByIdAndDelete(body.id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
