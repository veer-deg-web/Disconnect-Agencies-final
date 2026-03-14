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

/* ── Discover blog post URLs from ANY listing page ── */
export async function discoverBlogUrls(
  listingUrl: string,
  maxPages: number = 1
): Promise<string[]> {
  const urls: string[] = [];
  const targetDomain = new URL(listingUrl).hostname;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const before = urls.length;
      let pageUrl = listingUrl;
      
      if (page > 1) {
        // Common pagination patterns: /page/2, ?page=2, /p/2
        if (listingUrl.includes("?")) {
          pageUrl = `${listingUrl}&page=${page}`;
        } else {
          pageUrl = `${listingUrl.replace(/\/$/, "")}/page/${page}/`;
        }
      }

      const $ = await fetchPage(pageUrl);

      // Heuristic for finding article links
      $("article a, main a, .post-title a, h1 a, h2 a, h3 a, .entry-title a").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;

        try {
          const absoluteUrl = new URL(href, listingUrl).href;
          const urlObj = new URL(absoluteUrl);
          
          // Filter: Must be same domain, not a pagination link, and looks like a post
          if (
            urlObj.hostname === targetDomain &&
            !absoluteUrl.includes("/page/") &&
            !absoluteUrl.includes("/category/") &&
            !absoluteUrl.includes("/tag/") &&
            !absoluteUrl.includes("/author/") &&
            absoluteUrl !== listingUrl &&
            absoluteUrl.length > listingUrl.length + 5 && // Post URL usually longer than listing
            !urls.includes(absoluteUrl)
          ) {
            urls.push(absoluteUrl);
          }
        } catch {
          // Skip invalid URLs
        }
      });

      if (urls.length === before) break;
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (err) {
      console.error(`Error discovering URLs at ${listingUrl}:`, err);
      break;
    }
  }

  return [...new Set(urls)];
}

/* ── Existing hardcoded collection for xbsoftware (legacy support) ── */
export async function collectBlogUrls(
  maxPages: number = 3
): Promise<string[]> {
  return discoverBlogUrls(process.env.SCRAPER_SOURCE_URL || "https://xbsoftware.com/blog/", maxPages);
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
      "article",
      ".entry-content",
      ".post-content",
      ".article-content",
      "main",
      "#content",
      ".content",
    ];

    let content = "";
    for (const selector of contentSelectors) {
      const el = $(selector).first();
      if (el.length) {
        // Clone to avoid mutation if needed, though cheerio handles it
        const contentClone = el.clone();
        
        // Remove known noise
        contentClone.find(
          "script, style, nav, footer, header, .sidebar, .ads, .advertisement, .social-share, .related, .comments, .newsletter, .subscribe, noscript, svg, button"
        ).remove();
        
        content = contentClone.html()?.trim() || "";
        if (content.length > 500) break;
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
