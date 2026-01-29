"use client";

import { useState } from "react";
import StepWrapper from "./StepWrapper";
import ServiceInfoCard from "./ServiceInfoCard";
import "./CalendarStep.css";

export default function CalendarStep({ category, date, setDate, next, back }: any) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const nextMonth = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const prevMonth = () => {
    const isCurrent =
      currentMonth === today.getMonth() && currentYear === today.getFullYear();

    if (isCurrent) return;

    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const isPast = (day: number) => {
    const check = new Date(currentYear, currentMonth, day);
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return check < todayMid;
  };

  return (
    <StepWrapper>
      <div className="calendar-layout">

        <ServiceInfoCard category={category} />

        {/* MAIN CALENDAR */}
        <div className="calendar-main">

          {/* MONTH HEADER */}
          <div className="calendar-header">
            <button onClick={prevMonth} className="nav-btn">←</button>

            <h2 className="calendar-title">
              {monthNames[currentMonth]} {currentYear}
            </h2>

            <button onClick={nextMonth} className="nav-btn">→</button>
          </div>

          {/* DAYS TITLE */}
          <div className="calendar-weekdays">
            <div>Sun</div><div>Mon</div><div>Tue</div>
            <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          {/* FULL CALENDAR */}
          <div className="calendar-grid">

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isPast(day);

              const isSelected =
                date instanceof Date &&
                date.getDate() === day &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;

              return (
                <button
                  key={day}
                  disabled={disabled}
                  onClick={() =>
                    !disabled && setDate(new Date(currentYear, currentMonth, day))
                  }
                  className={`calendar-day
                    ${disabled ? "day-disabled" : ""}
                    ${isSelected ? "day-selected" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* NAV BUTTONS */}
          <div className="calendar-actions">
            <button onClick={back} className="btn-secondary">
              ← Back
            </button>

            <button
              onClick={next}
              disabled={!date}
              className={`btn-primary ${!date ? "btn-disabled" : ""}`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}