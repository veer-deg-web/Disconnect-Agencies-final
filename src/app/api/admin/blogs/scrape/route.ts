import { NextRequest, NextResponse } from "next/server";
import { getBlogScrapeJobState, startBlogScrapeJob } from "@/lib/blogScrapeJob";

/* GET /api/admin/blogs/scrape — Live scrape job status */
export async function GET() {
  try {
    const job = getBlogScrapeJobState();
    return NextResponse.json({ job });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* POST /api/admin/blogs/scrape — Start "scrape all" background job */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const maxPages = Math.min(200, Math.max(1, parseInt(body.maxPages || "100")));
    const existing = getBlogScrapeJobState();
    if (existing.status === "running") {
      return NextResponse.json({
        message: "Scrape job is already running",
        started: false,
        job: existing,
      });
    }

    const job = startBlogScrapeJob(maxPages);
    return NextResponse.json({
      message: "Started scraping all blog URLs. Track live progress in this panel.",
      started: true,
      job,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
