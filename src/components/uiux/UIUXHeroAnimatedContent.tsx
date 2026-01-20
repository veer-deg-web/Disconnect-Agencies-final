"use client";

import { motion } from "framer-motion";
import BookCallButton from "@/components/BookCallButton";

export default function UIUXHeroAnimatedContent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        color: "#ffffff",
        padding: "0 16px",
      }}
    >
      {/* ================= BADGE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: "clamp(20px, 5vw, 32px)" }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: "clamp(12px, 3.5vw, 14px)",
            color: "#e5e5e5",
          }}
        >
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
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
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
        style={{
          fontSize: "clamp(2.2rem, 9vw, 5.5rem)",
          lineHeight: 1.08,
          marginBottom: "clamp(16px, 4vw, 24px)",
          fontWeight: 500,
        }}
      >
        The truly{" "}
        <span
          style={{
            opacity: 0.45,
            fontFamily: "instrument-serif",
            fontStyle: "italic",
          }}
        >
          Limit
        </span>
        <span
          style={{
            opacity: 1,
            fontFamily: "instrument-serif",
            fontStyle: "italic",
          }}
        >
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
        style={{
          maxWidth: "520px",
          color: "#b3b3b3",
          marginBottom: "clamp(28px, 6vw, 40px)",
          fontSize: "clamp(14px, 4vw, 16px)",
        }}
      >
        Say goodbye to expensive freelancers, and hello to{" "}
        <span
          style={{
            fontFamily: '"Instrument Serif", serif',
          }}
        >
          limitless,
        </span>{" "}
        lightning fast design.
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
