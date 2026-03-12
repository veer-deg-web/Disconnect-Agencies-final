import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { rewriteArticle, generateBlogFromTopic, getRandomTopic } from "@/lib/gemini";
import { collectBlogUrls, scrapeArticle } from "@/lib/scraper";
import { ensureWebpImage } from "@/lib/blogImageWebp";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
} from "@/lib/blogSeo";

/* ── Slug helper ── */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

/* ── Ensure unique slug ── */
async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 0;
  while (await Blog.findOne({ slug })) {
    counter++;
    slug = `${base}-${counter}`;
  }
  return slug;
}

/* ── Calculate reading time ── */
function calcReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ── Featured image fallback ── */
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad86d790d798?w=800&q=80",
  "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&q=80",
];

function getRandomImage(): string {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

/* ── Truncate safely — cuts at word boundary ── */
function truncate(str: string, max: number): string {
  if (!str || str.length <= max) return str;
  const trimmed = str.substring(0, max);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > max * 0.7 ? trimmed.substring(0, lastSpace) : trimmed).replace(/[,.\s]+$/, "") + "…";
}

/* ── Sanitize AI output fields before saving ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeAIOutput(data: any): any {
  const title = normalizeDisconnectBrand(String(data.title || ""));
  const content = sanitizeBlogHtmlContent(String(data.content || ""));
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
  onProgress?: (progress: ScrapeProgress) => void
): Promise<{ created: number; skipped: number; processed: number; total: number; errors: string[] }> {
  await dbConnect();
  const errors: string[] = [];
  let created = 0;
  let skipped = 0;
  let processed = 0;

  const emit = (payload: ScrapeProgress) => {
    if (onProgress) onProgress(payload);
  };

  emit({
    phase: "collecting",
    total: 0,
    processed: 0,
    created: 0,
    skipped: 0,
  });

  // 1. Collect URLs
  const urls = await collectBlogUrls(maxPages);
  if (urls.length === 0) {
    emit({
      phase: "done",
      total: 0,
      processed: 0,
      created: 0,
      skipped: 0,
      lastError: "No blog URLs found from scraping",
    });
    return { created: 0, skipped: 0, processed: 0, total: 0, errors: ["No blog URLs found from scraping"] };
  }

  // 2. Filter out already-scraped URLs
  const existing = await Blog.find({ sourceUrl: { $in: urls } }).select("sourceUrl");
  const existingUrls = new Set(existing.map((b) => b.sourceUrl));
  const newUrls = urls.filter((u) => !existingUrls.has(u)).slice(0, maxArticles);
  const total = newUrls.length;

  if (newUrls.length === 0) {
    emit({
      phase: "done",
      total: 0,
      processed: 0,
      created: 0,
      skipped: 0,
      lastError: "All scraped articles already exist in the database",
    });
    return {
      created: 0,
      skipped: 0,
      processed: 0,
      total: 0,
      errors: ["All scraped articles already exist in the database"],
    };
  }

  emit({
    phase: "processing",
    total,
    processed,
    created,
    skipped,
  });

  // 3. Scrape + rewrite each article URL
  for (const url of newUrls) {
    try {
      const article = await scrapeArticle(url);
      if (!article) {
        skipped++;
        processed++;
        emit({
          phase: "processing",
          total,
          processed,
          created,
          skipped,
          currentUrl: url,
          lastError: "Could not parse scraped article",
        });
        continue;
      }

      const rewritten = sanitizeAIOutput(await rewriteArticle({
        title: article.title,
        content: article.content,
        category: article.category,
      }));
      const featuredImage = await ensureWebpImage(
        article.featuredImage || getRandomImage(),
        rewritten.title || article.title
      );

      const slug = await uniqueSlug(createSlug(String(rewritten.title) || article.title));

      await Blog.create({
        title: rewritten.title || article.title,
        slug,
        category: rewritten.category || article.category,
        excerpt: rewritten.excerpt || "",
        metaTitle: rewritten.metaTitle || rewritten.title || article.title,
        metaDescription: rewritten.metaDescription || "",
        featuredImage,
        content: rewritten.content || "",
        tags: rewritten.tags || [],
        readingTime: calcReadingTime(rewritten.content || ""),
        author: rewritten.author || "Disconnect Team",
        status: "published",
        source: "scraped",
        sourceUrl: article.sourceUrl,
        faq: rewritten.faq || [],
      });

      created++;
      processed++;
      emit({
        phase: "processing",
        total,
        processed,
        created,
        skipped,
        currentTitle: rewritten.title || article.title,
        currentUrl: article.sourceUrl,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to process "${url}": ${msg}`);
      skipped++;
      processed++;
      emit({
        phase: "processing",
        total,
        processed,
        created,
        skipped,
        currentUrl: url,
        lastError: msg,
      });
    }

    // Rate limit delay between AI calls
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  emit({
    phase: "done",
    total,
    processed,
    created,
    skipped,
  });

  return { created, skipped, processed, total, errors };
}

/* ── Generate a new AI blog from a topic ── */
export async function generateNewBlog(
  topic?: string
): Promise<{ blog: typeof Blog.prototype | null; error?: string }> {
  await dbConnect();

  const chosenTopic = topic || getRandomTopic();

  try {
    const generated = sanitizeAIOutput(await generateBlogFromTopic(chosenTopic));
    const featuredImage = await ensureWebpImage(getRandomImage(), generated.title || chosenTopic);

    const slug = await uniqueSlug(createSlug(String(generated.title) || chosenTopic));

    const blog = await Blog.create({
      title: generated.title || chosenTopic,
      slug,
      category: generated.category || "Web Development",
      excerpt: generated.excerpt || "",
      metaTitle: generated.metaTitle || generated.title || chosenTopic,
      metaDescription: generated.metaDescription || "",
      featuredImage,
      content: generated.content || "",
      tags: generated.tags || [],
      readingTime: calcReadingTime(generated.content || ""),
      author: generated.author || "Disconnect Team",
      status: "published",
      source: "ai-generated",
      sourceUrl: "",
      faq: generated.faq || [],
    });

    return { blog };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { blog: null, error: msg };
  }
}
