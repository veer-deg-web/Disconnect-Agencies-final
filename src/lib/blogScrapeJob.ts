import { createJob, finishJob } from "@/lib/acidJob";
import GenerationJob from "@/models/GenerationJob";
import dbConnect from "@/lib/mongodb";
import { scrapeAndRewrite } from "@/lib/blogGenerator";

export async function getBlogScrapeJobStatus() {
  await dbConnect();
  // Durability (D): Retrieve the latest job from the database
  return await GenerationJob.findOne({ type: "scrape" }).sort({ createdAt: -1 }).lean();
}

export async function startBlogScrapeJob(
  maxPages: number = 100,
  maxArticles: number = Number.MAX_SAFE_INTEGER,
  category?: string
) {
  // Isolation (I): handled by createJob internally
  const { job, lockId } = await createJob("scrape");

  // Fire and forget the worker
  void (async () => {
    try {
      const result = await scrapeAndRewrite(
        maxPages,
        maxArticles,
        undefined, // Progress now handled internally via jobId/lockId
        undefined, // TODO: Implement persistent stop request check
        category,
        job._id.toString(),
        lockId
      );

      // Finalize (A, C, D)
      await finishJob(
        job._id, 
        lockId, 
        result.stopped ? "failed" : "completed"
      );
    } catch {
      await finishJob(job._id, lockId, "failed");
      // Optionally log the error to job metadata or errors array
    }
  })();

  return job;
}

export async function requestStopBlogScrapeJob() {
  await dbConnect();
  // Isolation (I): Request stop on the active job
  return await GenerationJob.findOneAndUpdate(
    { type: "scrape", status: { $in: ["generating", "seeding"] } },
    { $set: { status: "failed", currentTask: "Stop requested" }, $push: { logs: `[${new Date().toISOString()}] Job stop requested by admin` } },
    { new: true }
  );
}
