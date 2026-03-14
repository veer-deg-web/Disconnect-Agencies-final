import fs from "fs";
import path from "path";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { seedBlogs } from "../../scripts/seedBlogs";
import { rewriteArticle, generateBlogFromTopic, getRandomTopic, rewriteForImport } from "@/lib/gemini";
import { collectBlogUrls, scrapeArticle, discoverBlogUrls } from "@/lib/scraper";
import { ensureWebpImage } from "@/lib/blogImageWebp";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
} from "@/lib/blogSeo";
import { updateJobProgress, logJob } from "@/lib/acidJob";
import {
  createSlug,
  getTopicImage,
  sleep,
  withRetry,
} from "@/lib/utils";

const AI_RETRY_COUNT = Math.max(1, Math.min(4, Number(process.env.BLOG_AI_RETRY_COUNT || 3)));

/* ── Sanitize AI output fields before saving ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeAIOutput(data: any): any {
  const title = normalizeDisconnectBrand(String(data.title || ""));
  const content = sanitizeBlogHtmlContent(String(data.content || ""));
  
  function truncate(str: string, max: number): string {
    if (!str || str.length <= max) return str;
    const trimmed = str.substring(0, max);
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace > max * 0.7 ? trimmed.substring(0, lastSpace) : trimmed).replace(/[,.\s]+$/, "") + "…";
  }

  const excerpt = truncate(
    normalizeDisconnectBrand(String(data.excerpt || data.metaDescription || "")),
    295
  );

  return {
    ...data,
    title,
    content,
    excerpt,
    metaTitle: buildProfessionalMetaTitle(title, String(data.metaTitle || "")),
    metaDescription: buildProfessionalMetaDescription({
      provided: String(data.metaDescription || ""),
      excerpt,
      content,
      title,
    }),
  };
}

export async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 0;
  while (await Blog.findOne({ slug })) {
    counter++;
    slug = `${base}-${counter}`;
  }
  return slug;
}

/* ── Scrape + Rewrite pipeline ── */
export interface ScrapeProgress {
  phase: "collecting" | "processing" | "done";
  total: number;
  processed: number;
  created: number;
  skipped: number;
  currentTitle?: string;
  currentUrl?: string;
  lastError?: string;
}

export async function scrapeAndRewrite(
  maxPages: number = 100,
  maxArticles: number = Number.MAX_SAFE_INTEGER,
  onProgress?: (progress: ScrapeProgress) => void,
  shouldStop?: () => boolean,
  categoryOverride?: string,
  acidJobId?: string,
  lockId?: string
): Promise<{ created: number; skipped: number; processed: number; total: number; errors: string[]; stopped: boolean }> {
  await dbConnect();
  const errors: string[] = [];
  let created = 0;
  let skipped = 0;
  let processed = 0;

  const emit = (payload: ScrapeProgress) => {
    if (onProgress) onProgress(payload);
    if (acidJobId && lockId) {
      updateJobProgress(acidJobId, lockId, {
        status: payload.phase === "done" ? "seeding" : "generating",
        totalBlogs: payload.total,
        processedBlogs: payload.processed,
        successCount: payload.created,
        failureCount: payload.skipped,
        currentTask: payload.currentTitle || payload.currentUrl || payload.phase,
        log: payload.lastError ? `Error: ${payload.lastError}` : undefined
      });
    }
  };

  const generatedBlogs: any[] = [];

  emit({ phase: "collecting", total: 0, processed: 0, created: 0, skipped: 0 });
  if (acidJobId && lockId) await logJob(acidJobId, lockId, "Starting scraping phase...");

  // 1. Collect URLs
  const urls = await collectBlogUrls(maxPages);
  if (urls.length === 0) {
    const err = "No blog URLs found from scraping";
    emit({ phase: "done", total: 0, processed: 0, created: 0, skipped: 0, lastError: err });
    return { created: 0, skipped: 0, processed: 0, total: 0, errors: [err], stopped: false };
  }

  // 2. Filter out already-scraped URLs
  const existing = await Blog.find({ sourceUrl: { $in: urls } }).select("sourceUrl");
  const existingUrls = new Set(existing.map((b) => b.sourceUrl));
  const newUrls = urls.filter((u) => !existingUrls.has(u)).slice(0, maxArticles);
  const total = newUrls.length;

  if (total === 0) {
    const err = "All scraped articles already exist in the database";
    emit({ phase: "done", total: 0, processed: 0, created: 0, skipped: 0, lastError: err });
    return { created: 0, skipped: 0, processed: 0, total: 0, errors: [err], stopped: false };
  }

  emit({ phase: "processing", total, processed: 0, created: 0, skipped: 0 });
  if (acidJobId && lockId) await logJob(acidJobId, lockId, `Found ${total} new URLs to process.`);

  // 3. Sequential Processing for ACID stability and rate-limiting
  for (const url of newUrls) {
    if (shouldStop && shouldStop()) {
      if (acidJobId && lockId) await logJob(acidJobId, lockId, "Stop requested by admin. Stopping...");
      break;
    }

    processed += 1;
    try {
      const scraped = await scrapeArticle(url);
      if (!scraped || !scraped.content) {
        skipped += 1;
        errors.push(`Failed to scrape: ${url}`);
        if (acidJobId && lockId) await logJob(acidJobId, lockId, `Failed to scrape content from: ${url}`);
        continue;
      }

      emit({ phase: "processing", total, processed, created, skipped, currentUrl: url, currentTitle: scraped.title });

      if (acidJobId && lockId) await logJob(acidJobId, lockId, `Rewriting article: "${scraped.title || url}"`);

      // AI Rewrite with retries
      const generatedRaw = await withRetry(() => rewriteArticle(scraped), AI_RETRY_COUNT);
      if (!generatedRaw || !generatedRaw.content) {
        skipped += 1;
        errors.push(`AI skipped or failed for: ${scraped.title}`);
        continue;
      }

      const generated = sanitizeAIOutput(generatedRaw);
      const category = categoryOverride || generated.category || "Web Development";
      const imageSource = scraped.featuredImage || getTopicImage(generated.title, category);
      
      const featuredImage = await ensureWebpImage(imageSource, generated.title)
        .catch(() => scraped.featuredImage || imageSource);

      // Task 2, 3: Push to array instead of DB directly
      const baseSlug = createSlug(generated.title);
      const slug = await uniqueSlug(baseSlug);

      generatedBlogs.push({
        title: generated.title,
        slug,
        category,
        excerpt: generated.excerpt,
        metaTitle: generated.metaTitle,
        metaDescription: generated.metaDescription,
        featuredImage,
        content: generated.content,
        tags: generated.tags || [],
      });

      created += 1;
      if (acidJobId && lockId) await logJob(acidJobId, lockId, `Generated JSON for: "${generated.title}"`);

      emit({ phase: "processing", total, processed, created, skipped });
      await sleep(3000); // Rate limit protection

    } catch (err) {
      skipped += 1;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Error at ${url}: ${msg}`);
      if (acidJobId && lockId) await logJob(acidJobId, lockId, `Error processing ${url}: ${msg}`);
      emit({ phase: "processing", total, processed, created, skipped, lastError: msg });
    }
  }

  // Write JSON file first
  const jsonPath = path.join(process.cwd(), "data", "blogs.json");
  fs.writeFileSync(jsonPath, JSON.stringify({ blogs: generatedBlogs }, null, 2));
  if (acidJobId && lockId) await logJob(acidJobId, lockId, `Saved ${generatedBlogs.length} blogs to data/blogs.json`);

  // Call the seed script
  let finalCreated = 0;
  let finalSkipped = skipped;
  try {
    const seedResult = await seedBlogs(jsonPath, acidJobId, lockId);
    finalCreated = seedResult.successCount;
    finalSkipped += seedResult.failureCount;
  } catch (err) {
    errors.push(`Seeding failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const stopped = !!(shouldStop && shouldStop());
  emit({ phase: "done", total, processed, created: finalCreated, skipped: finalSkipped });

  return { created: finalCreated, skipped: finalSkipped, processed, total, errors, stopped };
}

/* ── Generate a new AI blog from a topic ── */
export async function generateNewBlog(
  topic?: string,
  category?: string,
  acidJobId?: string,
  lockId?: string
): Promise<{ blog: typeof Blog.prototype | null; error?: string }> {
  await dbConnect();
  const chosenTopic = topic || getRandomTopic();

  if (acidJobId && lockId) {
    await updateJobProgress(acidJobId, lockId, {
      currentTask: `Generating: ${chosenTopic}`,
      status: "generating",
      log: `Starting AI generation for topic: "${chosenTopic}"`
    });
  }

  // Instead of starting a transaction and saving directly:
  try {
    const generatedRaw = await withRetry(() => generateBlogFromTopic(chosenTopic), AI_RETRY_COUNT);
    if (!generatedRaw || !generatedRaw.content || generatedRaw.content.length < 500) {
      throw new Error("AI output validation failed: Content too short or empty");
    }

    if (acidJobId && lockId) await logJob(acidJobId, lockId, `AI output generated for "${generatedRaw.title || chosenTopic}"`);

    const generated = sanitizeAIOutput(generatedRaw);
    const finalCategory = (category && category.trim()) || generated.category || "Web Development";
    const imageSource = getTopicImage(chosenTopic, finalCategory);
    
    const featuredImage = await ensureWebpImage(imageSource, generated.title || chosenTopic)
      .catch(() => imageSource);

    const baseSlug = createSlug(generated.title || chosenTopic);
    const slug = await uniqueSlug(baseSlug);

    const blogJSON = {
      title: generated.title || chosenTopic,
      slug,
      category: finalCategory,
      excerpt: generated.excerpt || "",
      metaTitle: generated.metaTitle || generated.title || chosenTopic,
      metaDescription: generated.metaDescription || "",
      featuredImage,
      content: generated.content || "",
      tags: generated.tags || [],
    };

    const jsonPath = path.join(process.cwd(), "data", "blogs.json");
    fs.writeFileSync(jsonPath, JSON.stringify({ blogs: [blogJSON] }, null, 2));

    if (acidJobId && lockId) await logJob(acidJobId, lockId, `Blog saved to data/blogs.json: "${generated.title}"`);
    
    // Call seed
    const seedResult = await seedBlogs(jsonPath, acidJobId, lockId);
    if (seedResult.successCount === 0) {
      return { blog: null, error: `Failed to insert blog during seeding phase` };
    }

    // Ideally we would return the inserted blog, but returning a stub for now
    const existingBlog = await Blog.findOne({ slug });
    await sleep(5000); // Cooldown
    return { blog: existingBlog };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (acidJobId && lockId) await logJob(acidJobId, lockId, `Generation error [Topic: ${chosenTopic}]: ${msg}`);
    return { blog: null, error: msg };
  }
}

/* ── Admin Blog Importer Pipeline ── */
export async function importFromExternalUrl(
  listingUrl: string,
  categoryOverride?: string,
  maxPages: number = 1,
  limit: number = 20,
  acidJobId?: string,
  lockId?: string
) {
  await dbConnect();
  const errors: string[] = [];
  let processed = 0;
  let created = 0;
  let skipped = 0;

  const emit = (phase: "generating" | "seeding", currentTask: string, log?: string) => {
    if (acidJobId && lockId) {
      updateJobProgress(acidJobId, lockId, {
        status: phase,
        processedBlogs: processed,
        successCount: created,
        failureCount: skipped,
        currentTask,
        log
      });
    }
  };

  try {
    emit("generating", "Discovering blog URLs...");
    if (acidJobId && lockId) await logJob(acidJobId, lockId, `Target listing: ${listingUrl}`);

    // 1. Discovery
    const urls = await discoverBlogUrls(listingUrl, maxPages);
    if (urls.length === 0) {
      throw new Error("No article URLs discovered at the provided listing.");
    }
    
    // 2. Filter existing
    const existing = await Blog.find({ sourceUrl: { $in: urls } }).select("sourceUrl");
    const existingUrls = new Set(existing.map(b => b.sourceUrl));
    const newUrls = urls.filter(u => !existingUrls.has(u)).slice(0, limit);
    
    skipped += (urls.length - newUrls.length);
    if (newUrls.length === 0) {
      throw new Error("All discovered URLs are already imported.");
    }

    if (acidJobId && lockId) {
      await updateJobProgress(acidJobId, lockId, { totalBlogs: newUrls.length });
      await logJob(acidJobId, lockId, `Found ${newUrls.length} new articles to import.`);
    }

    const importerBlogs: any[] = [];

    // 3. Sequential Process (Scrape -> AI -> metadata)
    for (const url of newUrls) {
      processed++;
      emit("generating", `Scraping: ${url}`);
      
      try {
        const scraped = await scrapeArticle(url);
        if (!scraped || !scraped.content) {
          skipped++;
          errors.push(`Scrape failed for: ${url}`);
          continue;
        }

        emit("generating", `Rewriting with AI: ${scraped.title}`);
        const aiOutput = await rewriteForImport({
          title: scraped.title,
          content: scraped.content,
          category: categoryOverride || scraped.category
        });

        importerBlogs.push({
          ...aiOutput,
          category: categoryOverride || scraped.category,
          sourceUrl: url,
          status: "draft",
          featuredImage: scraped.featuredImage || ""
        });

        created++;
        if (acidJobId && lockId) await logJob(acidJobId, lockId, `Successfully processed [AI]: ${scraped.title}`);
        
      } catch (err) {
        skipped++;
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Error processing ${url}: ${msg}`);
        if (acidJobId && lockId) await logJob(acidJobId, lockId, `Failed: ${url} - ${msg}`);
      }
    }

    // 4. Write to JSON
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    const jsonPath = path.join(dataDir, "blogs.json");
    fs.writeFileSync(jsonPath, JSON.stringify({ blogs: importerBlogs }, null, 2));
    
    if (acidJobId && lockId) await logJob(acidJobId, lockId, `Wrote ${importerBlogs.length} blogs to intermediate JSON. Starting seed...`);

    // 5. Seed
    const seedResult = await seedBlogs(jsonPath, acidJobId, lockId);
    
    return {
      total: urls.length,
      processed,
      created: seedResult.successCount,
      skipped,
      errors
    };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (acidJobId && lockId) await logJob(acidJobId, lockId, `Import fatal error: ${msg}`);
    throw err;
  }
}
