import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_TEXT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }
  return new GoogleGenerativeAI(key);
}

function resolveGeminiModels(): string[] {
  const raw =
    process.env.GEMINI_MODELS ||
    process.env.GEMINI_MODEL_LIST ||
    process.env.BLOG_AI_MODELS ||
    DEFAULT_TEXT_MODELS.join(",");

  const list = raw
    .split(/[,\n]/)
    .map((m) => m.trim())
    .map((m) => m.replace(/^\[+/, "").replace(/\]+$/, ""))
    .map((m) => m.replace(/^['"]+/, "").replace(/['"]+$/, ""))
    .map((m) => m.replace(/^models\//i, ""))
    .map((m) => m.trim())
    .filter(Boolean);

  const allowNonText = String(process.env.BLOG_AI_ALLOW_NON_TEXT_MODELS || "").toLowerCase() === "true";
  const fallbackLimit = Math.max(1, Math.min(8, Number(process.env.BLOG_AI_MODEL_FALLBACK_LIMIT || 4)));

  const blockedHints = [
    "embedding",
    "imagen",
    "veo",
    "tts",
    "audio",
    "image",
    "computer-use",
    "robotics",
    "aqa",
    "live",
    "vision",
  ];

  const allowedPrefixes = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

  const filtered = allowNonText
    ? list
    : list.filter((m) => {
        const name = m.toLowerCase();
        const hasBlockedHint = blockedHints.some((hint) => name.includes(hint));
        const isTextModel = allowedPrefixes.some((prefix) => name.startsWith(prefix));
        return !hasBlockedHint && isTextModel;
      });

  const unique = Array.from(
    new Set((filtered.length ? filtered : DEFAULT_TEXT_MODELS).map((model) => model.trim()))
  );
  return unique.slice(0, fallbackLimit);
}

/* ── Robust JSON parser — handles messy AI output ── */
function parseAIJson(text: string) {
  // Strip markdown fences
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // noop
  }

  // Try extracting the outermost JSON object
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonStr);
    } catch {
      // noop
    }

    // Fix common issues: unescaped newlines/quotes inside strings
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

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const maybeStatus = (err as Error & { status?: number }).status;
    const maybeCause = (err as Error & { cause?: unknown }).cause;
    const parts = [err.message];

    if (typeof maybeStatus === "number") {
      parts.push(`status=${maybeStatus}`);
    }

    if (maybeCause instanceof Error) {
      parts.push(`cause=${maybeCause.message}`);
    } else if (typeof maybeCause === "string") {
      parts.push(`cause=${maybeCause}`);
    }

    return parts.join(" | ");
  }

  return String(err);
}

async function generateJsonWithFallbackModels(prompt: string) {
  const genAI = getClient();
  const models = resolveGeminiModels();

  const errors: string[] = [];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const json = parseAIJson(text);
      return json;
    } catch (err) {
      const details = getErrorMessage(err);
      console.error(`[Gemini:${modelName}] generation failed: ${details}`);
      errors.push(`${modelName}: ${details}`);
    }
  }

  throw new Error(`All configured Gemini models failed: ${errors.join(" | ")}`);
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
  "title": "New SEO-optimized title (max 60 chars)",
  "metaTitle": "Professional meta title for SEO (50-60 chars). Mention Disconnect once at most.",
  "metaDescription": "Professional meta description (140-155 chars). Mention Disconnect once at most. Never use 'agency' or 'agencies'.",
  "excerpt": "A 2-3 sentence summary of the article (max 250 chars)",
  "category": "${original.category}",
  "content": "Full HTML article content with proper h2, h3, p, ul, li tags. NEVER use h1 tags inside content. Minimum 1500 words. Do NOT use backticks or markdown — only HTML.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faq": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ],
  "author": "Disconnect Team"
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
- Minimum 1500 words of content
- Use proper HTML tags (h2, h3, p, ul, li, strong, em)
- Include code examples where relevant (wrapped in pre and code tags)
- Make it engaging with a clear introduction, body sections, and conclusion
- Do NOT use markdown or backticks — only HTML

Respond with JSON matching this schema:
{
  "title": "SEO-optimized title (max 60 chars)",
  "metaTitle": "Professional meta title for SEO (50-60 chars). Mention Disconnect once at most.",
  "metaDescription": "Professional meta description (140-155 chars). Mention Disconnect once at most. Never use 'agency' or 'agencies'.",
  "excerpt": "2-3 sentence summary (max 250 chars)",
  "category": "One of: Web Development, AI & Data, Engineering, Cloud, UI/UX Design, Mobile Development, SEO, Business",
  "content": "Full HTML article content with structured headings and paragraphs. NEVER use h1 tags inside content.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faq": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ],
  "author": "Disconnect Team"
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
