"use client";

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

  return (
    <StepWrapper>
      <div className="time-layout">

        <ServiceInfoCard category={category} />

        {/* DATE + MINI CALENDAR */}
        <div className="time-date">
          <h2 className="time-title">
            Selected Date: {formattedDate}
          </h2>

          <MiniCalendar date={selectedDate} />
        </div>

        {/* TIME SLOTS */}
        <div className="time-panel">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              className={`time-slot ${
                time === slot ? "time-slot--active" : ""
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="time-actions">
        <button onClick={back} className="time-back">
          ← Back
        </button>
        <button onClick={next} className="time-next">
          Continue →
        </button>
      </div>
    </StepWrapper>
  );
}