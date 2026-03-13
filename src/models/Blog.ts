import mongoose, { Schema, Document, Model } from "mongoose";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  estimateReadingTime,
  generateBlogExcerpt,
  normalizeBlogSlug,
  normalizeDisconnectBrand,
  sanitizeBlogHtmlContent,
} from "@/lib/blogSeo";

export interface IBlogFaq {
  question: string;
  answer: string;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  content: string;
  tags: string[];
  readingTime: number;
  author: string;
  status: "draft" | "published";
  source: "scraped" | "ai-generated" | "manual";
  sourceUrl?: string;
  faq: IBlogFaq[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogFaqSchema = new Schema<IBlogFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true, default: "General" },
    excerpt: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    featuredImage: {
      type: String,
      default: "/uploads/blogs/blog-featured-placeholder.webp",
    },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    readingTime: { type: Number, default: 5 },
    author: { type: String, default: "Disconnect Team" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    source: {
      type: String,
      enum: ["scraped", "ai-generated", "manual"],
      default: "manual",
    },
    sourceUrl: { type: String, default: "" },
    faq: { type: [BlogFaqSchema], default: [] },
  },
  { timestamps: true }
);

// Text index for search
BlogSchema.index({ title: "text", excerpt: "text", tags: "text" });

BlogSchema.pre("validate", function normalizeBlogDocument() {
  this.title = normalizeDisconnectBrand(String(this.title || "").trim());
  this.slug = normalizeBlogSlug(String(this.slug || this.title || ""));
  this.category = normalizeDisconnectBrand(String(this.category || "General").trim());
  this.content = sanitizeBlogHtmlContent(String(this.content || ""), {
    fallbackAlt: this.title || "Blog article illustration",
  });
  this.excerpt = generateBlogExcerpt({
    excerpt: String(this.excerpt || ""),
    content: this.content,
    title: this.title,
  });
  this.metaTitle = buildProfessionalMetaTitle(
    this.title,
    String(this.metaTitle || "")
  );
  this.metaDescription = buildProfessionalMetaDescription({
    provided: String(this.metaDescription || ""),
    excerpt: this.excerpt,
    content: this.content,
    title: this.title,
  });
  this.featuredImage =
    String(this.featuredImage || "").trim() ||
    "/uploads/blogs/blog-featured-placeholder.webp";
  this.tags = Array.isArray(this.tags)
    ? this.tags
        .map((tag) => normalizeDisconnectBrand(String(tag || "").trim()))
        .filter(Boolean)
    : [];
  this.author = normalizeDisconnectBrand(String(this.author || "Disconnect Team"));
  this.readingTime = estimateReadingTime(this.content);
  this.faq = Array.isArray(this.faq)
    ? this.faq
        .map((item) => ({
          question: normalizeDisconnectBrand(String(item?.question || "").trim()),
          answer: normalizeDisconnectBrand(String(item?.answer || "").trim()),
        }))
        .filter((item) => item.question && item.answer)
    : [];

});

const Blog: Model<IBlog> =
  (mongoose.models.Blog as Model<IBlog>) ||
  mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
