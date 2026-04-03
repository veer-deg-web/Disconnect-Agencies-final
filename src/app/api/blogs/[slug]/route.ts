import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { apiError, dbSafeError, ErrorCode } from "@/lib/apiErrors";

/* GET /api/blogs/[slug] — Single blog post */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const slug = sanitizeInput(params.slug);
    const blog = await Blog.findOne({ slug, status: "published" }).lean();

    if (!blog) {
      return apiError(ErrorCode.NOT_FOUND, "Blog not found", 404);
    }

    return NextResponse.json({ blog });
  } catch (err: unknown) {
    console.error("Blog detail error:", err);
    return dbSafeError(err);
  }
}
