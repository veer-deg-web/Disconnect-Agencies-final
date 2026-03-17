import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables if running as standalone script
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

// Mongoose models and helpers
import Blog from "../src/models/Blog";
import { updateJobProgress, logJob } from "../src/lib/acidJob";
import dbConnect from "../src/lib/mongodb";

export interface BlogJSON {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  meta_description?: string; // from AI
  category: string;
  tags: string[];
  content?: string;
  content_markdown?: string; // from AI
  status?: "published" | "draft";
  sourceUrl?: string;
  featuredImage?: string;
}

export interface BlogsData {
  blogs: BlogJSON[];
}

export async function seedBlogs(
  jsonPath: string = path.join(process.cwd(), "data", "blogs.json"),
  jobId?: string,
  lockId?: string
) {
  try {
    await dbConnect();

    if (jobId && lockId) {
      await updateJobProgress(jobId, lockId, {
        status: "seeding",
        currentTask: "Reading JSON file for seeding",
        log: `Starting seeding phase from ${jsonPath}`,
      });
    } else {
      console.log(`Starting seeding from ${jsonPath}`);
    }

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Blogs JSON file not found at ${jsonPath}`);
    }

    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(fileContent) as BlogsData;

    if (!data || !Array.isArray(data.blogs)) {
      throw new Error("Invalid valid JSON format: Expected { blogs: [...] }");
    }

    let successCount = 0;
    let failureCount = 0;

    for (const blog of data.blogs) {
      // Basic schema validation
      if (!blog.title || !blog.slug || (!blog.content && !blog.content_markdown)) {
        failureCount++;
        const err = `Validation failed for blog (missing title, slug or content): ${blog.title || "Unknown"}`;
        if (jobId && lockId) await logJob(jobId, lockId, err);
        else console.error(err);
        continue;
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Check by slug OR sourceUrl if provided
        const existingBlog = await Blog.findOne({ 
          $or: [
            { slug: blog.slug },
            ...(blog.sourceUrl ? [{ sourceUrl: blog.sourceUrl }] : [])
          ]
        }).session(session);
        
        if (existingBlog) {
          await session.abortTransaction();
          session.endSession();
          failureCount++;
          const err = `Duplicate skipped (Slug/URL collision): ${blog.slug}`;
          if (jobId && lockId) await logJob(jobId, lockId, err);
          else console.log(err);
          continue;
        }

        const metaDesc = blog.metaDescription || blog.meta_description || "";
        const finalContent = blog.content || blog.content_markdown || "";

        await Blog.create([{
          title: blog.title,
          slug: blog.slug,
          category: blog.category || "General",
          excerpt: metaDesc.substring(0, 300),
          metaTitle: blog.metaTitle || blog.title,
          metaDescription: metaDesc,
          featuredImage: blog.featuredImage || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80`,
          content: finalContent,
          tags: blog.tags || [],
          readingTime: Math.max(1, Math.ceil(finalContent.split(/\s+/).length / 200)),
          author: "Disconnect Team",
          status: blog.status || "published",
          sourceUrl: blog.sourceUrl || "",
          source: blog.sourceUrl ? "importer" : "json-seed",
        }], { session });

        await session.commitTransaction();
        session.endSession();
        successCount++;
        
        const msg = `Successfully inserted: "${blog.title}"`;
        if (jobId && lockId) await logJob(jobId, lockId, msg);
        else console.log(msg);

      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        failureCount++;
        const msg = err instanceof Error ? err.message : String(err);
        const logMsg = `Error inserting blog ${blog.slug}: ${msg}`;
        if (jobId && lockId) await logJob(jobId, lockId, logMsg);
        else console.error(logMsg);
      }
    }

    if (jobId && lockId) {
      await updateJobProgress(jobId, lockId, {
        currentTask: "Seeding complete",
        log: `Seeding complete. Inserted: ${successCount}. Skipped/Failed: ${failureCount}.`,
      });
    }

    return { successCount, failureCount };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (jobId && lockId) await logJob(jobId, lockId, `Fatal seeding error: ${msg}`);
    else console.error("Fatal seeding error:", msg);
    throw err;
  }
}

// Allow running directly from command line
if (require.main === module || process.argv[1].endsWith("seedBlogs.ts")) {
  seedBlogs()
    .then((res) => {
      console.log(`Seeding finished! Success: ${res.successCount}, Failed: ${res.failureCount}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
