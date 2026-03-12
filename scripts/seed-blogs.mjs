/**
 * Seed script — Scrapes xbsoftware.com blogs, rewrites via Gemini AI, and saves to MongoDB.
 * Usage: node scripts/seed-blogs.mjs
 * Requires: dev server running on localhost:3000  OR  direct MongoDB access
 */

const BLOG_URLS = [
  "https://xbsoftware.com/blog/telegram-mini-app-development/",
  "https://xbsoftware.com/blog/ai-in-construction/",
  "https://xbsoftware.com/blog/spec-driven-development-ai-assisted-software-engineering/",
  "https://xbsoftware.com/blog/custom-data-driven-platforms-for-business-decisions/",
  "https://xbsoftware.com/blog/top-app-modernization-companies-usa/",
  "https://xbsoftware.com/blog/general-purpose-ai-vs-medical-ai/",
  "https://xbsoftware.com/blog/ai-assisted-saas-development-estimation-guide/",
  "https://xbsoftware.com/blog/software-architecture-strategic-investment/",
  "https://xbsoftware.com/blog/speeding-up-front-end-development-with-webix/",
  "https://xbsoftware.com/blog/reactjs-vs-react-native/",
  "https://xbsoftware.com/blog/top-healthcare-software-development-companies-usa/",
  "https://xbsoftware.com/blog/custom-construction-energy-software-development/",
];

const CATEGORIES = [
  "Web Development",
  "AI & Data",
  "Mobile Development",
  "Cloud & DevOps",
  "UI/UX Design",
  "Engineering",
  "SEO & Marketing",
  "Business Strategy",
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad86d790d798?w=800&q=80",
  "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
];

// ── Load env ──
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

let GEMINI_API_KEY = "";
let MONGODB_URI = "";

try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("GEMINI_API_KEY=")) {
      GEMINI_API_KEY = trimmed.split("=").slice(1).join("=");
    }
    if (trimmed.startsWith("MONGODB_URI=")) {
      MONGODB_URI = trimmed.split("=").slice(1).join("=");
    }
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
  console.error("❌ GEMINI_API_KEY is not configured in .env.local");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not configured in .env.local");
  process.exit(1);
}

console.log("✅ Loaded env vars");
console.log(`   Gemini key: ${GEMINI_API_KEY.substring(0, 12)}...`);
console.log(`   MongoDB: ${MONGODB_URI.substring(0, 30)}...`);

// ── Dynamic imports ──
const { default: mongoose } = await import("mongoose");
const { GoogleGenerativeAI } = await import("@google/generative-ai");

// ── Connect to MongoDB ──
console.log("\n📦 Connecting to MongoDB...");
await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB");

// ── Blog Schema (inline to avoid TS import issues) ──
const BlogFaqSchema = new mongoose.Schema({ question: String, answer: String }, { _id: false });
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    metaTitle: String,
    metaDescription: String,
    featuredImage: { type: String, default: "" },
    content: { type: String, required: true },
    tags: [String],
    readingTime: { type: Number, default: 5 },
    author: { type: String, default: "Disconnect Team" },
    status: { type: String, default: "published" },
    source: { type: String, default: "scraped" },
    sourceUrl: String,
    faq: [BlogFaqSchema],
  },
  { timestamps: true }
);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// ── Gemini client ──
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ── Scrape a single page ──
async function scrapePage(url) {
  console.log(`  🔍 Scraping ${url}`);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  if (!res.ok) {
    console.log(`  ❌ Failed: ${res.status}`);
    return null;
  }
  const html = await res.text();

  // Extract title
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

  // Extract content from .entry-content or article
  let content = "";
  const contentMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (contentMatch) {
    content = contentMatch[1];
  } else {
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) content = articleMatch[1];
  }

  // Clean content
  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .trim();

  // Extract text for word count
  const textContent = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (!title || textContent.length < 100) {
    console.log(`  ⚠️  Skipped (no content): ${url}`);
    return null;
  }

  const slug = url.replace(/\/$/, "").split("/").pop();

  return { title, content: textContent.substring(0, 6000), slug, sourceUrl: url };
}

// ── Rewrite with Gemini ──
async function rewriteWithGemini(article) {
  console.log(`  🤖 Rewriting: "${article.title.substring(0, 50)}..."`);

  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const prompt = `You are a senior SEO content writer for "Disconnect", a premium full-service design and development agency specializing in web dev, AI, cloud, and SEO.

Rewrite this article COMPLETELY — new structure, new sentences, unique perspective from the Disconnect agency voice.

ORIGINAL TITLE: ${article.title}
ORIGINAL CONTENT: ${article.content.substring(0, 5000)}

Return ONLY valid JSON (no markdown fences, no backticks) with this structure:
{
  "title": "SEO title (max 60 chars)",
  "metaTitle": "Meta title (max 60 chars)",
  "metaDescription": "Meta description (max 155 chars)",
  "excerpt": "2-3 sentence summary (max 250 chars)",
  "category": "${category}",
  "content": "Full HTML article (h2, h3, p, ul, li tags, minimum 800 words)",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "faq": [
    {"question":"Q1?","answer":"A1"},
    {"question":"Q2?","answer":"A2"},
    {"question":"Q3?","answer":"A3"}
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    // Try direct parse first
    try {
      return JSON.parse(cleaned);
    } catch {
      // Try extracting JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error("No valid JSON found");
    }
  } catch (err) {
    console.log(`  ❌ AI rewrite failed: ${err.message}`);
    return null;
  }
}

// ── Main ──
async function main() {
  console.log(`\n🚀 Starting seed process with ${BLOG_URLS.length} URLs...\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < BLOG_URLS.length; i++) {
    const url = BLOG_URLS[i];
    console.log(`\n[${i + 1}/${BLOG_URLS.length}] Processing...`);

    // Check if already exists
    const existing = await Blog.findOne({ sourceUrl: url });
    if (existing) {
      console.log(`  ⏭️  Already exists — skipping`);
      skipped++;
      continue;
    }

    // Scrape
    const scraped = await scrapePage(url);
    if (!scraped) {
      failed++;
      continue;
    }

    // Rewrite
    const rewritten = await rewriteWithGemini(scraped);
    if (!rewritten) {
      failed++;
      continue;
    }

    // Generate unique slug
    let slug = (rewritten.title || scraped.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 80);
    let counter = 0;
    while (await Blog.findOne({ slug })) {
      counter++;
      slug = `${slug.replace(/-\d+$/, "")}-${counter}`;
    }

    // Calculate reading time
    const wordCount = (rewritten.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).length;
    const readingTime = Math.max(3, Math.ceil(wordCount / 200));

    // Save
    try {
      await Blog.create({
        title: rewritten.title || scraped.title,
        slug,
        category: rewritten.category || "Web Development",
        excerpt: rewritten.excerpt || rewritten.metaDescription || scraped.title,
        metaTitle: rewritten.metaTitle || rewritten.title || scraped.title,
        metaDescription: rewritten.metaDescription || rewritten.excerpt || "",
        featuredImage: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        content: rewritten.content || "",
        tags: rewritten.tags || [],
        readingTime,
        author: "Disconnect Team",
        status: "published",
        source: "scraped",
        sourceUrl: url,
        faq: rewritten.faq || [],
      });
      console.log(`  ✅ Saved: "${(rewritten.title || scraped.title).substring(0, 50)}..."`);
      created++;
    } catch (err) {
      console.log(`  ❌ Save failed: ${err.message}`);
      failed++;
    }

    // Rate limit (Gemini has request limits)
    if (i < BLOG_URLS.length - 1) {
      console.log("  ⏱️  Waiting 3s (rate limit)...");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`✅ Seed complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`${"═".repeat(50)}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
