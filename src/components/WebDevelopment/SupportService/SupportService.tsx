"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import SpotlightCard from "@/components/SpotlightCard";
import "./SupportService.css";

/* ================= ANIMATIONS ================= */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const textUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const textLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ================= SCRIBBLE COUNTER ================= */

function useScribbleNumber(finalValue: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);

      if (progress < 1) {
        setValue(Math.floor(Math.random() * 99));
      } else {
        setValue(finalValue);
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [finalValue, duration]);

  return value;
}

/* ================= COMPONENT ================= */

export default function SupportSection() {
  const years = useScribbleNumber(15);
  const satisfaction = useScribbleNumber(98);

  return (
    <section className="support-section">
      {/* TITLE */}
      <motion.h2
        className="support-title"
        variants={textUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        Supported by many <br />
        companies around the world
      </motion.h2>

      {/* GRID */}
      <motion.div
        className="support-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* BIG CARD */}
        <motion.div variants={cardUp} className="support-item large">
          <SpotlightCard
            className="support-card"
            spotlightColor="rgba(199, 255, 26, 0.15)"
          >
            <span className="pill">CEO’s Words</span>

            <motion.p className="quote" variants={textLeft}>
              “Working with you was seamless from start to finish. The final
              design exceeded our expectations. Your attention to detail and
              ability to adaptable was outstanding throughout the entire
              process to the world.”
            </motion.p>

            <motion.div className="author" variants={textLeft}>
              <strong>Timofey Gr</strong>
              <span>Co Founder of Metrilo</span>
            </motion.div>

            <div className="brand">
              <img src="/logo.png" alt="disconnect" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* SMALL CARD — YEARS */}
        <motion.div variants={cardUp} className="support-item small">
          <SpotlightCard
            className="support-card"
            spotlightColor="rgba(0, 229, 255, 0.18)"
          >
            <span className="pill light">Years of experiences</span>
            <h3>{years}+</h3>
            <p>
              Delivering functional, timeless spaces with innovation,
              precision, and great design.
            </p>
          </SpotlightCard>
        </motion.div>

        {/* SMALL CARD — SATISFACTION */}
        <motion.div variants={cardUp} className="support-item small">
          <SpotlightCard
            className="support-card"
            spotlightColor="rgba(255, 255, 255, 0.12)"
          >
            <span className="pill light">Client satisfaction rate</span>
            <h3>{satisfaction}%</h3>
            <p>
              We pride ourselves on delivering excellence, reflected in the
              high satisfaction of every client.
            </p>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  );
}