"use client";

import "./MiniCalendar.css";

export default function MiniCalendar({ date }: { date: Date }) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const month = date.getMonth();
  const year = date.getFullYear();
  const selectedDay = date.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div className="mini-calendar">
      <h3 className="mini-calendar__title">
        {monthNames[month]} {year}
      </h3>

      <div className="mini-calendar__weekdays">
        <div>S</div><div>M</div><div>T</div>
        <div>W</div><div>T</div><div>F</div><div>S</div>
      </div>

      <div className="mini-calendar__grid">
        {/* Empty slots */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`m-empty-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = day === selectedDay;

          return (
            <div
              key={`mini-${day}`}
              className={`mini-calendar__day ${
                isSelected ? "mini-calendar__day--active" : ""
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}