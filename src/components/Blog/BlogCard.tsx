"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  summary: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, summary, date, category, image, slug }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", height: "200px", width: "100%" }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover", opacity: 0.7 }}
        />
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            padding: "4px 12px",
            borderRadius: "100px",
            fontSize: "12px",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {category}
        </div>
      </div>
      
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "8px" }}>
          {date}
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "12px", lineHeight: 1.4 }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "20px", lineHeight: 1.6, flex: 1 }}>
          {summary}
        </p>
        
        <Link 
          href={`/blog/${slug}`}
          onClick={(e) => e.preventDefault()} // For now just a placeholder
          style={{ 
            color: "#fff", 
            textDecoration: "none", 
            fontSize: "14px", 
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          Read More
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard;
