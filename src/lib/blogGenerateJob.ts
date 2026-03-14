import { createJob, finishJob, updateJobProgress } from "@/lib/acidJob";
import GenerationJob from "@/models/GenerationJob";
import dbConnect from "@/lib/mongodb";
import { generateNewBlog } from "@/lib/blogGenerator";

export async function getBlogGenerateJobStatus() {
  await dbConnect();
  return await GenerationJob.findOne({ type: "generate" }).sort({ createdAt: -1 }).lean();
}

function getTopicForIndex(baseTopic: string, index: number, total: number): string | undefined {
  const trimmed = baseTopic.trim();
  if (!trimmed) return undefined;
  if (total === 1) return trimmed;
  return `${trimmed} (Part ${index + 1})`;
}

export async function runBlogGenerateJob(
  count: number,
  topic: string,
  category?: string
) {
  const total = Math.min(3, Math.max(1, count));
  const { job, lockId } = await createJob("generate", total);

  // We run this pseudo-synchronously for admin feedback, or could fire-and-forget
  // For the current API structure, we'll keep it as a sequential process
  let created = 0;
  let failed = 0;

  try {
    for (let index = 0; index < total; index += 1) {
      const scopedTopic = getTopicForIndex(topic, index, total);
      
      try {
        const result = await generateNewBlog(
          scopedTopic, 
          category, 
          job._id.toString(), 
          lockId
        );
        
        if (result.blog) {
          created += 1;
        } else {
          failed += 1;
        }

        await updateJobProgress(job._id.toString(), lockId, {
          processedBlogs: index + 1,
          successCount: created,
          failureCount: failed,
          log: result.error ? `Generation error: ${result.error}` : `Generated article: ${result.blog?.title}`,
        });

      } catch (err) {
        failed += 1;
        const msg = err instanceof Error ? err.message : "Unknown generation error";
        await updateJobProgress(job._id.toString(), lockId, {
          processedBlogs: index + 1,
          failureCount: failed,
          log: `Critical error: ${msg}`,
        });
      }
    }

    return await finishJob(job._id, lockId, failed === total ? "failed" : "completed");
  } catch (err) {
    return await finishJob(job._id, lockId, "failed", (err as Error).message);
  }
}
