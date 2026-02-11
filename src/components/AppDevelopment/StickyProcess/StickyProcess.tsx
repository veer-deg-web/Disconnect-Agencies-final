"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./StickyProcess.css";
import Cubes from "@/components/Cubes";

const steps = [
  {
    step: "Step 1",
    title: "Share your idea",
    description:
      "Tell us your app requirements and we’ll plan the best roadmap for your product.",
  },
  {
    step: "Step 2",
    title: "Design & strategy",
    description:
      "We design intuitive UI/UX and define the technical strategy for scale.",
  },
  {
    step: "Step 3",
    title: "Development",
    description:
      "Our engineers build fast, secure, and scalable applications.",
  },
  {
    step: "Step 4",
    title: "Launch & growth",
    description:
      "We launch, monitor, and continuously improve your product.",
  },
];

export default function StickyProcess() {
  const [current, setCurrent] = useState(0);

  const next = () =>
    setCurrent((prev) => (prev + 1) % steps.length);

  const prev = () =>
    setCurrent((prev) =>
      (prev - 1 + steps.length) % steps.length
    );

  return (
    <section className="sticky-process">
      <div className="sticky-process__inner">

        {/* LEFT – CAROUSEL TEXT */}
        <div className="steps-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="step-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <span className="step__label">
                {steps[current].step}
              </span>

              <h3>{steps[current].title}</h3>

              <p>{steps[current].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* CONTROLS */}
          <div className="carousel-controls">
            <button onClick={prev}>←</button>
            <button onClick={next}>→</button>
          </div>

          {/* PROGRESS BAR */}
          <div className="progress">
            <div
              className="progress-bar"
              style={{
                width: `${((current + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* RIGHT – STICKY CUBE */}
        <div className="visual">
          <div className="visual__sticky">
            <div className="cube-container">
              <Cubes
                gridSize={6}
                maxAngle={30}
                radius={3}
                borderStyle="2px dotted #5869E3"
                faceColor="#0f1224"
                rippleColor="#5869E3"
                rippleSpeed={1.5}
                autoAnimate
                rippleOnClick
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}