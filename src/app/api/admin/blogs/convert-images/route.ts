import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { ensureWebpImage } from "@/lib/blogImageWebp";

/* POST /api/admin/blogs/convert-images — Backfill existing featured images to webp */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(200, Math.max(1, Number(body.limit || 50)));

    const blogs = await Blog.find({
      featuredImage: { $exists: true, $ne: "" },
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    let converted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const blog of blogs) {
      try {
        const current = blog.featuredImage || "";
        if (!current) {
          skipped++;
          continue;
        }

        const webp = await ensureWebpImage(current, blog.title || blog.slug || "blog-image");
        if (webp !== current) {
          blog.featuredImage = webp;
          await blog.save();
          converted++;
        } else {
          skipped++;
        }
      } catch (err) {
        skipped++;
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${blog.slug}: ${msg}`);
      }
    }

    return NextResponse.json({
      message: "Blog image conversion completed",
      processed: blogs.length,
      converted,
      skipped,
      errors,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
