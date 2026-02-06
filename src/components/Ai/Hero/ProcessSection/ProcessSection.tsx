"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react"; // simple, clean icons
import "./ProcessSection.css";

/* =========================
   DATA
========================= */

const steps = [
  {
    step: "Step 1",
    title: "Smart Analyzing",
    description:
      "We assess your needs and identify AI solutions to streamline workflows and improve efficiency.",
    video: "/step1.mov",
  },
  {
    step: "Step 2",
    title: "AI Development",
    description:
      "Our team builds intelligent automation systems tailored to your business processes.",
    video: "/step2.mov",
  },
  {
    step: "Step 3",
    title: "Seamless Integration",
    description:
      "We integrate AI solutions smoothly into your existing systems with minimal disruption.",
    video: "/step3.mov",
  },
  {
    step: "Step 4",
    title: "Continuous Optimization",
    description:
      "We continuously monitor and optimize performance to ensure long-term scalability.",
    video: "/step4.mov",
  },
];

/* =========================
   ANIMATION
========================= */

const easeSmooth = [0.22, 1, 0.36, 1] as const;

const pillVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeSmooth },
  },
};

const headingVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1, ease: easeSmooth },
  },
};

const subVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.25, ease: easeSmooth },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.4, ease: easeSmooth },
  },
};

const videoSwipeVariant: Variants = {
  hidden: { y: "70%" },
  show: {
    y: "0%",
    transition: { duration: 2.4, ease: easeSmooth },
  },
};

/* =========================
   COMPONENT
========================= */

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  const prev = () => {
    if (activeStep > 0) setActiveStep((s) => s - 1);
  };

  const next = () => {
    if (activeStep < steps.length - 1) setActiveStep((s) => s + 1);
  };

  return (
    <section className="process">
      <div className="process-container">
        {/* HEADER */}
        <div className="process-header">
          <motion.span
            className="process-pill"
            variants={pillVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Our Process
          </motion.span>

          <motion.h2
            variants={headingVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Our Simple, Smart,
            <br /> and Scalable Process
          </motion.h2>

          <motion.p
            variants={subVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            We design, develop, and implement automation tools that help you work
            smarter, not harder.
          </motion.p>
        </div>

        {/* CARD WRAPPER (for arrows) */}
        <div className="process-card-wrapper">
          {/* LEFT ARROW */}
          <button
            className="process-arrow left"
            onClick={prev}
            disabled={activeStep === 0}
          >
            <ChevronLeft size={20} />
          </button>

          {/* CARD */}
          <motion.div
            className="process-card"
            variants={cardVariant}
            initial="hidden"
            animate="show"
            key={activeStep}
          >
            <div className="process-card-content">
              <span className="step-pill">{steps[activeStep].step}</span>
              <h3>{steps[activeStep].title}</h3>
              <p>{steps[activeStep].description}</p>
            </div>

            <div className="process-video">
              <motion.video
                src={steps[activeStep].video}
                autoPlay
                muted
                loop
                playsInline
                variants={videoSwipeVariant}
                initial="hidden"
                animate="show"
              />
            </div>
          </motion.div>

          {/* RIGHT ARROW */}
          <button
            className="process-arrow right"
            onClick={next}
            disabled={activeStep === steps.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="process-controls">
          <div className="process-progress">
            <span
              className="process-progress-bar"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}