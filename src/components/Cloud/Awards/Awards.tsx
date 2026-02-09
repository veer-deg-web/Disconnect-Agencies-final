"use client";

import { motion, Variants } from "framer-motion";
import "./Awards.css";

/* =========================
   VARIANTS (SLOWER)
========================= */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const rowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================
   DATA
========================= */

const awards = [
  {
    brand: "AWWWARDS",
    prize: "SOTY 2023 – 1st Winner",
    date: "MAY 2025",
  },
  {
    brand: "CSS AWWWARDS",
    prize: "Top 5 Best of eCommerce Websites 2023",
    date: "MAY 2024",
  },
  {
    brand: "STUDIO AWARDS",
    prize: "Winner – US Behance Portfolio Review 2024",
    date: "MAY 2023",
  },
  {
    brand: "D & AD AWARDS",
    prize: "SOTY 2022 – 2nd Winner",
    date: "MAY 2022",
  },
];

/* =========================
   COMPONENT
========================= */

export default function Awards() {
  return (
    <section className="aw-section">
      <motion.div
        className="aw-wrapper"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
      >
        {/* Heading */}
        <motion.div
          className="aw-heading"
          variants={rowVariants}
        >
          <span className="aw-dot">■</span> AWARDS
        </motion.div>

        {/* Column labelsitles */}
        <div className="aw-header">
          <span>Brand Name</span>
          <span>Prize Name</span>
          <span>Date</span>
        </div>

        {/* Rows */}
        <motion.div
          className="aw-table"
          variants={containerVariants}
        >
          {awards.map((award, i) => (
            <motion.div
              key={i}
              className="aw-row"
              variants={rowVariants}
            >
              <span className="aw-brand">{award.brand}</span>
              <span className="aw-prize">{award.prize}</span>
              <span className="aw-date">{award.date}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}