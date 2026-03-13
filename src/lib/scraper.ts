import * as cheerio from "cheerio";

export interface ScrapedArticle {
  title: string;
  slug: string;
  category: string;
  author: string;
  featuredImage: string;
  content: string;
  sourceUrl: string;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/* ── Fetch a page and return parsed cheerio instance ── */
async function fetchPage(url: string, timeoutMs: number = 30000): Promise<cheerio.CheerioAPI> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": getRandomUserAgent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    return cheerio.load(html);
  } finally {
    clearTimeout(id);
  }
}

/* ── Collect all blog post URLs from the listing pages ── */
export async function collectBlogUrls(
  maxPages: number = 3
): Promise<string[]> {
  const urls: string[] = [];

  for (let page = 1; page <= maxPages; page++) {
    try {
      const before = urls.length;
      const baseUrl = process.env.SCRAPER_SOURCE_URL || "https://xbsoftware.com/blog/";
      const pageUrl =
        page === 1
          ? baseUrl
          : `${baseUrl.replace(/\/$/, "")}/page/${page}/`;

      const $ = await fetchPage(pageUrl);

      // Find article links — the blog listing uses h2 > a or article a patterns
      $("article a, .post-title a, h2 a, h3 a").each((_, el) => {
        const href = $(el).attr("href");
        if (
          href &&
          href.startsWith("https://xbsoftware.com/blog/") &&
          !href.includes("/page/") &&
          !href.includes("/author/") &&
          href !== "https://xbsoftware.com/blog/" &&
          !urls.includes(href)
        ) {
          urls.push(href);
        }
      });

      // Small delay between pages to be respectful
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stop early when the listing no longer returns any blog links.
      if (urls.length === before) {
        break;
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err);
      break;
    }
  }

  return [...new Set(urls)]; // deduplicate
}

/* ── Scrape a single blog post ── */
export async function scrapeArticle(
  url: string
): Promise<ScrapedArticle | null> {
  try {
    const $ = await fetchPage(url);

    // Extract title
    const title =
      $("h1").first().text().trim() ||
      $(".entry-title").first().text().trim() ||
      $("title").text().trim();

    if (!title) return null;

    // Extract slug from URL
    const urlParts = url.replace(/\/$/, "").split("/");
    const slug = urlParts[urlParts.length - 1] || "untitled";

    // Extract category from breadcrumbs or category tags
    const category =
      $(".category a, .post-category a, .breadcrumb a")
        .filter((_, el) => {
          const text = $(el).text().trim().toLowerCase();
          return text !== "blog" && text !== "home" && text.length > 0;
        })
        .first()
        .text()
        .trim() || "Web Development";

    // Extract author
    const author =
      $(".author-name, .post-author, [rel='author']").first().text().trim() ||
      "Disconnect Team";

    // Extract featured image
    const featuredImage =
      $(".post-thumbnail img, .featured-image img, article img")
        .first()
        .attr("src") || "";

    // Extract main content
    const contentSelectors = [
      ".entry-content",
      ".post-content",
      ".article-content",
      "article .content",
      "article",
    ];

    let content = "";
    for (const selector of contentSelectors) {
      const el = $(selector).first();
      if (el.length) {
        // Remove scripts, styles, nav, sidebar elements
        el.find(
          "script, style, nav, .sidebar, .social-share, .related-posts, .comments, .author-bio"
        ).remove();
        content = el.html()?.trim() || "";
        if (content.length > 200) break;
      }
    }

    // Fallback: collect all paragraphs
    if (content.length < 200) {
      const paras: string[] = [];
      $("article p, .content p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) {
          paras.push(`<p>${text}</p>`);
        }
      });
      content = paras.join("\n");
    }

    if (!content || content.length < 100) return null;

    return {
      title,
      slug,
      category,
      author,
      featuredImage,
      content,
      sourceUrl: url,
    };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return null;
  }
}

/* ── Scrape multiple articles ── */
export async function scrapeMultipleArticles(
  urls: string[],
  limit: number = 10
): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];
  const toScrape = urls.slice(0, limit);

  for (const url of toScrape) {
    const article = await scrapeArticle(url);
    if (article) {
      articles.push(article);
    }
    // Respectful delay between requests
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  return articles;
}
