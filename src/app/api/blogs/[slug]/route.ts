import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

/* GET /api/blogs/[slug] — Single blog post */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug: params.slug, status: "published" }).lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
