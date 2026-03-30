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

import styles from "./BlogCard.module.css";

const BlogCard: React.FC<BlogCardProps> = ({ title, summary, date, category, image, slug }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
        />
        <div className={styles.categoryPill}>
          {category}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.date}>
          {date}
        </div>
        <h3 className={styles.title}>
          {title}
        </h3>
        <p className={styles.summary}>
          {summary}
        </p>
        
        <Link 
          href={`/blog/${slug}`}
          onClick={(e) => e.preventDefault()} // For now just a placeholder
          className={styles.link}
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
