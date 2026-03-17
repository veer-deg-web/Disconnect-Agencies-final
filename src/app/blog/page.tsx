"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
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
  tags: string[];
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CategoryItem {
  name: string;
  count: number;
}

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBlogs = async (page = 1, category = "", searchTerm = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "12");
      if (category) params.append("category", category);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
      setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 });
    } catch {
      console.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/blogs/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const handleCategoryFilter = (cat: string) => {
    const newCat = cat === activeCategory ? "" : cat;
    setActiveCategory(newCat);
    fetchBlogs(1, newCat, search);
  };

  const handleSearch = () => {
    fetchBlogs(1, activeCategory, search);
  };

  const handlePageChange = (newPage: number) => {
    fetchBlogs(newPage, activeCategory, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      {/* Hero Header */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: "120px", paddingBottom: "60px" }}>
        {/* Gradient background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(222,94,3,0.15) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-block",
              background: "rgba(222, 94, 3, 0.1)",
              color: "#DE5E03",
              padding: "6px 16px",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "24px",
              border: "1px solid rgba(222, 94, 3, 0.2)",
              letterSpacing: "0.5px",
            }}
          >
            INSIGHTS & PERSPECTIVES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 20px 0",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            The Disconnect Journal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "17px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 32px" }}
          >
            Technical deep dives, industry insights, and engineering perspectives from the frontier of design and development.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: "flex",
              gap: "8px",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                padding: "12px 18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "12px 24px",
                background: "#DE5E03",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 40px",
          padding: "0 24px",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <button
            onClick={() => handleCategoryFilter("")}
            style={{
              padding: "8px 18px",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              border: activeCategory === "" ? "1px solid #DE5E03" : "1px solid rgba(255,255,255,0.12)",
              background: activeCategory === "" ? "rgba(222,94,3,0.15)" : "rgba(255,255,255,0.04)",
              color: activeCategory === "" ? "#DE5E03" : "rgba(255,255,255,0.7)",
              transition: "all 0.2s",
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryFilter(cat.name)}
              style={{
                padding: "8px 18px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                border: activeCategory === cat.name ? "1px solid #DE5E03" : "1px solid rgba(255,255,255,0.12)",
                background: activeCategory === cat.name ? "rgba(222,94,3,0.15)" : "rgba(255,255,255,0.04)",
                color: activeCategory === cat.name ? "#DE5E03" : "rgba(255,255,255,0.7)",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.5)" }}>
            <div style={{
              width: "32px", height: "32px", border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "#DE5E03", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            Loading articles...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <p style={{ fontSize: "18px", fontWeight: 500, marginBottom: "8px", color: "rgba(255,255,255,0.6)" }}>
              No articles found
            </p>
            <p style={{ fontSize: "14px" }}>
              {search ? "Try a different search term" : "Blog posts will appear here once published"}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "28px",
            }}>
              {blogs.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  whileHover={{ y: -4, borderColor: "rgba(222,94,3,0.3)" }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    {post.featuredImage ? (
                      <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          style={{ objectFit: "cover", opacity: 0.8 }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        background: "linear-gradient(135deg, rgba(222,94,3,0.2), rgba(138,92,255,0.2))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "48px", opacity: 0.5,
                      }}>📄</div>
                    )}
                    <div style={{
                      position: "absolute", top: "12px", left: "12px",
                      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                      padding: "4px 12px", borderRadius: "100px",
                      fontSize: "11px", color: "#fff", fontWeight: 500,
                      letterSpacing: "0.3px",
                    }}>
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{
                      display: "flex", gap: "12px", fontSize: "12px",
                      color: "rgba(255,255,255,0.4)", marginBottom: "10px",
                    }}>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>·</span>
                      <span>{post.readingTime} min read</span>
                    </div>

                    <h3 style={{
                      fontSize: "18px", fontWeight: 600, color: "#fff",
                      marginBottom: "10px", lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {post.title}
                    </h3>

                    <p style={{
                      fontSize: "14px", color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.6, flex: 1, marginBottom: "16px",
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {post.excerpt}
                    </p>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
                        {post.author}
                      </span>
                      <span style={{
                        fontSize: "13px", color: "#DE5E03", fontWeight: 500,
                        display: "flex", alignItems: "center", gap: "4px",
                      }}>
                        Read →
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: "flex", justifyContent: "center", gap: "8px",
                marginTop: "48px",
              }}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  style={{
                    padding: "10px 18px", borderRadius: "10px", fontSize: "13px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: pagination.page <= 1 ? "rgba(255,255,255,0.2)" : "#fff",
                    cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Prev
                </button>
                <span style={{
                  padding: "10px 18px", fontSize: "13px", color: "rgba(255,255,255,0.5)",
                  display: "flex", alignItems: "center",
                }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  style={{
                    padding: "10px 18px", borderRadius: "10px", fontSize: "13px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: pagination.page >= pagination.totalPages ? "rgba(255,255,255,0.2)" : "#fff",
                    cursor: pagination.page >= pagination.totalPages ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
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
