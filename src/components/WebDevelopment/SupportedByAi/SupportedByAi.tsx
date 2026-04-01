"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";

/* =======================
   DATA
======================= */

const ROW_1 = [
  { name: "David Chen", role: "Marketing Officer", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
  { name: "James Patel", role: "UX Designer", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
  { name: "Liam Johnson", role: "Software Engineer", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
  { name: "Emma Brooks", role: "Operations", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
];

const ROW_2 = [
  { name: "Noah Ramirez", role: "Product Manager", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
  { name: "Olivia Martinez", role: "Head of Sales", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
  { name: "Aisha Rahman", role: "Digital Strategist", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
  { name: "Ethan Brown", role: "Brand Lead", img: "/assets/WebDevelopment/SupportedByAi/photo/Section.webp" },
];

type Person = {
  name: string;
  role: string;
  img: string;
};

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
          text="Connected to the Minds Building the Future"
          color="#ffffff"
          shineColor="rgba(255,255,255,0.85)"
          speed={2.4}
          spread={90}
        />

        

        <p style={subText}>
          Supported By A Collective Of Experts And Investors Advancing AI-Driven Digital Innovation
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

function renderCard(person: Person, i: number) {
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
      <Image
        src={person.img}
        alt={person.name}
        width={50}
        height={50}
        style={avatar}
      />
      <div style={name}>{person.name}</div>
      <div style={role}>{person.role}</div>
    </div>
  );
}

/* =======================
   STYLES
======================= */

const section: React.CSSProperties = {
  padding: "clamp(72px, 14vw, 160px) clamp(10px, 3.8vw, 40px)",
  background: "radial-gradient(circle at top, #141414, #000)",
  color: "#fff",
  overflow: "hidden",
};

const textWrap: React.CSSProperties = {
  maxWidth: 560,
  marginBottom: "clamp(26px, 7vw, 60px)",
  fontSize: "clamp(22px, 5vw, 42px)",
};

const subText: React.CSSProperties = {
  fontSize: "clamp(13px, 3.6vw, 15px)",
  opacity: 0.65,
  marginTop: 14,
  lineHeight: 1.55,
};

const row: React.CSSProperties = {
  display: "flex",
  gap: "clamp(10px, 2.2vw, 24px)",
  flexWrap: "nowrap",
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  WebkitOverflowScrolling: "touch",
  paddingBottom: 4,
  alignItems: "stretch",
  scrollSnapType: "x proximity",
};

const card: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto auto",
  columnGap: "clamp(8px, 2vw, 18px)",
  rowGap: 2,
  alignItems: "center",
  padding: "clamp(12px, 2.6vw, 22px) clamp(12px, 3vw, 28px)",
  borderRadius: 20,
  flex: "0 0 clamp(208px, 26vw, 320px)",
  minWidth: 0,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
  transition: "transform 0.4s ease",
  scrollSnapAlign: "start",
};

const avatar: React.CSSProperties = {
  width: "clamp(34px, 6vw, 50px)",
  height: "clamp(34px, 6vw, 50px)",
  borderRadius: "50%",
  objectFit: "cover",
  gridRow: "1 / span 2",
};

const name: React.CSSProperties = {
  fontSize: "clamp(13px, 2.9vw, 16px)",
  fontWeight: 500,
  gridColumn: 2,
  gridRow: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const role: React.CSSProperties = {
  fontSize: "clamp(11px, 2.6vw, 13px)",
  opacity: 0.65,
  gridColumn: 2,
  gridRow: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
