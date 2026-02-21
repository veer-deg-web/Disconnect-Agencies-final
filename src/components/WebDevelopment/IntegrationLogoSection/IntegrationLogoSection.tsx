"use client";

import { motion } from "framer-motion";
import LogoLoop from "@/components/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import ShinyText from "@/components/ShinyText";

/* =======================
   DATA
======================= */

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

/* =======================
   COMPONENT
======================= */

export default function IntegrationLogosSection() {
  return (
    <section style={sectionStyle}>
      {/* DOT GRID BACKGROUND */}
      <div style={dotGrid} />

      {/* CONTENT WRAP */}
      <div style={contentWrap}>
        {/* TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={textWrap}
        >
          <h2 style={heading}>
            <ShinyText
              text="Seamless Integration"
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={140}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </h2>

          <p style={subheading}>
            Connect effortlessly with your favorite tools and platforms —
            everything works together in real time.
          </p>

          <button style={cta}>See All Integrations</button>
        </motion.div>

        {/* LOGO LOOP */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          viewport={{ once: true }}
          style={logoWrap}
        >
          <LogoLoop
            logos={techLogos}
            speed={90}
            direction="left"
            logoHeight={56}
            gap={56}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Technology integrations"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* =======================
   STYLES
======================= */

const sectionStyle: React.CSSProperties = {
  position: "relative",
  padding: "140px 24px",
  background: "#000",
  color: "#fff",
  overflow: "hidden",
};

const dotGrid: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  opacity: 0.35,
  pointerEvents: "none",
};

const contentWrap: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  maxWidth: 1200,
  margin: "0 auto",
};

const textWrap: React.CSSProperties = {
  maxWidth: 720,
};

const heading: React.CSSProperties = {
  fontSize: "clamp(36px, 5vw, 48px)",
  fontWeight: 600,
  marginBottom: 16,
};

const subheading: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  opacity: 0.7,
  maxWidth: 520,
};

const cta: React.CSSProperties = {
  marginTop: 28,
  padding: "12px 20px",
  borderRadius: 999,
  background: "#fff",
  color: "#000",
  fontSize: 14,
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
};

const logoWrap: React.CSSProperties = {
  height: 120,
  position: "relative",
  overflow: "hidden",
  marginTop: 56,
};