import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

/* GET /api/admin/blogs — Admin blog list (all statuses) */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
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
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug
    let slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 80);

    // Ensure unique
    let counter = 0;
    while (await Blog.findOne({ slug })) {
      counter++;
      slug = `${slug.replace(/-\d+$/, "")}-${counter}`;
    }

    // Calculate reading time
    const text = (body.content || "").replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const blog = await Blog.create({
      title: body.title,
      slug,
      category: body.category || "Web Development",
      excerpt: body.excerpt || "",
      metaTitle: body.metaTitle || body.title.substring(0, 60),
      metaDescription: body.metaDescription || body.excerpt || "",
      featuredImage: body.featuredImage || "",
      content: body.content,
      tags: body.tags || [],
      readingTime,
      author: body.author || "Disconnect Team",
      status: body.status || "published",
      source: "manual",
      faq: body.faq || [],
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* PUT /api/admin/blogs — Update blog */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

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

    // Recalculate reading time if content changed
    if (body.content) {
      const text = body.content.replace(/<[^>]+>/g, " ");
      const words = text.split(/\s+/).filter(Boolean).length;
      update.readingTime = Math.max(1, Math.ceil(words / 200));
    }

    const blog = await Blog.findByIdAndUpdate(body.id, update, { new: true });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* DELETE /api/admin/blogs — Delete blog */
export async function DELETE(req: NextRequest) {
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
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
