"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import "./SeoServices.css";

const services = [
  {
    title: "SEO Strategy & Audits",
    description:
      "We conduct in-depth SEO audits and keyword research to identify technical issues, content gaps, and growth opportunities.",
  },
  {
    title: "On-Page & Technical SEO",
    description:
      "From technical SEO to content and on-page optimization, we implement proven strategies designed to improve rankings, traffic, and conversions.",
  },
  {
    title: "Content & Authority Building",
    description:
      "We build high-quality content and authoritative backlinks to increase trust and long-term visibility.",
  },
  {
    title: "Tracking & Optimization",
    description:
      "We continuously track performance and refine strategies to ensure consistent growth.",
  },
];

export default function SEOServicesSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="seo-services">
      {/* ================= HEADER ================= */}
      <motion.div
        className="seo-header"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="seo-label">SEO SERVICES</span>

        <h2 className="seo-title">
          Choose an SEO partner that delivers.
        </h2>

        <div className="seo-sub-row">
          <p className="seo-subtitle">
            We focus on proven strategies, data-driven execution, and measurable
            growth — not vanity metrics.
          </p>

          <button className="hire-btn">Hire now</button>
        </div>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="seo-grid">
        {/* LIST */}
        <motion.div
          className="seo-list glass"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {services.map((item, i) => {
            const open = active === i;

            return (
              <div key={i} className="seo-item">
                <button
                  className="seo-item-head"
                  onClick={() => setActive(i)}
                >
                  <h3>{item.title}</h3>

                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="arrow-icon"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="seo-item-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <p>{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="divider" />
              </div>
            );
          })}
        </motion.div>

        {/* IMAGE */}
        <motion.div
          className="seo-image glass"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <img src="/section.png" alt="SEO service visual" />
        </motion.div>
      </div>
    </section>
  );
}