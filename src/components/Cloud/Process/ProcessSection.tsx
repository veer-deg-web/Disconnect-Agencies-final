"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./ProcessSection.css";

const steps = [
  {
    id: 1,
    label: "Step 1",
    title: "Research",
    image: "/cloudStep1.png",
    text:
      "We listen to user stories to understand pain points and give a rough estimate of cost and timeline.",
  },
  {
    id: 2,
    label: "Step 2",
    title: "Implementation",
    image: "/cloudStep2.png",
    text:
      "Development using modern stacks like Webflow, WordPress, iOS, and cloud-native solutions.",
  },
  {
    id: 3,
    label: "Step 3",
    title: "Testing",
    image: "/cloudStep3.png",
    text:
      "Thorough QA testing to ensure stability, performance, and quality before launch.",
  },
];

export default function ProcessSection() {
  const [openSteps, setOpenSteps] = useState<number[]>([]);

  const toggleStep = (id: number) => {
    setOpenSteps((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="process-section">
      <div className="process-wrapper">
        {/* LEFT COLUMN */}
        <div className="process-left">
          {/* ✅ STICKY LABEL (CONSTRAINED) */}
          <div className="process-label-fixed">
            <span className="process-label">
              <span className="dot" /> PROCESS
            </span>
          </div>

          <motion.h2
            className="process-heading"
            initial={{ opacity: 0, filter: "blur(10px)", y: 12 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            A color rich in <span>Meaning</span>
          </motion.h2>
        </div>

        {/* RIGHT COLUMN */}
        <div className="process-right">
          {steps.map((step) => {
            const isOpen = openSteps.includes(step.id);

            return (
              <div key={step.id} className="process-row">
                {/* STEP RAIL */}
                <div className="process-step-rail">
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="process-step-rail-active"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        exit={{ height: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* HEADER */}
                <motion.button
                  className={`process-row-header ${
                    isOpen ? "active" : ""
                  }`}
                  onClick={() => toggleStep(step.id)}
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: step.id * 0.08,
                  }}
                >
                  <span className="row-dot" />
                  <span className="row-step">{step.label}</span>
                  <span className="row-title-closed">
                    {step.title}
                  </span>
                </motion.button>

                {/* EXPANDED CONTENT */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="process-expand"
                      initial={{ opacity: 0, x: 120 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -120 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="process-image-wrap">
                        <img src={step.image} alt={step.title} />
                      </div>

                      <div className="process-content-row">
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}