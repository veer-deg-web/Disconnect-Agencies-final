"use client";

import WorkStack from "./OurWorkStack";
import "./OurWorkFinal.css";

export default function OurWorkFinal() {
  return (
    <section className="our-work-section">
      {/* HEADING */}
      <div className="our-work-header">
        <span className="eyebrow">Services</span>
        <h2>
          What<span> We Do</span>
        </h2>
      </div>

      {/* STACK */}
      <WorkStack />

      {/* MARQUEE */}
      <div className="our-work-marquee">
        <div className="marquee-track">
          <span>THOUGHTFULLY SHAPED — OUR WORK — </span>
          <span>THOUGHTFULLY SHAPED — OUR WORK — </span>
        </div>
      </div>
    </section>
  );
}