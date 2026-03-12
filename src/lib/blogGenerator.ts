import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { rewriteArticle, generateBlogFromTopic, getRandomTopic } from "@/lib/gemini";
import { collectBlogUrls, scrapeMultipleArticles, ScrapedArticle } from "@/lib/scraper";

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

/* ── Scrape + Rewrite pipeline ── */
export async function scrapeAndRewrite(
  maxPages: number = 2,
  maxArticles: number = 5
): Promise<{ created: number; errors: string[] }> {
  await dbConnect();
  const errors: string[] = [];
  let created = 0;

  // 1. Collect URLs
  const urls = await collectBlogUrls(maxPages);
  if (urls.length === 0) {
    return { created: 0, errors: ["No blog URLs found from scraping"] };
  }

  // 2. Filter out already-scraped URLs
  const existing = await Blog.find({ sourceUrl: { $in: urls } }).select("sourceUrl");
  const existingUrls = new Set(existing.map((b) => b.sourceUrl));
  const newUrls = urls.filter((u) => !existingUrls.has(u));

  if (newUrls.length === 0) {
    return { created: 0, errors: ["All scraped articles already exist in the database"] };
  }

  // 3. Scrape articles
  const articles: ScrapedArticle[] = await scrapeMultipleArticles(newUrls, maxArticles);

  // 4. Rewrite each article with AI
  for (const article of articles) {
    try {
      const rewritten = await rewriteArticle({
        title: article.title,
        content: article.content,
        category: article.category,
      });

      const slug = await uniqueSlug(createSlug(rewritten.title || article.title));

      await Blog.create({
        title: rewritten.title || article.title,
        slug,
        category: rewritten.category || article.category,
        excerpt: rewritten.excerpt || rewritten.metaDescription || "",
        metaTitle: rewritten.metaTitle || rewritten.title || article.title,
        metaDescription: rewritten.metaDescription || "",
        featuredImage: article.featuredImage || getRandomImage(),
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to process "${article.title}": ${msg}`);
    }

    // Rate limit delay between AI calls
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return { created, errors };
}

/* ── Generate a new AI blog from a topic ── */
export async function generateNewBlog(
  topic?: string
): Promise<{ blog: typeof Blog.prototype | null; error?: string }> {
  await dbConnect();

  const chosenTopic = topic || getRandomTopic();

  try {
    const generated = await generateBlogFromTopic(chosenTopic);

    const slug = await uniqueSlug(createSlug(generated.title || chosenTopic));

    const blog = await Blog.create({
      title: generated.title || chosenTopic,
      slug,
      category: generated.category || "Web Development",
      excerpt: generated.excerpt || generated.metaDescription || "",
      metaTitle: generated.metaTitle || generated.title || chosenTopic,
      metaDescription: generated.metaDescription || "",
      featuredImage: getRandomImage(),
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
