"use client";

import { motion, type Variants } from "framer-motion";
import ShinyText from "@/components/ShinyText";
import SpotlightCard from "@/components/SpotlightCard";

/* ============================
   TYPES
============================ */

export interface FeatureItem {
  title: string;
  description: string;
  logo: string;
}

interface FeaturesSectionProps {
  headingLine1: string;
  headingLine2: string;
  subheading?: string;
  items: FeatureItem[];
}

/* ============================
   ANIMATIONS (TS SAFE)
============================ */

const headingVariant: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const gridVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const contentVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ============================
   COMPONENT
============================ */

export default function FeaturesSection({
  headingLine1,
  headingLine2,
  subheading,
  items,
}: FeaturesSectionProps) {
  return (
    <section style={sectionStyle}>
      {/* HEADING */}
      <motion.div
        variants={headingVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        style={headingWrap}
      >
        <div style={headingLine}>
          <ShinyText
            text={headingLine1}
            speed={2}
            color="#eaeaea"
            shineColor="#ffffff"
            spread={180}
          />
        </div>

        <div style={{ ...headingLine, marginTop: 12 }}>
          <ShinyText
            text={headingLine2}
            speed={2}
            color="#eaeaea"
            shineColor="#ffffff"
            spread={180}
          />
        </div>

        {subheading && <p style={subHeading}>{subheading}</p>}
      </motion.div>

      {/* GRID */}
      <motion.div
        variants={gridVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        style={gridStyle}
      >
        {items.map((item, index) => (
          <motion.div key={index} variants={cardVariant}>
            <SpotlightCard
              className="custom-spotlight-card"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <div style={cardStyle}>
                {/* LOGO */}
                <div style={logoWrap}>
                  <img src={item.logo} alt="" style={logoImg} />
                </div>

                {/* CARD TITLE */}
                <motion.h3 variants={contentVariant} style={cardTitle}>
                  <ShinyText
                    text={item.title}
                    speed={1.4}
                    color="#ffffff"
                    shineColor="#ffffff"
                    spread={90}
                  />
                </motion.h3>

                {/* CARD DESCRIPTION */}
                <motion.p variants={contentVariant} style={cardText}>
                  {item.description}
                </motion.p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================
   STYLES
============================ */

const sectionStyle: React.CSSProperties = {
  padding: "190px 24px",
  background: "#000",
  color: "#fff",
};

const headingWrap: React.CSSProperties = {
  textAlign: "center",
  maxWidth: 960,
  margin: "0 auto 120px",
};

const headingLine: React.CSSProperties = {
  fontSize: "clamp(42px, 6.5vw, 66px)",
  lineHeight: 1.12,
  fontWeight: 600,
};

const subHeading: React.CSSProperties = {
  marginTop: 28,
  fontSize: 15,
  opacity: 0.7,
  lineHeight: 1.7,
};

const gridStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 28,
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  height: "100%",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 22,
  padding: "42px 32px",
  minHeight: 220,
  backdropFilter: "blur(14px)",
};

const logoWrap: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  background: "rgba(180,255,60,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 22,
};

const logoImg: React.CSSProperties = {
  width: 20,
  height: 20,
};

const cardTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 14,
};

const cardText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.65,
  opacity: 0.75,
};