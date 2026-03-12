"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Footer from "@/components/Shared/Footer/Footer";
import { sanitizeBlogHtmlContent } from "@/lib/blogSeo";

interface BlogFaq {
  question: string;
  answer: string;
}

interface BlogPost {
  _id: string;
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
  faq: BlogFaq[];
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Blog not found");
          return;
        }
        setBlog(data.blog);

        // Update page title
        if (data.blog?.metaTitle) {
          document.title = data.blog.metaTitle;
        }
        if (data.blog?.metaDescription) {
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", data.blog.metaDescription);
          }
        }
      } catch {
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <main style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#DE5E03", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          Loading...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "12px" }}>Blog Not Found</h2>
          <p style={{ marginBottom: "24px" }}>{error || "The blog post you are looking for does not exist."}</p>
          <button
            onClick={() => router.push("/blog")}
            style={{
              padding: "12px 28px",
              background: "#DE5E03",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Back to Blog
          </button>
        </div>
      </main>
    );
  }

  // Schema.org BlogPosting markup
  const articleHtml = sanitizeBlogHtmlContent(blog.content || "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.metaDescription,
    author: { "@type": "Person", name: blog.author },
    publisher: { "@type": "Organization", name: "Disconnect" },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    image: blog.featuredImage,
    url: `/blog/${blog.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${blog.slug}` },
  };

  // FAQ Schema
  const faqSchema = blog.faq && blog.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blog.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <main style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Hero */}
      <div style={{
        position: "relative", overflow: "hidden",
        paddingTop: "120px", paddingBottom: "40px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(222,94,3,0.12) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "24px", alignItems: "center" }}
          >
            <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>Home</span>
            <span>›</span>
            <span style={{ cursor: "pointer" }} onClick={() => router.push("/blog")}>Blog</span>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{blog.category}</span>
          </motion.div>

          {/* Category + Reading time */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}
          >
            <span style={{
              background: "rgba(222,94,3,0.12)",
              color: "#DE5E03",
              padding: "4px 14px",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: 500,
              border: "1px solid rgba(222,94,3,0.2)",
            }}>
              {blog.category}
            </span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              {blog.readingTime} min read
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              marginBottom: "20px",
            }}
          >
            {blog.title}
          </motion.h1>

          {/* Author + Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              display: "flex", gap: "16px", alignItems: "center",
              fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "32px",
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #DE5E03, #8a5cff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 600, fontSize: "14px",
            }}>
              {blog.author.charAt(0)}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 500 }}>{blog.author}</div>
              <div style={{ fontSize: "12px" }}>
                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            maxWidth: "900px", margin: "0 auto 48px", padding: "0 24px",
          }}
        >
          <div style={{
            borderRadius: "16px", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative", height: "400px",
          }}>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </motion.div>
      )}

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{
          maxWidth: "760px", margin: "0 auto", padding: "0 24px 60px",
        }}
      >
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
          style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontSize: "16.5px" }}
        />

        {/* Blog content styles */}
        <style>{`
          .blog-content h2 {
            font-size: 28px;
            font-weight: 700;
            color: #fff;
            margin: 48px 0 16px;
            line-height: 1.3;
          }
          .blog-content h3 {
            font-size: 22px;
            font-weight: 600;
            color: #fff;
            margin: 36px 0 12px;
            line-height: 1.3;
          }
          .blog-content p {
            margin: 0 0 20px;
          }
          .blog-content ul, .blog-content ol {
            margin: 0 0 20px;
            padding-left: 24px;
          }
          .blog-content li {
            margin-bottom: 8px;
          }
          .blog-content strong {
            color: #fff;
            font-weight: 600;
          }
          .blog-content a {
            color: #DE5E03;
            text-decoration: underline;
          }
          .blog-content blockquote {
            border-left: 3px solid #DE5E03;
            padding: 12px 20px;
            margin: 24px 0;
            background: rgba(222,94,3,0.06);
            border-radius: 0 8px 8px 0;
            font-style: italic;
            color: rgba(255,255,255,0.7);
          }
          .blog-content pre {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 20px;
            overflow-x: auto;
            margin: 24px 0;
            font-size: 14px;
            line-height: 1.6;
          }
          .blog-content code {
            background: rgba(255,255,255,0.06);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 14px;
          }
          .blog-content pre code {
            background: none;
            padding: 0;
          }
          .blog-content img {
            max-width: 100%;
            border-radius: 12px;
            margin: 24px 0;
          }
        `}</style>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap",
            marginTop: "40px", paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "100px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        {blog.faq && blog.faq.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "24px" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {blog.faq.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 500,
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {item.question}
                    <span style={{
                      transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: "18px",
                      opacity: 0.5,
                    }}>
                      ▾
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div style={{
                      padding: "0 20px 16px",
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.7,
                    }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <button
            onClick={() => router.push("/blog")}
            style={{
              padding: "12px 28px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            ← Back to All Articles
          </button>
        </div>
      </motion.article>

      <Footer />
    </main>
  );
}
