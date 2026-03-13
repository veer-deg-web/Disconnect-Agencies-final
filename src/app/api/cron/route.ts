import { NextRequest, NextResponse } from "next/server";
import { generateNewBlog, scrapeAndRewrite } from "@/lib/blogGenerator";

/**
 * Vercel Cron handler: POST /api/cron
 * Expected Search Params:
 * - task: "generate" | "scrape" (default: "generate")
 * - secret: must match process.env.CRON_SECRET
 * - limit: number of articles for scrape (default: 1)
 */

export const maxDuration = 300; // Extend to 5 minutes for AI processing if supported by plan
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret") || req.headers.get("Authorization")?.replace("Bearer ", "");
  
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    console.error("Cron Error: Unauthorized attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = searchParams.get("task") || "generate";
  console.log(`Cron Triggered: task=${task}`);

  try {
    if (task === "generate") {
      const result = await generateNewBlog();
      if (result.error) throw new Error(result.error);
      
      console.log(`Cron Success: Generated blog "${result.blog?.title}"`);
      return NextResponse.json({ 
        success: true, 
        message: "Blog generated successfully",
        blog: { title: result.blog?.title, slug: result.blog?.slug }
      });
    }

    if (task === "scrape") {
      const limit = Math.min(5, Math.max(1, parseInt(searchParams.get("limit") || "1")));
      console.log(`Cron Info: Starting scrape task with limit=${limit}`);
      
      const result = await scrapeAndRewrite(1, limit);
      
      console.log(`Cron Success: Scraped and processed ${result.created} articles`);
      return NextResponse.json({ 
        success: true, 
        processed: result.processed, 
        created: result.created,
        errors: result.errors 
      });
    }

    return NextResponse.json({ error: "Invalid task" }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown cron failure";
    console.error(`Cron Failure [${task}]:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
