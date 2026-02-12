"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";
import BookCallButton from "@/components/BookCallButton";
import ShinyText from "./ShinyText";

/* =====================
   TYPES
===================== */

type CTASectionProps = {
  gradient?: string;
  tiltGlow?: string;        // 🔥 NEW
  tiltIntensity?: number;   // 🔥 NEW
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
    transition: { duration: 0.8, ease: easeInOut },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: easeInOut },
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
    <>
      {/* MOBILE SAFE OVERRIDES */}
      <style>
        {`
          @media (max-width: 768px) {
            .cta-section {
              height: auto !important;
              padding: 80px 16px !important;
            }

            .cta-card {
              padding: 56px 20px !important;
              border-radius: 22px !important;
            }

            .cta-heading {
              font-size: 28px !important;
              line-height: 1.25 !important;
            }

            .cta-sub {
              font-size: 14px !important;
              margin-bottom: 28px !important;
            }
          }
        `}
      </style>

      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b0b0b",
        }}
      >
        <motion.div
          ref={cardRef}
          className="cta-card"
          variants={cardVariant}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          style={{
            position: "relative",
            maxWidth: "1200px",
            width: "100%",
            borderRadius: "28px",
            padding: "96px 32px",
            textAlign: "center",
            background: gradient,
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.05),
              0 40px 120px rgba(0,0,0,0.8),
              0 0 60px ${tiltGlow}40
            `,
            transition:
              "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
            transformStyle: "preserve-3d",
            overflow: "hidden",
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
              className="cta-heading"
              variants={fadeUp}
              style={{
                fontSize: "42px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "16px",
              }}
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
              className="cta-sub"
              variants={fadeUp}
              style={{
                maxWidth: "620px",
                margin: "0 auto 40px",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Harness the power of AI to grow your portfolio with confidence and
              clarity.
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <BookCallButton />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}