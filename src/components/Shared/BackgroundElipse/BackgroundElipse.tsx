"use client";

import "./BackgroundEllipses.css";

export default function BackgroundEllipses() {
  return (
    <div className="bg-ellipses">
      <div className="bg-ellipse bg-ellipse--one" />
      <div className="bg-ellipse bg-ellipse--two" />
      <div className="bg-ellipse bg-ellipse--three" />
    </div>
  );
}