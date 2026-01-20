"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* =======================
   DATA
======================= */

const faqs = [
  {
    question: "How is Aset different?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "Is Aset suitable for beginners?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet libero consequat elementum convallis.",
  },
  {
    question: "How secure is my data and portfolio on Aset?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
  },
  {
    question: "Can I customize my investment strategy?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis ipsum.",
  },
  {
    question: "What kind of assets can I manage with Aset?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero.",
  },
];

/* =======================
   ANIMATION VARIANTS
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* MOBILE OVERRIDES — 344px SAFE */}
      <style>
        {`
          @media (max-width: 768px) {
            .faq-section {
              padding: 96px 16px !important;
            }

            .faq-heading {
              font-size: 28px !important;
              margin-bottom: 48px !important;
            }

            .faq-list {
              gap: 14px !important;
            }

            .faq-question {
              padding: 18px 18px !important;
              font-size: 15px !important;
            }

            .faq-answer-wrap {
              padding: 0 18px !important;
            }

            .faq-answer {
              font-size: 14px !important;
              line-height: 1.6 !important;
              padding-bottom: 18px !important;
            }
          }
        `}
      </style>

      <section className="faq-section" style={sectionStyle}>
        {/* HEADING */}
        <motion.h2
          className="faq-heading"
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          style={headingStyle}
        >
          FAQ
        </motion.h2>

        {/* FAQ LIST */}
        <motion.div
          className="faq-list"
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
                style={itemWrapper}
              >
                {/* QUESTION */}
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    ...questionRow,
                    color: isOpen ? "#ff5a00" : "#fff",
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
                      className="faq-answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      style={answerWrapper}
                    >
                      <p className="faq-answer" style={answerText}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </>
  );
}

/* =======================
   STYLES (DESKTOP BASE)
======================= */

const sectionStyle: React.CSSProperties = {
  padding: "160px 24px",
  background: "radial-gradient(circle at center, #141414, #000)",
  color: "#fff",
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
  border: "1px solid rgba(255,90,0,0.25)",
  borderRadius: 16,
  overflow: "hidden",
};

const questionRow: React.CSSProperties = {
  width: "100%",
  padding: "22px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
  color: "#ff5a00",
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
