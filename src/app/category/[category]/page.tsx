"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Footer from "@/components/Shared/Footer/Footer";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  featuredImage: string;
  readingTime: number;
  author: string;
  createdAt: string;
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = decodeURIComponent((params?.category as string) || "");

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!category) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs?category=${encodeURIComponent(category)}&page=${page}&limit=12`);
        const data = await res.json();
        setBlogs(data.blogs || []);
        setTotalPages(data.pagination?.totalPages || 0);
      } catch {
        console.error("Failed to load category posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [category, page]);

  return (
    <main style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <div style={{
        position: "relative", overflow: "hidden",
        paddingTop: "120px", paddingBottom: "48px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(222,94,3,0.12) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", gap: "8px", justifyContent: "center",
              fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", alignItems: "center",
            }}
          >
            <span style={{ cursor: "pointer" }} onClick={() => router.push("/blog")}>Blog</span>
            <span>›</span>
            <span style={{ color: "#DE5E03" }}>{category}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 700, color: "#fff",
              lineHeight: 1.15, letterSpacing: "-0.5px",
            }}
          >
            {category}
          </motion.h1>
        </div>
      </div>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.5)" }}>
            <div style={{
              width: "32px", height: "32px", border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "#DE5E03", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            Loading...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: "18px" }}>No articles found in this category</p>
            <button
              onClick={() => router.push("/blog")}
              style={{
                marginTop: "16px", padding: "10px 24px", background: "#DE5E03",
                color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Browse All Articles
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "28px",
            }}>
              {blogs.map((post: BlogPost, i: number) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px", overflow: "hidden", cursor: "pointer",
                    transition: "border-color 0.3s", display: "flex", flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", height: "200px" }}>
                    {post.featuredImage ? (
                      <Image 
                        src={post.featuredImage} 
                        alt={post.title} 
                        width={400} 
                        height={200} 
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} 
                      />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        background: "linear-gradient(135deg, rgba(222,94,3,0.2), rgba(138,92,255,0.2))",
                      }} />
                    )}
                  </div>
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {" · "}{post.readingTime} min read
                    </div>
                    <h3 style={{
                      fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px", lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {post.title}
                    </h3>
                    <p style={{
                      fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, flex: 1,
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "48px" }}>
                <button
                  disabled={page <= 1}
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    padding: "10px 18px", borderRadius: "10px", fontSize: "13px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: page <= 1 ? "rgba(255,255,255,0.2)" : "#fff",
                    cursor: page <= 1 ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  ← Prev
                </button>
                <span style={{ padding: "10px 18px", fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    padding: "10px 18px", borderRadius: "10px", fontSize: "13px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: page >= totalPages ? "rgba(255,255,255,0.2)" : "#fff",
                    cursor: page >= totalPages ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
