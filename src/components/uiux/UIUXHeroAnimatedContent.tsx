"use client";

import { motion } from "framer-motion";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import DynamicCity from "@/components/DynamicCity";

import styles from "./UIUXHeroAnimatedContent.module.css";

export default function UIUXHeroAnimatedContent() {
  return (
    <div className={styles.container}>
      {/* ================= BADGE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={styles.badgeWrapper}
      >
        <span className={styles.badge}>
          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
              boxShadow: [
                "0 0 6px rgba(34,197,94,0.4)",
                "0 0 14px rgba(34,197,94,1)",
                "0 0 6px rgba(34,197,94,0.4)",
              ],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={styles.pulseDot}
          />
          We Deliver Quality
        </span>
      </motion.div>

      {/* ================= HEADING ================= */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={styles.heading}
      >
        The truly{" "}
        <span className={styles.limitText}>
          Limit
        </span>
        <span className={styles.lessText}>
          less
        </span>
        <br />
        UI/UX design.
      </motion.h1>

      {/* ================= SUBTEXT ================= */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={styles.subtext}
      >
        Say goodbye to expensive freelancers, and hello to{" "}
      
          limitless,
        
        lightning fast design for teams in <DynamicCity fallback="your city" />.
      </motion.p>

      {/* ================= CTA ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <BookCallButton />
      </motion.div>
    </div>
  );
}
