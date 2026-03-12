import { NextRequest, NextResponse } from "next/server";
import { getBlogGenerateJobState, startBlogGenerateJob } from "@/lib/blogGenerateJob";

/* GET /api/admin/blogs/generate — Live AI generate job status */
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
    const count = Math.min(50, Math.max(1, parseInt(body.count || "1")));

    const existing = getBlogGenerateJobState();
    if (existing.status === "running") {
      return NextResponse.json({
        message: "AI generation is already running",
        started: false,
        job: existing,
      });
    }

    const job = startBlogGenerateJob(count, topic, category || undefined);
    return NextResponse.json({
      message: `Started generating ${count} AI blog(s). Track live progress in this panel.`,
      started: true,
      job,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
