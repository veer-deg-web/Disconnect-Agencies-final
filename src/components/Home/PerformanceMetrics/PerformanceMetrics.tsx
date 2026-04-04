"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_SMOOTH } from "@/lib/animations";
import styles from "./PerformanceMetrics.module.css";

/* =======================
   TYPEWRITER SCRIBBLE
======================= */

const FINAL_TEXT = "Performance You Can Measure";
const SCRIBBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

function randomChar() {
  return SCRIBBLE_CHARS[
    Math.floor(Math.random() * SCRIBBLE_CHARS.length)
  ];
}

function TypewriterScribbleHeading({ play }: { play: boolean }) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!play || done) return;

    let frame = 0;
    let index = 0;

    const interval = setInterval(() => {
      frame++;

      setText(() => {
        let output = "";

        for (let i = 0; i < FINAL_TEXT.length; i++) {
          if (i < index) {
            output += FINAL_TEXT[i];
          } else if (i === index) {
            output += frame % 2 === 0
              ? FINAL_TEXT[i]
              : randomChar();
          }
        }

        return output;
      });

      if (frame % 3 === 0) index++;

      if (index >= FINAL_TEXT.length) {
        clearInterval(interval);
        setText(FINAL_TEXT);
        setDone(true);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [play, done]);

  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: play ? 1 : 0, y: play ? 0 : 20 }}
      transition={{ duration: 0.5, ease: EASE_SMOOTH }}
      className={styles.heading}
    >
      {text}
    </motion.h2>
  );
}

/* =======================
   MAIN COMPONENT
======================= */

export default function PerformanceMetrics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        controls.start("visible");
      }, 600);
    }
  }, [inView, controls]);

  return (
    <section ref={ref} className={styles.section}>
      {/* HEADING */}
      <div className={styles.headingWrap}>
        <TypewriterScribbleHeading play={inView} />
      </div>

      {/* STATS */}
      <motion.div
        className={styles.statsGrid}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: { staggerChildren: 0.18 },
          },
        }}
      >
        <Stat
          value="95.5%"
          label="Client Satisfaction & Retention Across All Projects"
        />
        <Stat
          value="50+"
          label="Websites, Apps & Digital Products Successfully Delivered"
        />
        <Stat
          value="60+"
          label="Custom Automation & AI Solutions Built for Businesses"
        />
      </motion.div>
    </section>
  );
}

/* =======================
   STAT ITEM
======================= */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 48 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.75,
            ease: EASE_SMOOTH,
          },
        },
      }}
      className={styles.statItem}
    >
      <div className={styles.statValue}>{value}</div>
      <p className={styles.statLabel}>{label}</p>
    </motion.div>
  );
}