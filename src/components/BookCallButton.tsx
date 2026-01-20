"use client";
import { useState } from "react";

export default function BookCallButton() {
  const [hover, setHover] = useState(false);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "40px",
        width: "129px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        padding: "0 10px 0 14px",
        borderRadius: "999px",
        background: "#f4e9e2",
        border: "none",

        fontSize: "14px",
        fontWeight: 500,
        color: "#000",

        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <span>Book A Call</span>

      {/* Arrow Circle */}
      <div
        style={{
          position: "relative",
          height: "24px",
          width: "24px",
          borderRadius: "50%",
          background: hover ? "#f97316" : "#000",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          overflow: "hidden",
          transition: "background 0.3s ease",
          flexShrink: 0,
        }}
      >
        {/* Existing Arrow */}
        <span
          style={{
            position: "absolute",
            fontSize: "12px",
            color: "#fff",
            transform: hover ? "translateX(140%)" : "translateX(0)",
            transition: "transform 0.35s ease",
          }}
        >
          →
        </span>

        {/* Incoming Arrow */}
        <span
          style={{
            position: "absolute",
            fontSize: "12px",
            color: "#fff",
            transform: hover ? "translateX(0)" : "translateX(-140%)",
            transition: "transform 0.35s ease",
          }}
        >
          →
        </span>
      </div>
    </button>
  );
}