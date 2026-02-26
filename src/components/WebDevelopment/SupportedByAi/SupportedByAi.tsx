"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ShinyText from "@/components/ShinyText";

/* =======================
   DATA
======================= */

const ROW_1 = [
  { name: "David Chen", role: "Marketing Officer", img: "/Section.png" },
  { name: "James Patel", role: "UX Designer", img: "/Section.png" },
  { name: "Liam Johnson", role: "Software Engineer", img: "/Section.png" },
  { name: "Emma Brooks", role: "Operations", img: "/Section.png" },
];

const ROW_2 = [
  { name: "Noah Ramirez", role: "Product Manager", img: "/Section.png" },
  { name: "Olivia Martinez", role: "Head of Sales", img: "/Section.png" },
  { name: "Aisha Rahman", role: "Digital Strategist", img: "/Section.png" },
  { name: "Ethan Brown", role: "Brand Lead", img: "/Section.png" },
];

/* =======================
   COMPONENT
======================= */

export default function SupportedByAISection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={ref} style={section}>
      {/* LEFT TEXT */}
      <div style={textWrap}>
        <ShinyText
          text="Supported by leading AI and"
          color="#ffffff"
          shineColor="rgba(255,255,255,0.85)"
          speed={2.4}
          spread={90}
        />

        <ShinyText
          text="future-of-work investors."
          color="#ffffff"
          shineColor="rgba(255,255,255,0.85)"
          speed={2.4}
          spread={90}
        />

        <p style={subText}>
          Backed by operators, designers, engineers, and investors shaping the
          next generation of intelligent digital products.
        </p>
      </div>

      {/* ROWS */}
      <motion.div style={{ ...row, x: row1X }}>
        {ROW_1.map(renderCard)}
      </motion.div>

      <motion.div style={{ ...row, x: row2X, marginTop: 28 }}>
        {ROW_2.map(renderCard)}
      </motion.div>
    </section>
  );
}

/* =======================
   CARD
======================= */

function renderCard(person: any, i: number) {
  return (
    <div
      key={i}
      style={card}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0px)")
      }
    >
      <img src={person.img} alt={person.name} style={avatar} />
      <div>
        <div style={name}>{person.name}</div>
        <div style={role}>{person.role}</div>
      </div>
    </div>
  );
}

/* =======================
   STYLES
======================= */

const section: React.CSSProperties = {
  padding: "clamp(100px, 14vw, 160px) 40px",
  background: "radial-gradient(circle at top, #141414, #000)",
  color: "#fff",
  overflow: "hidden",
};

const textWrap: React.CSSProperties = {
  maxWidth: 560,
  marginBottom: 60,
  fontSize: "clamp(26px, 5vw, 42px)",
};

const subText: React.CSSProperties = {
  fontSize: "clamp(14px, 3.5vw, 15px)",
  opacity: 0.65,
  marginTop: 18,
  lineHeight: 1.6,
};

const row: React.CSSProperties = {
  display: "flex",
  gap: 24,
  flexWrap: "wrap",   // 🔥 important
  maxWidth: 1400,     // 🔥 prevents 5th card
};

const card: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  padding: "22px 28px",
  borderRadius: 22,
  flex: "1 1 300px",  // 🔥 ensures max 4
  maxWidth: 320,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
  transition: "transform 0.4s ease",
};

const avatar: React.CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  objectFit: "cover",
};

const name: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
};

const role: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.65,
};