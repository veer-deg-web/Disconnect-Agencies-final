"use client";

import { motion } from "framer-motion";
import ReviewCard from "./ReviewCard";
import "./Reviews.css";

const reviews = [
  {
    name: "Jon Bell",
    role: "Data Scientist",
    company: "Code Solutions",
    avatar: "/Section.png",
    rating: "9/10",
    quote:
      "The team at Talentify understood my career goals and helped me secure a fantastic role.",
  },
  {
    name: "Eniola Bakare",
    role: "Full Stack Developer",
    company: "Abstract Studio",
    avatar: "/Section.png",
    rating: "10/10",
    quote:
      "From start to finish, Talentify made the recruitment process super simple.",
  },
  {
    name: "Sarah Maplas",
    role: "Lead UX Designer",
    company: "Creative Studios",
    avatar: "/Section.png",
    rating: "8/10",
    quote:
      "Thanks to Talentify, I found a perfect remote tech role that matches my skills.",
  },
  {
    name: "Tim Chen",
    role: "Senior Software Engineer",
    company: "ABC Solutions",
    avatar: "/Section.png",
    rating: "9/10",
    quote:
      "Talentify helped me land my dream remote developer job in just a few weeks.",
  },
];

export default function ReviewsSection() {
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
        {reviews.map((review, i) => (
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