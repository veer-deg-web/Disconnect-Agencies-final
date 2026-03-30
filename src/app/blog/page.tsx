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

import styles from "./BlogPage.module.css";

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
    <main className={styles.main}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        {/* Gradient background */}
        <div className={styles.gradientBg} />

        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.badge}
          >
            INSIGHTS & PERSPECTIVES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.title}
          >
            The Disconnect Journal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.subtitle}
          >
            Technical deep dives, industry insights, and engineering perspectives from the frontier of design and development.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.searchBar}
          >
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={styles.searchInput}
            />
            <button
              onClick={handleSearch}
              className={styles.searchButton}
            >
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className={styles.categoryFilter}>
          <button
            onClick={() => handleCategoryFilter("")}
            className={`${styles.categoryBtn} ${activeCategory === "" ? styles.categoryBtnActive : ""}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryFilter(cat.name)}
              className={`${styles.categoryBtn} ${activeCategory === cat.name ? styles.categoryBtnActive : ""}`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      <section className={styles.section}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            Loading articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📝</div>
            <p className={styles.emptyTitle}>
              No articles found
            </p>
            <p className={styles.emptyText}>
              {search ? "Try a different search term" : "Blog posts will appear here once published"}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {blogs.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className={styles.article}
                  whileHover={{ y: -4, borderColor: "rgba(222,94,3,0.3)" }}
                >
                  {/* Image */}
                  <div className={styles.imageWrapper}>
                    {post.featuredImage ? (
                      <div className={styles.imageContainer}>
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className={styles.articleImage}
                        />
                      </div>
                    ) : (
                      <div className={styles.placeholderImage}>📄</div>
                    )}
                    <div className={styles.categoryBadge}>
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={styles.cardContent}>
                    <div className={styles.metaInfo}>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>·</span>
                      <span>{post.readingTime} min read</span>
                    </div>

                    <h3 className={styles.articleTitle}>
                      {post.title}
                    </h3>

                    <p className={styles.articleExcerpt}>
                      {post.excerpt}
                    </p>

                    <div className={styles.articleFooter}>
                      <span className={styles.author}>
                        {post.author}
                      </span>
                      <span className={styles.readMoreLink}>
                        Read →
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className={`${styles.pageBtn} ${pagination.page <= 1 ? styles.pageBtnDisabled : ""}`}
                >
                  ← Prev
                </button>
                <span className={styles.pageInfo}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className={`${styles.pageBtn} ${pagination.page >= pagination.totalPages ? styles.pageBtnDisabled : ""}`}
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
