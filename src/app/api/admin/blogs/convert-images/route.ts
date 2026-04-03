export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { ensureWebpImage } from "@/lib/blogImageWebp";
import { verifyAdminToken } from "@/lib/adminAuth";
import { apiError, dbSafeError, ErrorCode } from "@/lib/apiErrors";

/* POST /api/admin/blogs/convert-images — Backfill existing featured images to webp */
export async function POST(req: NextRequest) {
  // 🔴 SECURITY FIX: Was previously unprotected
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizeInput(rawBody);
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

    const response = NextResponse.json({
      message: "Blog image conversion completed",
      processed: blogs.length,
      converted,
      skipped,
      errors,
    });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    console.error("CONVERT IMAGES ERROR:", err);
    return dbSafeError(err);
  }
}
