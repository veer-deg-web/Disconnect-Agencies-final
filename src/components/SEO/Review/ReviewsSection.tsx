"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import ReviewCard from "./ReviewCard";
import { useDynamicTestimonials, DynamicTestimonial } from "@/lib/useDynamicTestimonials";
import "./Reviews.css";

interface ReviewData {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: string;
  quote: string;
}

const reviews: ReviewData[] = [
  {
    name: "Jon Bell",
    role: "Data Scientist",
    company: "Code Solutions",
    avatar: "/assets/SEO/Review/photo/Section.webp",
    rating: "9/10",
    quote:
      "The team at Talentify understood my career goals and helped me secure a fantastic role.",
  },
  {
    name: "Eniola Bakare",
    role: "Full Stack Developer",
    company: "Abstract Studio",
    avatar: "/assets/SEO/Review/photo/Section.webp",
    rating: "10/10",
    quote:
      "From start to finish, Talentify made the recruitment process super simple.",
  },
  {
    name: "Sarah Maplas",
    role: "Lead UX Designer",
    company: "Creative Studios",
    avatar: "/assets/SEO/Review/photo/Section.webp",
    rating: "8/10",
    quote:
      "Thanks to Talentify, I found a perfect remote tech role that matches my skills.",
  },
  {
    name: "Tim Chen",
    role: "Senior Software Engineer",
    company: "ABC Solutions",
    avatar: "/assets/SEO/Review/photo/Section.webp",
    rating: "9/10",
    quote:
      "Talentify helped me land my dream remote developer job in just a few weeks.",
  },
];

export default function ReviewsSection() {
  const { testimonials: dynTestimonials } = useDynamicTestimonials("SEO", true);

  const finalReviews = useMemo(() => {
    const formatted: ReviewData[] = (dynTestimonials as DynamicTestimonial[])
      .map((t: DynamicTestimonial): ReviewData => ({
        name: t.user.name,
        role: t.position || 'Verified Customer',
        company: t.company || 'User',
        avatar: t.user.avatar || "/assets/SEO/Review/photo/Section.webp",
        rating: `${t.rating || 10}/10`,
        quote: t.content
      }))
      .slice(0, 4);
    return formatted.length > 0 ? formatted : reviews; // Dummy fallback if empty
  }, [dynTestimonials]);

  return (
    <section className="seo-reviews-section">
      {/* HEADER */}
      <motion.div
        className="seo-reviews-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="seo-label">TESTIMONIALS</span>
        <h2>Reviews by our <br />Happy Clients</h2>
        <p>
          Hear from professionals who’ve found their perfect role through us.
        </p>
      </motion.div>

      {/* GRID */}
      <motion.div
        className="seo-reviews-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {finalReviews.map((review: ReviewData, i: number) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <ReviewCard {...review} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}