import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import { generateNewBlog } from "@/lib/blogGenerator";

/* POST /api/admin/blogs/auto-generate — Cron-triggered auto-generation */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(req.url);
    const secret =
      searchParams.get("secret") ||
      req.headers.get("x-cron-secret") ||
      "";

    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizeInput(rawBody, ["secret"]);
    const bodySecret = body.secret || "";

    const expectedSecret = process.env.CRON_SECRET || "";
    if (
      expectedSecret &&
      secret !== expectedSecret &&
      bodySecret !== expectedSecret
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a new blog with a random topic
    const result = await generateNewBlog();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      message: "Auto-generated blog published successfully",
      blog: {
        title: result.blog?.title,
        slug: result.blog?.slug,
        category: result.blog?.category,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
