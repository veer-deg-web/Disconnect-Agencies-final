import { NextRequest, NextResponse } from "next/server";
import { getBlogScrapeJobState, requestStopBlogScrapeJob, startBlogScrapeJob } from "@/lib/blogScrapeJob";

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
    const maxArticles = Math.min(200, Math.max(1, parseInt(body.maxArticles || "50")));
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const existing = getBlogScrapeJobState();
    if (existing.status === "running" || existing.status === "stopping") {
      return NextResponse.json({
        message: "Scrape job is already running",
        started: false,
        job: existing,
      });
    }

    const job = startBlogScrapeJob(maxPages, maxArticles, category || undefined);
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

/* DELETE /api/admin/blogs/scrape — Request background scrape stop */
export async function DELETE() {
  try {
    const existing = getBlogScrapeJobState();
    if (existing.status === "stopping") {
      return NextResponse.json({
        message: "Stop already requested. Waiting for current tasks to finish.",
        stopped: true,
        job: existing,
      });
    }
    if (existing.status !== "running") {
      return NextResponse.json({
        message: "No running scrape job found",
        stopped: false,
        job: existing,
      });
    }

    const job = requestStopBlogScrapeJob();
    return NextResponse.json({
      message: "Stop requested. Waiting for current tasks to finish.",
      stopped: true,
      job,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
