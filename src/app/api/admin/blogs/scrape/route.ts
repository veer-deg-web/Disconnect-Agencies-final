import { NextRequest, NextResponse } from "next/server";
import { scrapeAndRewrite } from "@/lib/blogGenerator";

/* POST /api/admin/blogs/scrape — Trigger scrape + AI rewrite */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const maxPages = Math.min(10, parseInt(body.maxPages || "2"));
    const maxArticles = Math.min(20, parseInt(body.maxArticles || "5"));

    const result = await scrapeAndRewrite(maxPages, maxArticles);

    return NextResponse.json({
      message: `Scraped and published ${result.created} blog(s)`,
      created: result.created,
      errors: result.errors,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
