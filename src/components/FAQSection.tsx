"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ShinyText from "./ShinyText";

/* =======================
   TYPES
======================= */

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs?: FAQItem[];
  defaultOpenIndex?: number | null;
}

/* =======================
   ANIMATIONS
======================= */

const ease = [0.22, 1, 0.36, 1] as const;

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
   COMPONENT
======================= */

export default function FAQSection({
  title = "Questions?\nWe're here to assist!",
  faqs = [],
  defaultOpenIndex = 0,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    faqs.length ? defaultOpenIndex : null
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

      {/* FAQ LIST */}
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
                  ? "rgba(255, 122, 24, 0.55)"
                  : "rgba(255, 122, 24, 0.28)",
                boxShadow: isOpen
                  ? "0 0 0 1px rgba(255, 122, 24, 0.45), 0 0 24px rgba(255, 122, 24, 0.15)"
                  : "inset 0 0 0 1px rgba(255, 122, 24, 0.08)",
              }}
            >
              {/* QUESTION */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{
                  ...questionRow,
                  color: isOpen ? "#ff7a18" : "#ffffff",
                }}
              >
                <span>{faq.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.35, ease }}
                  style={iconStyle}
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
  border: "1px solid rgba(255, 122, 24, 0.28)",
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
  color: "#ff7a18",
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