import mongoose, { Schema, Document, Model } from "mongoose";

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
    category: { type: String, required: true, index: true },
    excerpt: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    featuredImage: { type: String, default: "" },
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

const Blog: Model<IBlog> =
  (mongoose.models.Blog as Model<IBlog>) ||
  mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
