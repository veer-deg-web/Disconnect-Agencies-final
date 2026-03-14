import { aiClient } from "./ai/ai-client";

const DEFAULT_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];
const RESOLVED_MODELS = (process.env.GEMINI_MODELS || "")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);
const MODEL_NAMES = RESOLVED_MODELS.length > 0 ? RESOLVED_MODELS : DEFAULT_MODELS;
const BLOG_AI_MODEL_FALLBACK_LIMIT = Math.max(
  1,
  Math.min(MODEL_NAMES.length, Number(process.env.BLOG_AI_MODEL_FALLBACK_LIMIT || MODEL_NAMES.length))
);

/* ── Robust JSON parser — handles messy AI output ── */
function parseAIJson(text: string) {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // noop
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonStr);
    } catch {
      // noop
    }

    const fixed = jsonStr
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    try {
      return JSON.parse(fixed);
    } catch {
      // noop
    }
  }

  throw new Error("Failed to parse AI response as JSON");
}

async function generateJsonWithFallbackModels(prompt: string) {
  const modelsToTry = MODEL_NAMES.slice(0, BLOG_AI_MODEL_FALLBACK_LIMIT);
  const failures: string[] = [];

  for (const modelName of modelsToTry) {
    try {
      const response = await aiClient.request({
        model: modelName,
        prompt,
        responseMimeType: "application/json",
        temperature: 0.6,
        cache: true
      });

      return parseAIJson(response.text);
    } catch (err) {
      const details = err instanceof Error ? err.message : String(err);
      failures.push(`${modelName}: ${details}`);
      console.error(`[Gemini:${modelName}] request failed: ${details}`);
    }
  }

  throw new Error(`Configured Gemini models failed. ${failures.join(" || ")}`);
}

/* ── Rewrite an existing article ── */
export async function rewriteArticle(original: {
  title: string;
  content: string;
  category: string;
}) {
  const prompt = `You are a senior SEO content writer for "Disconnect".

Rewrite the following article COMPLETELY — new structure, new sentences, new examples. 
Keep the CORE TOPIC the same but shift the perspective to the Disconnect voice.
Make the content unique, engaging, and SEO-optimized.

ORIGINAL TITLE: ${original.title}
ORIGINAL CATEGORY: ${original.category}
ORIGINAL CONTENT:
${original.content.substring(0, 8000)}

Respond with JSON matching this schema:
{
  "title": "New SEO-optimized title",
  "category": "${original.category}",
  "content": "Full HTML article content with proper h2, h3, p, ul, li tags. NEVER use h1 tags. Keep it between 900 and 1200 words. Do NOT use markdown or backticks.",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "faq": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ]
}`;

  return generateJsonWithFallbackModels(prompt);
}

/* ── Specialized rewrite for Import Pipeline ── */
export async function rewriteForImport(original: {
  title: string;
  content: string;
  category: string;
}) {
  const prompt = `You are an expert SEO blog writer and structured data generator.
Your task is to REWRITE the following article completely. 

RULES:
1. Output MUST be valid JSON.
2. The tone should be human-readable, professional, and informative.
3. Use H2 and H3 headings for structure.
4. The article must be a minimum of 1000 words.
5. Completely rewrite the content to avoid plagiarism while maintaining the original meaning.
6. Use markdown for the content.

ORIGINAL TITLE: ${original.title}
ORIGINAL CATEGORY: ${original.category}
ORIGINAL CONTENT:
${original.content.substring(0, 10000)}

Respond ONLY with JSON matching this schema:
{
  "title": "A catchy, SEO-friendly human title",
  "slug": "seo-friendly-url-slug",
  "meta_description": "140-160 character meta description",
  "content_markdown": "The full article in markdown format (min 1000 words). Use ## and ### for headings.",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  return generateJsonWithFallbackModels(prompt);
}

/* ── Generate a completely new blog from a topic ── */
export async function generateBlogFromTopic(topic: string) {
  const prompt = `You are a senior SEO content writer for "Disconnect", specializing in web development, app development, UI/UX, AI, cloud, and SEO.

Write a COMPLETELY NEW, original, SEO-optimized blog post about: "${topic}"

Requirements:
- Write in first-person plural (we/our) from the Disconnect perspective
- Include practical insights, statistics, and actionable advice
- Keep the article between 900 and 1200 words
- Use proper HTML tags (h2, h3, p, ul, li, strong, em)
- Make it engaging with a clear introduction, body sections, and conclusion
- Do NOT use markdown or backticks — only HTML

Respond with JSON matching this schema:
{
  "title": "SEO-optimized title",
  "category": "One of: Web Development, AI & Data, Engineering, Cloud, UI/UX Design, Mobile Development, SEO, Business",
  "content": "Full HTML article content with structured headings and paragraphs. NEVER use h1 tags inside content.",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "faq": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ]
}`;

  return generateJsonWithFallbackModels(prompt);
}

/* ── Trending topics pool for auto-generation ── */
const TOPIC_POOL = [
  "How AI is Transforming Custom Software Development in 2026",
  "Micro-Frontend Architecture: Scaling Large Web Applications",
  "The Rise of Edge Computing and Its Impact on Web Performance",
  "Building Accessible Web Applications: A Developer's Guide",
  "Serverless vs Containers: Which Is Right for Your Next Project",
  "Design Systems That Scale: Lessons from Building Enterprise UIs",
  "How to Integrate AI Chatbots Into Your Web Application",
  "Progressive Web Apps vs Native Apps: The 2026 Perspective",
  "Real-Time Data Pipelines: From Kafka to the Browser",
  "The Future of No-Code and Low-Code Platforms for Enterprises",
  "GraphQL vs REST in 2026: Making the Right API Choice",
  "Cloud Cost Optimization: Strategies That Actually Work",
  "Building Multi-Tenant SaaS Applications with Next.js",
  "Headless CMS Architecture for Modern Content Delivery",
  "DevSecOps: Integrating Security Into Your CI/CD Pipeline",
  "React Server Components: A Deep Dive for Production Apps",
  "How to Build a Scalable Notification System",
  "SEO for Single Page Applications: Advanced Strategies",
  "Mobile-First Design Principles for Enterprise Applications",
  "Implementing Real-Time Collaboration Features in Web Apps",
  "The Complete Guide to Web Application Performance Monitoring",
  "AI-Powered Analytics: Turning Raw Data Into Business Insights",
  "Kubernetes for Small Teams: A Practical Getting Started Guide",
  "Building Secure Authentication Systems in Modern Web Apps",
  "Cross-Platform Development with React Native and Expo",
  "Data Visualization Best Practices for Enterprise Dashboards",
  "API Gateway Patterns for Microservices Architecture",
  "Automated Testing Strategies for Complex Web Applications",
  "Building High-Performance E-Commerce Platforms",
  "The Role of WebAssembly in Modern Web Development",
];

export function getRandomTopic(): string {
  return TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];
}
