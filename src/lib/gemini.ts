import { GoogleGenerativeAI } from "@google/generative-ai";

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }
  return new GoogleGenerativeAI(key);
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

/* ── Rewrite an existing article ── */
export async function rewriteArticle(original: {
  title: string;
  content: string;
  category: string;
}) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are a senior SEO content writer for "Disconnect", a premium full-service design and development agency.

Rewrite the following article COMPLETELY — new structure, new sentences, new examples. 
Keep the CORE TOPIC the same but shift the perspective to the Disconnect agency voice.
Make the content unique, engaging, and SEO-optimized.

ORIGINAL TITLE: ${original.title}
ORIGINAL CATEGORY: ${original.category}
ORIGINAL CONTENT:
${original.content.substring(0, 8000)}

Respond with JSON matching this schema:
{
  "title": "New SEO-optimized title (max 60 chars)",
  "metaTitle": "Meta title for SEO (max 60 chars)",
  "metaDescription": "Compelling meta description (max 155 chars)",
  "excerpt": "A 2-3 sentence summary of the article (max 250 chars)",
  "category": "${original.category}",
  "content": "Full HTML article content with proper h2, h3, p, ul, li tags. Minimum 1500 words. Do NOT use backticks or markdown — only HTML.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faq": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ],
  "author": "Disconnect Team"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJson(text);
}

/* ── Generate a completely new blog from a topic ── */
export async function generateBlogFromTopic(topic: string) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are a senior SEO content writer for "Disconnect", a premium full-service design and development agency specializing in web development, app development, UI/UX, AI, cloud, and SEO.

Write a COMPLETELY NEW, original, SEO-optimized blog post about: "${topic}"

Requirements:
- Write in first-person plural (we/our) from the Disconnect agency perspective
- Include practical insights, statistics, and actionable advice
- Minimum 1500 words of content
- Use proper HTML tags (h2, h3, p, ul, li, strong, em)
- Include code examples where relevant (wrapped in pre and code tags)
- Make it engaging with a clear introduction, body sections, and conclusion
- Do NOT use markdown or backticks — only HTML

Respond with JSON matching this schema:
{
  "title": "SEO-optimized title (max 60 chars)",
  "metaTitle": "Meta title for SEO (max 60 chars)",
  "metaDescription": "Compelling meta description (max 155 chars)",
  "excerpt": "2-3 sentence summary (max 250 chars)",
  "category": "One of: Web Development, AI & Data, Engineering, Cloud, UI/UX Design, Mobile Development, SEO, Business",
  "content": "Full HTML article content with structured headings and paragraphs",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faq": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ],
  "author": "Disconnect Team"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJson(text);
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
