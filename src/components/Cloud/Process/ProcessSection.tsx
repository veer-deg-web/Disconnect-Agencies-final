"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef } from "react";
import "./ProcessSection.css";

const steps = [
  {
    id: 1,
    label: "Step 01",
    title: "Research",
    image: "/cloudStep1.png",
    text: "We listen to user stories to understand pain points and give a rough estimate of cost and timeline.",
    tag: "Discovery",
  },
  {
    id: 2,
    label: "Step 02",
    title: "Implementation",
    image: "/cloudStep2.png",
    text: "Development using modern stacks like Webflow, WordPress, iOS, and cloud-native solutions.",
    tag: "Engineering",
  },
  {
    id: 3,
    label: "Step 03",
    title: "Testing",
    image: "/cloudStep3.png",
    text: "Thorough QA testing to ensure stability, performance, and quality before launch.",
    tag: "Quality",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProcessSection() {
  const [openId, setOpenId]   = useState<number | null>(null);
  const sectionRef            = useRef<HTMLElement>(null);
  const inView                = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="ps-section">
      <div className="ps-wrapper">

        {/* ── LEFT: sticky context ── */}
        <div className="ps-left">
          <motion.span
            className="ps-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="ps-dot" /> PROCESS
          </motion.span>

          <motion.h2
            className="ps-heading"
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            A craft rich<br />
            in <span>Meaning</span>
          </motion.h2>

          {/* Active step image — crossfades between steps */}
          <div className="ps-image-stage">
            <AnimatePresence mode="wait">
              {openId !== null && (
                <motion.div
                  key={openId}
                  className="ps-image-frame"
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.04, y: -20 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <img
                    src={steps.find((s) => s.id === openId)?.image}
                    alt={steps.find((s) => s.id === openId)?.title}
                  />
                  <span className="ps-image-tag">
                    {steps.find((s) => s.id === openId)?.tag}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: accordion steps ── */}
        <div className="ps-right">
          {steps.map((step, idx) => {
            const isOpen = openId === step.id;

            return (
              <motion.div
                key={step.id}
                className={`ps-row ${isOpen ? "ps-row--open" : ""}`}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.12 + 0.2, ease: EASE }}
              >
                {/* Step rail */}
                <div className="ps-rail">
                  <motion.div
                    className="ps-rail-fill"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                </div>

                {/* Header button */}
                <button
                  className="ps-header"
                  onClick={() => setOpenId(isOpen ? null : step.id)}
                  aria-expanded={isOpen}
                >
                  <span className="ps-step-num">{step.label}</span>
                  <span className="ps-step-title">{step.title}</span>
                  <motion.span
                    className="ps-chevron"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    +
                  </motion.span>
                </button>

                {/* Expandable body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="ps-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <div className="ps-body-inner">
                        <p className="ps-body-text">{step.text}</p>
                        <span className="ps-body-tag">{step.tag}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}