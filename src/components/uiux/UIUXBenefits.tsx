"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import styles from "./UIUXBenefits.module.css";

/* =======================
   HEADING LANGUAGES
 ======================= */
const LANGUAGES = [
  "빠르고 · 고품질 · 무제한.",
  "سريع · عالي الجودة · بلا حدود",
  "तेज़, गुणवत्ता और असीमित।",
  "Rápido, calidad y sin límites.",
  "Fast, quality & limitless.",
];

export default function UIUXProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-120px" });

  const [langIndex, setLangIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  /* Restart animation on scroll */
  useEffect(() => {
    if (!isInView) {
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    setLangIndex(0);
    setCycleKey((k) => k + 1);
    return () => setIsAnimating(false);
  }, [isInView]);

  /* Language cycling */
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div key={cycleKey} className={styles.container}>
        {/* BENEFITS CAPSULE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.pill}
        >
          <span className={styles.dot} />
          Benefits
        </motion.div>

        {/* HEADING */}
        <div className={styles.headingWrap}>
          <AnimatePresence mode="wait">
            <motion.h2
              key={langIndex}
              className={styles.heading}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {LANGUAGES[langIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* SUBTEXT */}
        <motion.p
          className={styles.subtext}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          Limitless replaces unreliable freelancers and expensive agencies for
          one flat monthly fee.
        </motion.p>

        {/* GRID */}
        <div className={styles.grid}>
          {/* IMAGE */}
          <motion.div
            className={styles.imageWrap}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/assets/Uiux/UIUXBenefits/photo/uiux-preview.webp"
              alt="UI UX Preview"
              fill
              className={styles.image}
            />

            {/* MOBILE BOTTOM FADE */}
            <div className={styles.mobileImageFade} />

            {/* OVERLAY TEXT + STARS */}
            <motion.div
              className={styles.imageOverlayText}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <motion.div
                className={styles.stars}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
              >
                ★★★★★
              </motion.div>

              <p className={styles.overlayParagraph}>
                UI is what users see, UX is what they feel — together they
                create products people love.
              </p>
            </motion.div>
          </motion.div>

          {/* TEXT ROWS */}
          <motion.div className={styles.features}>
            {[
              ["Submit Unlimited Requests", "Send as many requests as you want."],
              ["Manage with Disconnect", "Track everything effortlessly."],
              ["Pause Anytime", "Resume whenever you want."],
            ].map(([title, desc], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.18 }}
                className={styles.featureItem}
              >
                <h4 className={styles.featureTitle}>{title}</h4>
                <p className={styles.featureDesc}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className={styles.ctaWrapper}
        >
          <BookCallButton />
        </motion.div>
      </div>
    </section>
  );
}
