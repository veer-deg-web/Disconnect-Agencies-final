import { NextResponse } from "next/server";
import GenerationJob from "@/models/GenerationJob";
import dbConnect from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Get latest job for either scrape or generate
    const job = await GenerationJob.findOne().sort({ updatedAt: -1 }).lean();
    
    if (!job) {
      return NextResponse.json({ message: "No jobs found" }, { status: 404 });
    }

    return NextResponse.json({
      status: job.status,
      processedBlogs: job.processedBlogs,
      totalBlogs: job.totalBlogs,
      successCount: job.successCount,
      failureCount: job.failureCount,
      logs: job.logs,
      currentTask: job.currentTask,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
