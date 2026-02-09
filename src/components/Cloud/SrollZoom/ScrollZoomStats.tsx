"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import "./ScrollZoomStats.css";

const stats = [
  { label: "HAPPY CLIENTS", value: "98+" },
  { label: "OUR REVENUE", value: "200M" },
  { label: "PROJECT DONE", value: "99%" },
];

export default function ScrollZoomStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [2, 0.95]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const y = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);

  return (
    <section ref={containerRef} className="sz-container">
      <div className="sz-sticky">
        {/* Global background */}
        <motion.img
          src="/scrollzoom.png"
          className="sz-global-bg"
          style={{ scale }}
          alt=""
        />

        {/* Sections */}
        <motion.div style={{ opacity, y }} className="sz-sections">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="sz-section"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {/* Section background copy */}
              <div
                className={`sz-section-bg ${
                  active === i ? "blur" : ""
                }`}
              />

              {/* Text */}
              <div className="sz-content">
                <span className="sz-label">
                  <span className="sz-dot">■</span> {stat.label}
                </span>
                <span
                  className={`sz-value ${
                    active === i ? "active" : ""
                  }`}
                >
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}