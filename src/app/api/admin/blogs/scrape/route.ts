import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import { getBlogScrapeJobStatus, requestStopBlogScrapeJob, startBlogScrapeJob } from "@/lib/blogScrapeJob";

/* GET /api/admin/blogs/scrape — Live scrape job status */
export async function GET() {
  try {
    const job = await getBlogScrapeJobStatus();
    return NextResponse.json({ job });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* POST /api/admin/blogs/scrape — Start "scrape all" background job */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizeInput(rawBody);
    const maxPages = Math.min(200, Math.max(1, parseInt(body.maxPages || "100")));
    const maxArticles = Math.min(200, Math.max(1, parseInt(body.maxArticles || "50")));
    const category = typeof body.category === "string" ? body.category : "";

    const job = await startBlogScrapeJob(maxPages, maxArticles, category || undefined);
    return NextResponse.json({
      message: "Job started.",
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
    const job = await requestStopBlogScrapeJob();
    return NextResponse.json({
      message: job ? "Stop requested." : "No running job found.",
      stopped: !!job,
      job,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
