"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./UIUXTutorials.module.css";

export default function UIUXTutorials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px", once: false });

  return (
    <section ref={ref} className={styles.section}>
      {/* GLASS CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className={styles.glassContainer}
      >
        {/* GRID */}
        <div className={styles.grid}>
          {/* TEXT */}
          <div className={styles.inner}>
            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.italicText}>Limitless</span> Tutorials
            </motion.h2>

            {/* SINGLE SUB HEADING */}
            <motion.p
              className={styles.subHeading}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Complimentary 8-part video series to help you get started fast.
            </motion.p>

            {/* LONG TEXT (DESKTOP ONLY) */}
            <motion.p
              className={styles.description}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Master every aspect of the template with our comprehensive video
              guides — from basic setup to advanced customizations.
            </motion.p>

            {/* BUTTON */}
            <motion.button
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(124,58,237,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              className={styles.button}
            >
              Know More
            </motion.button>
          </div>

          {/* VIDEO */}
          <motion.div
            className={`${styles.videoContainer} ${styles.inner}`}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 1.1, delay: 0.4 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.video}
            >
              <source
                src="/assets/Uiux/UIUXTutorials/video/Limitless+Tutorial+Preview+(Square).mp4"
                type="video/mp4"
              />
            </video>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
