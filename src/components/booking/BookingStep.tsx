"use client";

import { CSSProperties, useState, useRef } from "react";
import { motion } from "framer-motion";

import CategoryStep from "./CategoryStep";
import CalendarStep from "./CalendarStep";
import TimeStep from "./TimeStep";
import DetailsStep from "./DetailsStep";
import { CategoryType } from "@/components/data/serviceData";

import ParticleCanvas from "@/components/Shared/ParticleCanvas/ParticleCanvas";
import "./BookingSteps.css";

interface BookingStepsProps {
  initialCategory: CategoryType;
}

const STEPS = ["category", "calendar", "time", "details"] as const;
type StepType = typeof STEPS[number];

const STEP_LABELS = ["Service", "Date", "Time", "Details"];

const CATEGORY_THEMES: Record<
  CategoryType,
  {
    primary: string;
    secondary: string;
    primaryRgb: string;
    secondaryRgb: string;
    onPrimary: string;
  }
> = {
  aimodels: {
    primary: "#814AC8",
    secondary: "#814AC8",
    primaryRgb: "129,74,200",
    secondaryRgb: "129,74,200",
    onPrimary: "#ffffff",
  },
  appdev: {
    primary: "#6271E9",
    secondary: "#6271E9",
    primaryRgb: "98,113,233",
    secondaryRgb: "98,113,233",
    onPrimary: "#ffffff",
  },
  webdev: {
    primary: "#CFFE25",
    secondary: "#CFFE25",
    primaryRgb: "207,254,37",
    secondaryRgb: "207,254,37",
    onPrimary: "#0b0b0b",
  },
  uiux: {
    primary: "#6214D9",
    secondary: "#6214D9",
    primaryRgb: "98,20,217",
    secondaryRgb: "98,20,217",
    onPrimary: "#ffffff",
  },
  seo: {
    primary: "#3152D7",
    secondary: "#3152D7",
    primaryRgb: "49,82,215",
    secondaryRgb: "49,82,215",
    onPrimary: "#ffffff",
  },
  cloud: {
    primary: "#D5FF43",
    secondary: "#D5FF43",
    primaryRgb: "213,255,67",
    secondaryRgb: "213,255,67",
    onPrimary: "#0b0b0b",
  },
};

export default function BookingSteps({ initialCategory }: BookingStepsProps) {
  const [step, setStep] = useState<StepType>("category");
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const dir = useRef(1); // direction of last navigation

  const currentIndex = STEPS.indexOf(step);
  const currentTheme = CATEGORY_THEMES[category];

  const goNext = (next: StepType) => {
    dir.current = 1;
    setStep(next);
  };
  const goBack = (prev: StepType) => {
    dir.current = -1;
    setStep(prev);
  };

  return (
    <main
      className="booking-steps"
      style={
        {
          "--booking-primary": currentTheme.primary,
          "--booking-secondary": currentTheme.secondary,
          "--booking-primary-rgb": currentTheme.primaryRgb,
          "--booking-secondary-rgb": currentTheme.secondaryRgb,
          "--booking-on-primary": currentTheme.onPrimary,
        } as CSSProperties
      }
    >
      <ParticleCanvas 
        color={currentTheme.primary}
        shadowColor={currentTheme.secondary}
        lineRgb={currentTheme.secondaryRgb}
        background="transparent" 
      />

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
                    ? { scale: 1.08, boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }
                    : { scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }
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
    </main>
  );
}
