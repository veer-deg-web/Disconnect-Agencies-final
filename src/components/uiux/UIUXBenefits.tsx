"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BookCallButton from "@/components/BookCallButton";

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
    <>
      {/* MOBILE OVERRIDES — 344px SAFE */}
      <style>
        {`
          @media (max-width: 768px) {
            .content-grid {
              grid-template-columns: 1fr !important;
              grid-template-areas:
                "heading"
                "subtext"
                "features"
                "image";
              gap: 48px !important;
            }

            .heading-wrap {
              grid-area: heading;
            }

            .lang-heading {
              font-size: 2.2rem !important;
              line-height: 1.25 !important;
              white-space: normal !important;
            }

            .subtext {
              grid-area: subtext;
              margin-bottom: 0 !important;
            }

            .features {
              grid-area: features;
              text-align: center !important;
              display: flex !important;
              flex-direction: column;
              align-items: center;
            }

            .image-wrap {
              grid-area: image;
            }

            .mobile-image-fade,
            .image-overlay-text {
              display: block !important;
            }
          }
        `}
      </style>

      <section
        ref={sectionRef}
        style={{ padding: "20px 24px", background: "#000" }}
      >
        <div
          key={cycleKey}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* BENEFITS CAPSULE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 999,
              marginBottom: 32,
              fontSize: 13,
              color: "#d1fae5",
              backdropFilter: "blur(16px)",
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.05))",
              border: "1px solid rgba(16,185,129,0.35)",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 10px rgba(34,197,94,0.9)",
                animation: "pulse 1.6s infinite",
              }}
            />
            Benefits
          </motion.div>

          {/* HEADING */}
          <div
            className="heading-wrap"
            style={{ minHeight: "4.6rem", marginBottom: 16 }}
          >
            <AnimatePresence mode="wait">
              <motion.h2
                key={langIndex}
                className="lang-heading"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  fontSize: "clamp(2.8rem, 5vw, 4rem)",
                  lineHeight: 1.25,
                  fontWeight: 500,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {LANGUAGES[langIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* SUBTEXT */}
          <motion.p
            className="subtext"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            style={{
              maxWidth: 640,
              margin: "0 auto 96px",
              color: "#9ca3af",
              fontSize: 16,
            }}
          >
            Limitless replaces unreliable freelancers and expensive agencies for
            one flat monthly fee.
          </motion.p>

          {/* GRID */}
          <div
            className="content-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <motion.div
              className="image-wrap"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                height: 320,
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src="/uiux-preview.png"
                alt="UI UX Preview"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* MOBILE BOTTOM FADE */}
              <div
                className="mobile-image-fade"
                style={{
                  display: "none",
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)",
                  zIndex: 1,
                }}
              />

              {/* OVERLAY TEXT + STARS */}
              <motion.div
                className="image-overlay-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                style={{
                  display: "none",
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  zIndex: 2,
                  color: "#fff",
                  textAlign: "left",
                  maxWidth: 260,
                }}
              >
                <motion.div
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  style={{ marginBottom: 10 }}
                >
                  ★★★★★
                </motion.div>

                <p style={{ fontSize: 14, color: "#e5e7eb" }}>
                  UI is what users see, UX is what they feel — together they
                  create products people love.
                </p>
              </motion.div>
            </motion.div>

            {/* TEXT ROWS */}
            <motion.div className="features" style={{ textAlign: "left" }}>
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
                  style={{ marginBottom: 32 }}
                >
                  <h4 style={{ color: "#fff", marginBottom: 6, fontSize: 18 }}>
                    {title}
                  </h4>
                  <p style={{ color: "#9ca3af", fontSize: 15 }}>{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            style={{
              marginTop: 96,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BookCallButton />
          </motion.div>
        </div>

        {/* PULSE */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 0.4;
              box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 14px rgba(34, 197, 94, 1);
            }
            100% {
              opacity: 0.4;
              box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
          }
        `}</style>
      </section>
    </>
  );
}
