"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

type BookCallButtonProps = {
  circleColor?: string;
};

export default function BookCallButton({
  circleColor = "#f97316",
}: BookCallButtonProps) {
  const [hover, setHover] = useState(false);

  return (
    <Link href="/book-call" prefetch>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
        style={{
          height: "44px",
          padding: "0 16px 0 20px",
          borderRadius: "999px",
          background: "linear-gradient(to bottom, #f4e9e2, #efe3db)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          fontSize: "14px",
          fontWeight: 500,
          color: "#000",
          cursor: "pointer",
          userSelect: "none",
          boxShadow:
            hover
              ? "0 12px 30px rgba(0,0,0,0.2)"
              : "0 6px 18px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>
          Book A Call
        </span>

        {/* Arrow Circle */}
        <motion.div
          animate={{
            backgroundColor: hover ? circleColor : "#000",
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: "relative",
            height: "26px",
            width: "26px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Outgoing Arrow */}
          <motion.span
            animate={{
              x: hover ? 18 : 0,
            }}
            transition={{ duration: 0.35 }}
            style={{
              position: "absolute",
              fontSize: "12px",
              color: "#fff",
            }}
          >
            →
          </motion.span>

          {/* Incoming Arrow */}
          <motion.span
            animate={{
              x: hover ? 0 : -18,
            }}
            transition={{ duration: 0.35 }}
            style={{
              position: "absolute",
              fontSize: "12px",
              color: "#fff",
            }}
          >
            →
          </motion.span>
        </motion.div>

        {/* Responsive tweak */}
        <style jsx>{`
          @media (max-width: 480px) {
            div {
              height: 48px;
              padding: 0 18px 0 22px;
            }
          }
        `}</style>
      </motion.div>
    </Link>
  );
}