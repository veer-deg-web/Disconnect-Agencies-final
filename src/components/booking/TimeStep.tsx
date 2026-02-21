"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import StepWrapper from "./StepWrapper";
import ServiceInfoCard from "./ServiceInfoCard";
import MiniCalendar from "./MiniCalendar";
import "./TimeStep.css";

const timeSlots = [
  "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM","4:00 PM",
  "5:00 PM","6:00 PM","7:00 PM","8:00 PM",
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045 },
  },
};

const slotVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.94 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.3, ease: EASE } },
};

export default function TimeStep({ category, date, time, setTime, next, back }: any) {
  const selectedDate = new Date(date);
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <StepWrapper>
      <div className="time-layout">

        {/* LEFT — Service Card */}
        <ServiceInfoCard category={category} />

        {/* RIGHT */}
        <div className="time-right">

          {/* SELECTED DATE */}
          <div className="time-date-box">
            <div className="time-date-info">
              <p className="time-date-label">Selected Date</p>
              <p className="time-date-value">{formattedDate}</p>
            </div>
            <MiniCalendar date={selectedDate} />
          </div>

          {/* TIME SLOT GRID */}
          <div className="time-grid-section">
            <p className="time-grid-label">Pick a time</p>
            <motion.div
              className="time-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {timeSlots.map((slot) => {
                const isSelected = time === slot;
                return (
                  <motion.button
                    key={slot}
                    variants={slotVariants}
                    onClick={() => setTime(slot)}
                    className={`time-slot ${isSelected ? "time-slot--selected" : ""}`}
                    whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {slot}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* ACTIONS */}
          <div className="time-actions">
            <motion.button
              onClick={back}
              className="time-back"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              ← Back
            </motion.button>

            <motion.button
              onClick={next}
              disabled={!time}
              className={`time-next ${!time ? "time-next--disabled" : ""}`}
              whileHover={time ? { scale: 1.02 } : {}}
              whileTap={time ? { scale: 0.97 } : {}}
            >
              Continue →
            </motion.button>
          </div>
        </div>

      </div>
    </StepWrapper>
  );
}