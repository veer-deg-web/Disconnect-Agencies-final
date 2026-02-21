"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ShinyText from "./ShinyText";
import { EASE_SMOOTH } from "@/lib/animations";
import { useFaq } from "@/lib/useFaq";

/* =======================
   TYPES
======================= */

type FaqCategory = "general" | "cloud" | "all";

interface FAQSectionProps {
  /** Which FAQs to load from the backend. Defaults to "general". */
  category?: FaqCategory;
  title?: string;
  defaultOpenIndex?: number | null;
  accentColor?: string;
}

/* =======================
   ANIMATIONS
======================= */

const ease = EASE_SMOOTH;

const headingVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

const listVariant = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.12,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

/* =======================
   SKELETON LOADER
======================= */

function FaqSkeleton({ accentColor }: { accentColor: string }) {
  return (
    <div style={listStyle}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            ...itemWrapper,
            borderColor: `${accentColor}22`,
            padding: "22px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 16,
              borderRadius: 8,
              background: `linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 100%)`,
              backgroundSize: "200% 100%",
              animation: "faq-shimmer 1.4s infinite",
              width: `${55 + i * 7}%`,
            }}
          />
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes faq-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* =======================
   COMPONENT
======================= */

export default function FAQSection({
  category = "general",
  title = "Questions?\nWe're here to assist!",
  defaultOpenIndex = 0,
  accentColor = "#ff7a18",
}: FAQSectionProps) {
  const { faqs, loading, error } = useFaq(category);

  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex
  );

  return (
    <section className="faq-section" style={sectionStyle}>
      {/* TITLE */}
      <motion.h2
        variants={headingVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        style={{ ...headingStyle, whiteSpace: "pre-line" }}
      >
        <ShinyText
          text={title}
          speed={2}
          color="#b5b5b5"
          shineColor="#ffffff"
          spread={120}
        />
      </motion.h2>

      {/* LOADING SKELETON */}
      {loading && <FaqSkeleton accentColor={accentColor} />}

      {/* ERROR */}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "rgba(255,100,100,0.7)", fontSize: 14 }}>
          Failed to load FAQs. Please try again later.
        </p>
      )}

      {/* FAQ LIST */}
      {!loading && !error && (
      <motion.div
        variants={listVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        style={listStyle}
      >
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={faq.question}
              variants={itemVariant}
              style={{
                ...itemWrapper,
                borderColor: isOpen
                  ? `${accentColor}88`
                  : `${accentColor}44`,
                boxShadow: isOpen
                  ? `0 0 0 1px ${accentColor}88, 0 0 24px ${accentColor}33`
                  : `inset 0 0 0 1px ${accentColor}22`,
              }}
            >
              {/* QUESTION */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{
                  ...questionRow,
                  color: isOpen ? accentColor : "#ffffff",
                }}
              >
                <span>{faq.question}</span>

                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.35, ease }}
                  style={{
                    ...iconStyle,
                    color: accentColor,
                  }}
                >
                  {isOpen ? "−" : "+"}
                </motion.span>
              </button>

              {/* ANSWER */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                    style={answerWrapper}
                  >
                    <p style={answerText}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
      )}
    </section>
  );
}

/* =======================
   STYLES
======================= */

const sectionStyle: React.CSSProperties = {
  padding: "160px 24px",
  background: "radial-gradient(circle at center, #141414, #000)",
};

const headingStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "clamp(36px, 5vw, 52px)",
  fontWeight: 700,
  marginBottom: 80,
};

const listStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const itemWrapper: React.CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
  border: "1px solid",
  borderRadius: 16,
  overflow: "hidden",
};

const questionRow: React.CSSProperties = {
  width: "100%",
  padding: "22px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 500,
  textAlign: "left",
};

const iconStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
};

const answerWrapper: React.CSSProperties = {
  overflow: "hidden",
  padding: "0 24px",
};

const answerText: React.CSSProperties = {
  paddingBottom: 22,
  fontSize: 15,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.75)",
};