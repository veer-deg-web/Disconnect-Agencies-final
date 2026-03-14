import { NextResponse } from "next/server";
import GenerationJob from "@/models/GenerationJob";
import dbConnect from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Get latest job
    const job = await GenerationJob.findOne().sort({ updatedAt: -1 }).lean();
    
    if (!job) {
      return NextResponse.json({ message: "No jobs found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: String(job._id),
      type: job.type,
      status: job.status,
      totalBlogs: job.totalBlogs,
      processedBlogs: job.processedBlogs,
      successCount: job.successCount,
      failureCount: job.failureCount,
      currentTask: job.currentTask,
      logs: job.logs
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
