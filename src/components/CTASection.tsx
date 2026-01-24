"use client";

import React from "react";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";
import BookCallButton from "@/components/BookCallButton";
import GradientText from "./GradientText";

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

export default function CTASection() {
  return (
    <>
      {/* MOBILE OVERRIDES — 344px SAFE */}
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
          position: "relative",
        }}
      >
        {/* CARD */}
        <motion.div
          className="cta-card"
          variants={cardVariant}
          style={{
            position: "relative",
            maxWidth: "1200px",
            width: "100%",
            borderRadius: "28px",
            padding: "96px 32px",
            textAlign: "center",
            background:
              "radial-gradient(80% 120% at 50% 100%, #ff8c00 0%, #b94700 35%, #1a1a1a 70%, #0d0d0d 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05), 0 40px 120px rgba(0,0,0,0.8)",
            overflow: "hidden",
          }}
        >
          {/* GRAIN */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\"/></filter><rect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.08\"/></svg>')",
              pointerEvents: "none",
            }}
          />

          {/* CONTENT */}
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
            > <GradientText
  colors={["#5227FF","#FF9FFC","#B19EEF"]}
  animationSpeed={8}
  showBorder={false}
  className="custom-class"
>
   Start Investing Smarter Today
</GradientText>
             
            </motion.h2>

            <motion.p
              className="cta-sub"
              variants={fadeUp}
              style={{
                maxWidth: "620px",
                margin: "0 auto 40px",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.8)",
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
