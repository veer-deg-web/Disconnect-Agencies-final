"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEOProcessCard from "./SeoProcessCard";
import "./SeoProcess.css";

const steps = [
  {
    step: "STEP 01",
    title: "Analyze & discover opportunities",
    description:
      "We audit your website, competitors, and keywords to uncover high-impact SEO opportunities.",
  },
  {
    step: "STEP 02",
    title: "Optimize for rankings & results",
    description:
      "From technical SEO to content and on-page optimization, we implement proven strategies.",
  },
  {
    step: "STEP 03",
    title: "Content & authority building",
    description:
      "We create authoritative content and backlinks to build long-term trust and visibility.",
  },
  {
    step: "STEP 04",
    title: "Tracking & optimization",
    description:
      "We track performance and continuously optimize for better rankings and conversions.",
  },
  {
    step: "STEP 05",
    title: "Scale sustainable growth",
    description:
      "We scale what works to drive predictable, long-term organic growth.",
  },
];

export default function SEOProcessSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const next = () => {
    if (index < steps.length - 2) {
      setDirection("right");
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection("left");
      setIndex(index - 1);
    }
  };

  const slideVariants = {
    enter: (dir: string) => ({
      x: dir === "right" ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: string) => ({
      x: dir === "right" ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section className="seo-process">
      <div className="seo-process__header">
        <span className="seo-process__label">PROCESS</span>
        <h2 className="seo-process__title">
          Your path to sustainable<br />search growth.
        </h2>
        <p className="seo-process__desc">
          We help brands cut through search noise and achieve consistent organic
          visibility with a clear, data-driven SEO process.
        </p>
      </div>

      <div className="seo-process__glass">
        <div className="seo-process__cards">

          {/* LEFT CARD (static) */}
          <SEOProcessCard {...steps[index]} />

          {/* RIGHT CARD (animated) */}
          <AnimatePresence mode="wait" custom={direction}>
            {steps[index + 1] && (
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SEOProcessCard {...steps[index + 1]} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="seo-process__controls">
          <button onClick={prev} disabled={index === 0}>←</button>

          <div className="seo-process__progress">
            <span
              style={{
                width: `${((index + 2) / steps.length) * 100}%`,
              }}
            />
          </div>

          <button
            onClick={next}
            disabled={index >= steps.length - 2}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}