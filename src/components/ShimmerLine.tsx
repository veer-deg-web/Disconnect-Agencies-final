"use client";

import { motion } from "framer-motion";

interface ShimmerLineProps {
  left: string; // ex: "10%", "80px", "calc(100% - 40px)"
  delay?: number;
  duration?: number;
}

export function ShimmerLine({
  left,
  delay = 0,
  duration = 4,
}: ShimmerLineProps) {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-[-150px] z-10 h-[140px] w-[1.5px]"
      style={{
        left,
        background:
          "linear-gradient(to top, transparent, #ff7a00, transparent)",
        opacity: 0.8,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: "-120vh", opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
