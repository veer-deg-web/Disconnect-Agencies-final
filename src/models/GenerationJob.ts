import mongoose, { Schema, Document } from "mongoose";

export type JobType = "scrape" | "generate" | "importer";
export type JobStatus = "pending" | "generating" | "seeding" | "completed" | "failed";

export interface IGenerationJob extends Document {
  type: JobType;
  status: JobStatus;
  
  // Progress tracking
  totalBlogs: number;
  processedBlogs: number;
  successCount: number;
  failureCount: number;
  
  // Isolation (Locking)
  lockId: string | null;
  
  // Details
  currentTask: string;
  logs: string[];
  metadata: Record<string, unknown>;
  
  startedAt: Date;
  finishedAt: Date | null;
  updatedAt: Date;
}

const GenerationJobSchema: Schema = new Schema(
  {
    type: { type: String, enum: ["scrape", "generate", "importer"], required: true },
    status: { 
      type: String, 
      enum: ["pending", "generating", "seeding", "completed", "failed"],
      default: "pending" 
    },
    totalBlogs: { type: Number, default: 0 },
    processedBlogs: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    lockId: { type: String, default: null },
    currentTask: { type: String, default: "Initializing" },
    logs: [{ type: String }],
    metadata: { type: Schema.Types.Mixed, default: {} },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

GenerationJobSchema.index({ type: 1, status: 1 });
GenerationJobSchema.index({ lockId: 1 });

export default mongoose.models.GenerationJob || mongoose.model<IGenerationJob>("GenerationJob", GenerationJobSchema);
