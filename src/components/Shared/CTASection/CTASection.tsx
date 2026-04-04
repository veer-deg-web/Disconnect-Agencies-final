"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";
import styles from "./CTASection.module.css";

/* =====================
   TYPES
===================== */

type CTASectionProps = {
  gradient?: string;
  tiltGlow?: string;
  tiltIntensity?: number;
};

/* =====================
   ANIMATION VARIANTS
===================== */

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_SMOOTH },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_SMOOTH },
  },
};

/* =====================
   DEFAULTS
===================== */

const DEFAULT_GRADIENT =
  "radial-gradient(80% 120% at 50% 100%, #ff8c00 0%, #b94700 35%, #1a1a1a 70%, #0d0d0d 100%)";

export default function CTASection({
  gradient = DEFAULT_GRADIENT,
  tiltGlow = "#7c3aed",
  tiltIntensity = 10,
}: CTASectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -tiltIntensity;
    const rotateY = ((x - centerX) / centerX) * tiltIntensity;

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
    `;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.section
      className={styles.ctaSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      role="region"
      aria-label="Call to action"
    >
      <motion.div
        ref={cardRef}
        className={styles.ctaCard}
        variants={cardVariant}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{
          background: gradient,
          ...WILL_CHANGE_TRANSFORM,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.05),
            0 40px 120px rgba(0,0,0,0.8),
            0 0 60px ${tiltGlow}40
          `,
        }}
      >
        {/* Dynamic glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(600px circle at 50% 0%, ${tiltGlow}30, transparent 70%)`,
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />

        <motion.div variants={containerVariant}>
          <motion.h2
            className={styles.ctaHeading}
            variants={fadeUp}
          >
            <ShinyText
              text="Start Investing Smarter Today"
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
            />
          </motion.h2>

          <motion.p
            className={styles.ctaSub}
            variants={fadeUp}
          >
            Harness the power of AI to grow your portfolio with confidence and
            clarity.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <BookCallButton circleColor={tiltGlow} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}