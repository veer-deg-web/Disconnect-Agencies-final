"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function UIUXTutorials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px", once: false });

  return (
    <>
      {/* MOBILE OVERRIDES — 344px SAFE */}
      <style>
        {`
          @media (max-width: 768px) {
            .tutorial-grid {
              grid-template-columns: 1fr !important;
              height: auto !important;
              padding: 32px 20px !important;
              gap: 28px !important;
            }

            .tutorial-inner {
              max-width: 320px !important;
              margin: 0 auto !important;
            }

            .tutorial-video {
              width: 100% !important;
              height: 220px !important;
            }

            .tutorial-heading {
              font-size: 2rem !important;
              line-height: 1.2 !important;
            }

            .tutorial-sub {
              font-size: 1rem !important;
              margin-bottom: 20px !important;
            }

            .tutorial-desc {
              display: none !important;
            }
          }
        `}
      </style>

      <section
        ref={ref}
        style={{
          padding: "100px 24px",
          background: "#000",
          color: "#fff",
          position: "relative",
        }}
      >
        {/* GLASS CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            borderRadius: "32px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* GRID */}
          <div
            className="tutorial-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "center",
              padding: "60px",
              height: "500px",
            }}
          >
            {/* TEXT */}
            <div className="tutorial-inner">
              <motion.h2
                className="tutorial-heading"
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "Instrument-serif",
                    fontStyle: "italic",
                  }}
                >
                  Limitless
                </span>{" "}
                Tutorials
              </motion.h2>

              {/* SINGLE SUB HEADING */}
              <motion.p
                className="tutorial-sub"
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  fontSize: "1.125rem",
                  lineHeight: 1.6,
                  color: "#9ca3af",
                  marginBottom: 24,
                }}
              >
                Complimentary 8-part video series to help you get started fast.
              </motion.p>

              {/* LONG TEXT (DESKTOP ONLY) */}
              <motion.p
                className="tutorial-desc"
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "#d1d5db",
                  marginBottom: 32,
                }}
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
                style={{
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 12px 30px rgba(124,58,237,0.45)",
                }}
              >
                Know More
              </motion.button>
            </div>

            {/* VIDEO */}
            <motion.div
              className="tutorial-video tutorial-inner"
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 1.1, delay: 0.4 }}
              style={{
                position: "relative",
                height: "100%",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              >
                <source
                  src="/Limitless+Tutorial+Preview+(Square).mp4"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
