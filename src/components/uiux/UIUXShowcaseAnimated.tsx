"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function UIUXShowcaseAnimated() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <motion.h2
        style={{
          y,
          opacity,
          color: "#fff",
          fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
       <span style={{ fontFamily: "instrument-serif",fontStyle:"italic" }}> UI Designs
        <br />
        Made Easy</span>
      </motion.h2>
    </motion.div>
  );
}
