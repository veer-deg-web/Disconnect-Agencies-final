"use client";
import type { Variants } from "framer-motion";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CategoryStep from "./CategoryStep";
import CalendarStep from "./CalendarStep";
import TimeStep from "./TimeStep";
import DetailsStep from "./DetailsStep";
import { CategoryType } from "@/components/data/serviceData";

import BackgroundEllipses from "@/components/BackgroundElipse";
import "./BookingSteps.css";

interface BookingStepsProps {
  initialCategory: CategoryType;
}

const STEPS = ["category", "calendar", "time", "details"] as const;
type StepType = typeof STEPS[number];

const STEP_LABELS = ["Service", "Date", "Time", "Details"];

/* slide direction: +1 = forward, -1 = back */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stepVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: EASE },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -48 : 48,
    transition: { duration: 0.28, ease: EASE },
  }),
};

export default function BookingSteps({ initialCategory }: BookingStepsProps) {
  const [step, setStep] = useState<StepType>("category");
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const dir = useRef(1); // direction of last navigation

  const currentIndex = STEPS.indexOf(step);

  const goNext = (next: StepType) => {
    dir.current = 1;
    setStep(next);
  };
  const goBack = (prev: StepType) => {
    dir.current = -1;
    setStep(prev);
  };

  return (
    <main className="booking-steps">
      <BackgroundEllipses />

      {/* ── STEP PROGRESS INDICATOR ── */}
      <div className="booking-steps__indicator">
        {STEP_LABELS.map((label, i) => {
          const isActive   = i === currentIndex;
          const isComplete = i < currentIndex;
          return (
            <div key={label} className="step-item">
              <motion.div
                className={`step-dot ${isActive ? "step-dot--active" : ""} ${isComplete ? "step-dot--done" : ""}`}
                animate={
                  isActive
                    ? { scale: 1.15, boxShadow: "0 0 0 4px rgba(124,58,237,0.3)" }
                    : { scale: 1, boxShadow: "0 0 0 0px transparent" }
                }
                transition={{ duration: 0.3 }}
              >
                {isComplete ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  i + 1
                )}
              </motion.div>

              <span className={`step-label ${isActive || isComplete ? "step-label--active" : ""}`}>
                {label}
              </span>

              {i < STEP_LABELS.length - 1 && (
                <div className="step-connector">
                  <motion.div
                    className="step-connector-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isComplete ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="booking-steps__container">
        <AnimatePresence mode="wait" custom={dir.current}>
          <motion.div
            key={step}
            custom={dir.current}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: "100%" }}
          >
            {step === "category" && (
              <CategoryStep
                category={category}
                setCategory={setCategory}
                next={() => goNext("calendar")}
              />
            )}
            {step === "calendar" && (
              <CalendarStep
                category={category}
                date={date}
                setDate={setDate}
                next={() => goNext("time")}
                back={() => goBack("category")}
              />
            )}
            {step === "time" && date && (
              <TimeStep
                category={category}
                date={date}
                time={time}
                setTime={setTime}
                next={() => goNext("details")}
                back={() => goBack("calendar")}
              />
            )}
            {step === "details" && date && (
              <DetailsStep
                category={category}
                date={date}
                time={time}
                back={() => goBack("time")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}