"use client";

import { motion, Variants } from "framer-motion";
import "./MoreAboutSection.css";

/* =========================
   VARIANTS (TYPED)
========================= */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // ✅ NOW VALID
    },
  },
};

/* =========================
   IMAGE SOURCES
========================= */

const cards = [
  "/moreaboutus1.png",
  "/moreaboutus2.png",
  "/scrollzoom.png",
  "/moreaboutus4.png",
];

/* =========================
   COMPONENT
========================= */

export default function MoreAboutSection() {
  return (
    <section className="ma-section">
      {/* MASTER CONTROLLER */}
      <motion.div
        className="ma-wrapper"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
      >
        {/* Heading */}
        <motion.div
          className="ma-heading"
          variants={itemVariants}
        >
          <span className="ma-dot">■</span> MORE ABOUT US
        </motion.div>

        {/* GRID */}
        <motion.div
          className="ma-grid"
          variants={containerVariants}
        >
          {cards.map((src, i) => (
            <motion.div
              key={i}
              className="ma-card"
              variants={itemVariants}
            >
              <img
                src={src}
                alt=""
                className="ma-image"
              />
              <div className="ma-overlay" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}