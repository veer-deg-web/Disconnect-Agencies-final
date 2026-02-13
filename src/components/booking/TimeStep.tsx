"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepWrapper from "./StepWrapper";
import ServiceInfoCard from "./ServiceInfoCard";
import MiniCalendar from "./MiniCalendar";
import "./TimeStep.css";

const timeSlots = [
  "1:00 PM","2:00 PM","3:00 PM","4:00 PM",
  "5:00 PM","6:00 PM","7:00 PM","8:00 PM"
];

export default function TimeStep({ category, date, time, setTime, next, back }: any) {

  const selectedDate = new Date(date);
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [index, setIndex] = useState(0);

  const nextSlot = () => {
    if (index < timeSlots.length - 1) {
      setIndex(index + 1);
      setTime(timeSlots[index + 1]);
    }
  };

  const prevSlot = () => {
    if (index > 0) {
      setIndex(index - 1);
      setTime(timeSlots[index - 1]);
    }
  };

  const progress = ((index + 1) / timeSlots.length) * 100;

  return (
    <StepWrapper>
      <div className="time-layout">

        <ServiceInfoCard category={category} />

        <div className="time-right">

          {/* DATE */}
          <div className="time-date">
            <h2>Selected Date</h2>
            <p>{formattedDate}</p>
            <MiniCalendar date={selectedDate} />
          </div>

          {/* TIME SELECTOR */}
          <div className="time-carousel">

            <button
              onClick={prevSlot}
              disabled={index === 0}
              className="arrow-btn"
            >
              ←
            </button>

            <div className="time-display">
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeSlots[index]}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="time-slot-display"
                >
                  {timeSlots[index]}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={nextSlot}
              disabled={index === timeSlots.length - 1}
              className="arrow-btn"
            >
              →
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="time-progress">
            <div
              className="time-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>
      </div>

      {/* ACTIONS */}
      <div className="time-actions">
        <button onClick={back} className="time-back">
          ← Back
        </button>

        <button
          onClick={next}
          disabled={!time}
          className={`time-next ${!time ? "time-next--disabled" : ""}`}
        >
          Continue →
        </button>
      </div>
    </StepWrapper>
  );
}