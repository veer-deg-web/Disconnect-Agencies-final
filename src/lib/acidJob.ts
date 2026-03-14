import GenerationJob, { JobType, JobStatus } from "@/models/GenerationJob";
import dbConnect from "@/lib/mongodb";
import { randomUUID } from "crypto";

export async function createJob(type: JobType, totalBlogs: number = 0) {
  await dbConnect();
  
  // Isolation (I): Check for existing active jobs
  const existing = await GenerationJob.findOne({ 
    type, 
    status: { $in: ["pending", "generating", "seeding"] } 
  });
  
  if (existing) {
    throw new Error(`A ${type} job is already active (Job ID: ${existing._id})`);
  }

  const lockId = randomUUID();
  const job = await GenerationJob.create([{
    type,
    status: "generating",
    totalBlogs,
    lockId,
    currentTask: `Initializing pipeline`,
    logs: [`[${new Date().toISOString()}] Job started...`],
  }]);

  return { job: job[0], lockId };
}

export async function updateJobProgress(
  jobId: string, 
  lockId: string, 
  updates: { 
    processedBlogs?: number, 
    successCount?: number, 
    failureCount?: number, 
    currentTask?: string,
    status?: JobStatus,
    log?: string,
    totalBlogs?: number
  }
) {
  const set: any = {};
  if (updates.processedBlogs !== undefined) set.processedBlogs = updates.processedBlogs;
  if (updates.successCount !== undefined) set.successCount = updates.successCount;
  if (updates.failureCount !== undefined) set.failureCount = updates.failureCount;
  if (updates.currentTask !== undefined) set.currentTask = updates.currentTask;
  if (updates.status !== undefined) set.status = updates.status;
  if (updates.totalBlogs !== undefined) set.totalBlogs = updates.totalBlogs;

  const push: any = {};
  if (updates.log) {
    push.logs = `[${new Date().toISOString()}] ${updates.log}`;
  }

  return await GenerationJob.findOneAndUpdate(
    { _id: jobId, lockId },
    { $set: set, ...(Object.keys(push).length > 0 ? { $push: push } : {}) },
    { new: true }
  );
}

export async function logJob(jobId: string, lockId: string, message: string) {
  return await GenerationJob.findOneAndUpdate(
    { _id: jobId, lockId },
    { $push: { logs: `[${new Date().toISOString()}] ${message}` } },
    { new: true }
  );
}

export async function finishJob(jobId: string, lockId: string, status: JobStatus = "completed", logMessage?: string) {
  const log = logMessage || (status === "completed" ? "Job completed successfully" : `Job finished with status: ${status}`);
  return await GenerationJob.findOneAndUpdate(
    { _id: jobId, lockId },
    { 
      $set: { 
        status, 
        lockId: null, 
        finishedAt: new Date() 
      },
      $push: { logs: `[${new Date().toISOString()}] ${log}` }
    },
    { new: true }
  );
}
