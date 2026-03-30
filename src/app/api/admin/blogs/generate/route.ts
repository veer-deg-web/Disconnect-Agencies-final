import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import { getBlogGenerateJobStatus, runBlogGenerateJob } from "@/lib/blogGenerateJob";

/* GET /api/admin/blogs/generate — Live AI generate job status */
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const job = await getBlogGenerateJobStatus();
    return NextResponse.json({ job });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* POST /api/admin/blogs/generate — Start AI blog generation background job */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizeInput(rawBody);
    const topic = String(body.topic || body.keyword || "");
    const category = typeof body.category === "string" ? body.category : "";
    const count = Math.min(3, Math.max(1, parseInt(body.count || "1")));

    const job = await runBlogGenerateJob(count, topic, category || undefined);
    return NextResponse.json({
      message: `Job started/finished.`,
      job,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
