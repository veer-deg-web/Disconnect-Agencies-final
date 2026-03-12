import { NextRequest, NextResponse } from "next/server";
import { generateNewBlog } from "@/lib/blogGenerator";

/* POST /api/admin/blogs/generate — Generate blog from topic/keyword */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const topic = body.topic || body.keyword || "";

    const result = await generateNewBlog(topic || undefined);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      message: "Blog generated and published successfully",
      blog: result.blog,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
