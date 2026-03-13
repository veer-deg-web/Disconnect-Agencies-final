export const BLOG_META_TITLE_MIN = 50;
export const BLOG_META_TITLE_MAX = 60;
export const BLOG_META_DESCRIPTION_MIN = 150;
export const BLOG_META_DESCRIPTION_MAX = 160;

const DISCONNECT_SUFFIX = " | Disconnect";
const BLOG_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface BlogSeoValidationIssue {
  field:
    | "title"
    | "slug"
    | "content"
    | "excerpt"
    | "featuredImage"
    | "metaTitle"
    | "metaDescription"
    | "headings";
  severity: "error" | "warning";
  message: string;
}

export interface BlogSeoValidationInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > max * 0.7 ? sliced.slice(0, lastSpace) : sliced).replace(
    /[,\s.]+$/,
    ""
  );
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripTrailingPunctuation(text: string): string {
  return text.replace(/[,:;!.\s]+$/g, "").trim();
}

export function normalizeDisconnectBrand(text: string): string {
  if (!text) return "";
  return text
    .replace(/\bdisconnect\s+agencies\b/gi, "Disconnect")
    .replace(/\bdisconnect\s+agency\b/gi, "Disconnect");
}

function keepSingleDisconnectMention(text: string): string {
  let seen = false;
  return text.replace(/\bdisconnect\b/gi, (match) => {
    if (seen) return "we";
    seen = true;
    return match[0] === "d" ? "disconnect" : "Disconnect";
  });
}

function normalizeHeadingLevels(html: string): string {
  let currentLevel = 2;

  return html.replace(
    /<\s*(\/?)\s*h([1-6])(\b[^>]*)>/gi,
    (_match, closingSlash: string, levelText: string, rest: string) => {
      if (closingSlash) {
        return `</h${currentLevel}>`;
      }

      const originalLevel = Number(levelText);
      let nextLevel = 2;

      if (originalLevel <= 2) {
        nextLevel = 2;
      } else if (currentLevel === 2) {
        nextLevel = 3;
      } else {
        nextLevel = Math.min(3, originalLevel);
      }

      currentLevel = nextLevel;
      return `<h${nextLevel}${rest}>`;
    }
  );
}

function ensureImageAltTags(html: string, fallbackAlt: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs: string) => {
    if (/\balt\s*=/i.test(attrs)) {
      return match;
    }

    const alt = fallbackAlt
      .replace(/"/g, "&quot;")
      .trim();

    return `<img${attrs} alt="${alt}">`;
  });
}

export function sanitizeBlogHtmlContent(
  html: string,
  options?: { fallbackAlt?: string }
): string {
  if (!html) return "";

  const normalized = normalizeDisconnectBrand(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\s*h1\b/gi, "<h2")
    .replace(/<\s*\/\s*h1\s*>/gi, "</h2>");

  const withNormalizedHeadings = normalizeHeadingLevels(normalized);

  return ensureImageAltTags(
    withNormalizedHeadings,
    options?.fallbackAlt || "Blog article illustration"
  );
}

export function normalizeBlogSlug(value: string): string {
  const normalized = normalizeDisconnectBrand(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "blog-post";
}

export function isValidBlogSlug(value: string): boolean {
  return BLOG_SLUG_REGEX.test(value);
}

export function generateBlogExcerpt(input: {
  excerpt?: string;
  content?: string;
  title?: string;
}): string {
  const base = normalizeDisconnectBrand(
    collapseWhitespace(
      input.excerpt || stripHtml(input.content || "") || `${input.title || "This article"}`
    )
  );

  let excerpt = truncateAtWord(base, 220);

  if (excerpt.length < 80 && input.title) {
    excerpt = `${stripTrailingPunctuation(excerpt)}. Learn how ${input.title} impacts delivery, growth, and operational performance.`;
    excerpt = truncateAtWord(collapseWhitespace(excerpt), 220);
  }

  return excerpt;
}

export function estimateReadingTime(content: string): number {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function buildProfessionalMetaTitle(title: string, provided?: string): string {
  const base = normalizeDisconnectBrand((provided || title || "").trim())
    .replace(/\s*\|\s*disconnect\s*$/i, "")
    .trim();

  const maxBaseLength = BLOG_META_TITLE_MAX - DISCONNECT_SUFFIX.length;
  const shortBase = truncateAtWord(base || title || "Blog Article", maxBaseLength);
  const fallback = shortBase || "Blog Article";

  return `${fallback}${DISCONNECT_SUFFIX}`;
}

export function buildProfessionalMetaDescription(input: {
  provided?: string;
  excerpt?: string;
  content?: string;
  title?: string;
}): string {
  const raw = normalizeDisconnectBrand(
    collapseWhitespace(
      input.provided || input.excerpt || stripHtml(input.content || "") || ""
    )
  );

  let description = raw;

  if (!description) {
    description = `${input.title || "This article"} delivers practical strategies, implementation guidance, and lessons learned from Disconnect.`;
  }

  description = keepSingleDisconnectMention(
    description
      .replace(/\bagency\b/gi, "")
      .replace(/\bagencies\b/gi, "")
      .replace(/\s+/g, " ")
      .trim()
  );

  if (description.length < BLOG_META_DESCRIPTION_MIN) {
    const fallbackTail = " Practical takeaways, examples, and execution guidance from Disconnect.";
    description = collapseWhitespace(
      `${stripTrailingPunctuation(description)}.${fallbackTail}`
    );
  }

  description = truncateAtWord(description, BLOG_META_DESCRIPTION_MAX);

  if (!/\bdisconnect\b/i.test(description)) {
    description = truncateAtWord(
      `${stripTrailingPunctuation(description)} by Disconnect.`,
      BLOG_META_DESCRIPTION_MAX
    );
  }

  return description;
}

function extractHeadingLevels(content: string): number[] {
  const levels: number[] = [];
  const pattern = /<h([1-6])\b[^>]*>/gi;

  for (const match of content.matchAll(pattern)) {
    levels.push(Number(match[1]));
  }

  return levels;
}

export function validateBlogSeo(input: BlogSeoValidationInput): BlogSeoValidationIssue[] {
  const issues: BlogSeoValidationIssue[] = [];
  const slug = (input.slug || "").trim();
  const metaTitle = (input.metaTitle || "").trim();
  const metaDescription = (input.metaDescription || "").trim();
  const content = input.content || "";
  const headingLevels = extractHeadingLevels(content);
  const h1Count = headingLevels.filter((level) => level === 1).length;

  if (!input.title?.trim()) {
    issues.push({ field: "title", severity: "error", message: "Title is required." });
  }

  if (!slug) {
    issues.push({ field: "slug", severity: "error", message: "Slug is required." });
  } else if (!isValidBlogSlug(slug)) {
    issues.push({
      field: "slug",
      severity: "error",
      message: "Slug must be lowercase, URL friendly, and hyphenated.",
    });
  }

  if (!content.trim()) {
    issues.push({ field: "content", severity: "error", message: "Content is required." });
  }

  if (!input.excerpt?.trim()) {
    issues.push({
      field: "excerpt",
      severity: "warning",
      message: "Excerpt is missing and should be generated before publish.",
    });
  }

  if (!input.featuredImage?.trim()) {
    issues.push({
      field: "featuredImage",
      severity: "warning",
      message: "Featured image is missing.",
    });
  }

  if (
    metaTitle.length < BLOG_META_TITLE_MIN ||
    metaTitle.length > BLOG_META_TITLE_MAX
  ) {
    issues.push({
      field: "metaTitle",
      severity: "warning",
      message: `Meta title should be ${BLOG_META_TITLE_MIN}-${BLOG_META_TITLE_MAX} characters.`,
    });
  }

  if (
    metaDescription.length < BLOG_META_DESCRIPTION_MIN ||
    metaDescription.length > BLOG_META_DESCRIPTION_MAX
  ) {
    issues.push({
      field: "metaDescription",
      severity: "warning",
      message: `Meta description should be ${BLOG_META_DESCRIPTION_MIN}-${BLOG_META_DESCRIPTION_MAX} characters.`,
    });
  }

  if (h1Count > 0) {
    issues.push({
      field: "headings",
      severity: "error",
      message: "Article body should not include H1 tags; the page title is the single H1.",
    });
  }

  const nonHierarchicalHeading = headingLevels.some(
    (level, index) => index > 0 && level - headingLevels[index - 1] > 1
  );

  if (nonHierarchicalHeading) {
    issues.push({
      field: "headings",
      severity: "warning",
      message: "Headings should follow a hierarchical sequence without skipping levels.",
    });
  }

  if (headingLevels.some((level) => level > 3)) {
    issues.push({
      field: "headings",
      severity: "warning",
      message: "Article content should use only H2 and H3 headings.",
    });
  }

  return issues;
}
