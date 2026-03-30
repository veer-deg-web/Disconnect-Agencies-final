"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import styles from "./UIUXFeatures.module.css";

export default function UIUXFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-120px" });
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    setCycleKey((k: number) => k + 1);
  }, [isInView]);

  return (
    <>
      <section
        ref={sectionRef}
        className={styles.section}
      >
        <div
          key={cycleKey}
          className={`${styles.wrapper} features-wrapper`}
          style={{
            /* Key still needed for reset, but styles moved to CSS */
          }}
        >
          {/* FEATURE PILL */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={styles.featurePill}
          >
            <span className={styles.pulseDot} />
            Features
          </motion.div>

          {/* HEADING */}
          <motion.h2
            className={`${styles.heading} features-heading`}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Reasons you 
            <br /> will 
             <span className={styles.loveText}>
               {" "} love 
            </span> us.
          </motion.h2>

          {/* SUBHEADING */}
          <motion.p
            className={`${styles.subheading} features-sub`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Once you try Limitless, you’ll never go anywhere else for design.
            Seriously.
          </motion.p>

          {/* FEATURES GRID */}
          <div className={`${styles.grid} features-grid`}>
            {FEATURES.map((item, i: number) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.4 + i * 0.1,
                }}
              >
                {/* ICON */}
                <motion.div
                  whileHover={{
                    scale: 1.25,
                    filter:
                      "drop-shadow(0 0 22px rgba(255,255,255,0.85))",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                  }}
                  className={styles.iconWrapper}
                >
                  {item.icon}
                </motion.div>

                <h4 className={styles.cardTitle}>
                  {item.title}
                </h4>
                <p className={styles.cardDesc}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className={styles.ctaWrapper}
          >
            <BookCallButton />
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ---------- DATA ---------- */

const FEATURES = [
  {
    title: "Design Board",
    desc: "Request unlimited designs on your own board.",
    icon: svgIcon("board"),
  },
  {
    title: "Lightning Fast Delivery",
    desc: "Receive your designs in just a few days.",
    icon: svgIcon("speed"),
  },
  {
    title: "Fixed Rate",
    desc: "Pay the same predictable price every month.",
    icon: svgIcon("price"),
  },
  {
    title: "Award-Winning Designs",
    desc: "Top-tier creative quality that stands out.",
    icon: svgIcon("award"),
  },
  {
    title: "Unlimited Revisions",
    desc: "We revise until you’re 100% satisfied.",
    icon: svgIcon("brush"),
  },
  {
    title: "Unique & All Yours",
    desc: "Every design is crafted exclusively for you.",
    icon: svgIcon("fingerprint"),
  },
];

/* ---------- SVG ICONS ---------- */

function svgIcon(type: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="52"
      height="52"
      style={{ opacity: 0.9 }}
    >
      {type === "board" && (
        <>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M7 8h6M7 12h10" />
        </>
      )}
      {type === "speed" && (
        <>
          <circle cx="12" cy="13" r="7" />
          <path d="M12 13l4-4" />
        </>
      )}
      {type === "price" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M12 8v8" />
        </>
      )}
      {type === "award" && (
        <>
          <path d="M7 4h10v4a5 5 0 01-10 0z" />
          <path d="M12 13v7" />
        </>
      )}
      {type === "brush" && (
        <>
          <path d="M14 4l6 6" />
          <path d="M4 20c4 0 6-2 6-6" />
        </>
      )}
      {type === "fingerprint" && (
        <>
          <path d="M12 2a6 6 0 016 6v4" />
          <path d="M12 6a2 2 0 012 2v6" />
        </>
      )}
    </svg>
  );
}
