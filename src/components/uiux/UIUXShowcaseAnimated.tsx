"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./UIUXShowcaseAnimated.module.css";

export default function UIUXShowcaseAnimated() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <motion.div ref={ref} className={styles.container}>
      <motion.h2
        className={styles.heading}
        style={{
          y,
          opacity,
        }}
      >
        <span className={styles.highlight}>
          UI Designs
          <br />
          Made Easy
        </span>
      </motion.h2>
    </motion.div>
  );
}
