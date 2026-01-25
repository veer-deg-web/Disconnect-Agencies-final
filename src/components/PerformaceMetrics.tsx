"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="performance-heading"
      style={headingStyle}
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
    <section ref={ref} style={sectionStyle}>
      {/* HEADING */}
      <div className="performance-heading-wrap">
        <TypewriterScribbleHeading play={inView} />
      </div>

      {/* STATS */}
      <motion.div
        className="stats-grid"
        style={statsGridStyle}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: { staggerChildren: 0.18 },
          },
        }}
      >
        <Stat
          value="98.7%"
          label="Client Satisfaction & Retention Across All Projects"
        />
        <Stat
          value="250+"
          label="Websites, Apps & Digital Products Successfully Delivered"
        />
        <Stat
          value="120+"
          label="Custom Automation & AI Solutions Built for Businesses"
        />
      </motion.div>

      {/* MOBILE OVERRIDES */}
      <style>{`
        /* =========================
           MOBILE RESPONSIVE ONLY
           Safe down to 344px
        ========================= */

        @media (max-width: 768px) {
          .performance-heading-wrap {
            margin-bottom: 60px;
          }

          .performance-heading {
            font-size: 32px !important;
            line-height: 1.2;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }

        @media (max-width: 360px) {
          .performance-heading {
            font-size: 28px !important;
          }
        }
      `}</style>
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
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      style={statItemStyle}
    >
      <div style={statValueStyle}>{value}</div>
      <p style={statLabelStyle}>{label}</p>
    </motion.div>
  );
}

/* =======================
   STYLES
======================= */

const sectionStyle: React.CSSProperties = {
  background: "radial-gradient(circle at top, #151515 0%, #000 70%)",
  padding: "160px 24px",
  color: "#fff",
  textAlign: "center",
};

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(36px, 5vw, 56px)",
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
};

const statsGridStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 80,
};

const statItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "clamp(64px, 6vw, 88px)",
  fontWeight: 700,
  color: "#ff5a00",
  marginBottom: 12,
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.75)",
  maxWidth: 300,
};