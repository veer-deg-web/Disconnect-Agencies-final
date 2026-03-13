import { NextRequest, NextResponse } from "next/server";
import { getBlogGenerateJobState, runBlogGenerateJob } from "@/lib/blogGenerateJob";

/* GET /api/admin/blogs/generate — Live AI generate job status */
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const job = getBlogGenerateJobState();
    return NextResponse.json({ job });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* POST /api/admin/blogs/generate — Start AI blog generation background job */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const topic = String(body.topic || body.keyword || "");
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const count = Math.min(3, Math.max(1, parseInt(body.count || "1")));

    const existing = getBlogGenerateJobState();
    if (existing.status === "running") {
      return NextResponse.json({
        message: "AI generation is already running",
        started: false,
        job: existing,
      });
    }

    const job = await runBlogGenerateJob(count, topic, category || undefined);
    return NextResponse.json({
      message: `Generated ${job.created} AI blog(s) with ${job.failed} failure(s).`,
      started: false,
      job,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
