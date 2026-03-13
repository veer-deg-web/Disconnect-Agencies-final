import {
  BlogSeoValidationIssue,
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  estimateReadingTime,
  generateBlogExcerpt,
  normalizeBlogSlug,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
  validateBlogSeo,
} from "@/lib/blogSeo";

export interface RawBlogImport {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string | Date;
  author?: string;
  status?: "draft" | "published";
  source?: "scraped" | "ai-generated" | "manual";
  sourceUrl?: string;
  faq?: Array<{ question?: string; answer?: string }>;
}

export interface PreparedBlogImport {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  author: string;
  readingTime: number;
  status: "draft" | "published";
  source: "scraped" | "ai-generated" | "manual";
  sourceUrl?: string;
  faq: Array<{ question: string; answer: string }>;
}

export interface PreparedBlogResult {
  blog: PreparedBlogImport;
  issues: BlogSeoValidationIssue[];
}

export function prepareBlogImport(input: RawBlogImport): PreparedBlogResult {
  const title = normalizeDisconnectBrand(String(input.title || "").trim());
  const sanitizedContent = sanitizeBlogHtmlContent(String(input.content || ""), {
    fallbackAlt: title || "Blog article illustration",
  });
  const excerpt = generateBlogExcerpt({
    excerpt: String(input.excerpt || ""),
    content: sanitizedContent,
    title,
  });
  const slug = normalizeBlogSlug(String(input.slug || title));
  const metaTitle = buildProfessionalMetaTitle(title, String(input.metaTitle || ""));
  const metaDescription = buildProfessionalMetaDescription({
    provided: String(input.metaDescription || ""),
    excerpt,
    content: sanitizedContent,
    title,
  });

  const blog: PreparedBlogImport = {
    title,
    slug,
    content: sanitizedContent,
    excerpt,
    featuredImage:
      String(input.featuredImage || "").trim() ||
      "/uploads/blogs/blog-featured-placeholder.webp",
    category: normalizeDisconnectBrand(String(input.category || "General").trim()) || "General",
    tags: Array.isArray(input.tags)
      ? input.tags
          .map((tag) => normalizeDisconnectBrand(String(tag || "").trim()))
          .filter(Boolean)
      : [],
    metaTitle,
    metaDescription,
    createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
    author: normalizeDisconnectBrand(String(input.author || "Disconnect Team").trim()),
    readingTime: estimateReadingTime(sanitizedContent),
    status: input.status === "draft" ? "draft" : "published",
    source:
      input.source === "scraped" || input.source === "manual"
        ? input.source
        : "ai-generated",
    sourceUrl: input.sourceUrl ? String(input.sourceUrl).trim() : undefined,
    faq: Array.isArray(input.faq)
      ? input.faq
          .map((item) => ({
            question: normalizeDisconnectBrand(String(item?.question || "").trim()),
            answer: normalizeDisconnectBrand(String(item?.answer || "").trim()),
          }))
          .filter((item) => item.question && item.answer)
      : [],
  };

  const issues = validateBlogSeo(blog);

  if (Number.isNaN(blog.createdAt.getTime())) {
    issues.push({
      field: "content",
      severity: "error",
      message: "createdAt must be a valid date.",
    });
  }

  return { blog, issues };
}
