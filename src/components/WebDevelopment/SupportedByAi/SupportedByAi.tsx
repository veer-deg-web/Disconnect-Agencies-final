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

  // Slightly reduced range for mobile friendliness
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
      <div style={rowsWrap}>
        <motion.div style={{ ...row, x: row1X }}>
          {[...ROW_1, ...ROW_1].map(renderCard)}
        </motion.div>

        <motion.div style={{ ...row, marginTop: 16, x: row2X }}>
          {[...ROW_2, ...ROW_2].map(renderCard)}
        </motion.div>
      </div>
    </section>
  );
}

/* =======================
   CARD
======================= */

function renderCard(person: any, i: number) {
  return (
    <div key={i} style={card}>
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
  padding: "clamp(80px, 12vw, 120px) 16px",
  background: "radial-gradient(circle at top, #141414, #000)",
  color: "#fff",
  overflow: "hidden",
};

const textWrap: React.CSSProperties = {
  maxWidth: 460,
  marginBottom: 48,
  fontSize: "clamp(22px, 6vw, 36px)",
};

const subText: React.CSSProperties = {
  fontSize: "clamp(13px, 3.5vw, 14px)",
  opacity: 0.65,
  marginTop: 12,
  lineHeight: 1.6,
};

const rowsWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const row: React.CSSProperties = {
  display: "flex",
  gap: 14,
  width: "max-content",
};

const card: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 12,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
  border: "1px solid rgba(255,255,255,0.08)",
  minWidth: 180, // ⬅️ mobile-safe
};

const avatar: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  objectFit: "cover",
};

const name: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
};

const role: React.CSSProperties = {
  fontSize: 11.5,
  opacity: 0.6,
};