"use client";

import { motion, useInView, cubicBezier } from "framer-motion";
import { useRef } from "react";

/* =======================
   DATA
======================= */

type Service = {
  title: string;
  description: string;
  icon: string;
};

const topRow: Service[] = [
  {
    title: "AI Models & Automation",
    description:
      "Our Web3 fintech simplifies complex finance for all to access.",
    icon: "/icons/ai.svg",
  },
  {
    title: "App Development",
    description:
      "High-performance mobile and web apps built for speed, scalability, and seamless user experiences across all platforms.",
    icon: "/icons/app.svg",
  },
  {
    title: "Web Development",
    description:
      "Modern, responsive websites engineered for reliability, fast loading, and conversion-focused user journeys.",
    icon: "/icons/web.svg",
  },
];

const bottomRow: Service[] = [
  {
    title: "UI/UX Design",
    description:
      "Intuitive, visually polished interfaces crafted to elevate engagement.",
    icon: "/icons/uiux.svg",
  },
  {
    title: "SEO & Growth Optimization",
    description:
      "Data-driven strategies that boost visibility and organic traffic.",
    icon: "/icons/seo.svg",
  },
  {
    title: "Full-Stack Development",
    description:
      "End-to-end engineering creating robust, secure digital systems.",
    icon: "/icons/fullstack.svg",
  },
];

const ease = cubicBezier(0.22, 1, 0.36, 1);

/* =======================
   STYLES
======================= */

const sectionStyle: React.CSSProperties = {
  padding: "60px 20px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "3rem",
  fontWeight: "bold",
  marginBottom: "20px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  padding: "32px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: "600",
  marginBottom: "12px",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  lineHeight: "1.6",
  color: "rgba(255,255,255,0.7)",
};

const iconWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  marginBottom: "16px",
  borderRadius: "8px",
  background: "rgba(255,90,0,0.1)",
};

/* =======================
   VARIANTS
======================= */

const sectionVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.35,
    },
  },
};

const headingVariant = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease },
  },
};

const rowVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

/* =======================
   COMPONENT
======================= */

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} style={sectionStyle}>
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* HEADING */}
        <motion.div
          variants={headingVariant}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <h2 className="services-heading" style={headingStyle}>
            Smarter Development.
            <br />
            Stronger Outcomes.
          </h2>
        </motion.div>

        {/* ROW 1 */}
        <motion.div variants={rowVariant} style={gridStyle}>
          {topRow.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariant}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={cardStyle}
            >
              <CardGlow />
              <IconBox icon={item.icon} />
              <h3 style={titleStyle}>{item.title}</h3>
              <p style={descStyle}>{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ROW 2 */}
        <motion.div
          variants={rowVariant}
          style={{ ...gridStyle, marginTop: 24 }}
        >
          {bottomRow.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariant}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={cardStyle}
            >
              <CardGlow />
              <IconBox icon={item.icon} />
              <h3 style={titleStyle}>{item.title}</h3>
              <p style={descStyle}>{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ===============================
         MOBILE-ONLY HEADING SIZE
         Nothing else changes
      =============================== */}
      <style>{`
        @media (max-width: 768px) {
          .services-heading {
            font-size: 2.2rem !important;
          }
        }

        @media (max-width: 480px) {
          .services-heading {
            font-size: 1.8rem !important;
            line-height: 1.25;
          }
        }

        @media (max-width: 360px) {
          .services-heading {
            font-size: 1.6rem !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =======================
   UI PARTS
======================= */

function CardGlow() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 16,
        background:
          "radial-gradient(circle at top left, rgba(255,90,0,0.25), transparent 60%)",
        pointerEvents: "none",
      }}
    />
  );
}

function IconBox({ icon }: { icon: string }) {
  return (
    <div style={iconWrapperStyle}>
      <img src={icon} alt="" style={{ width: 22, height: 22 }} />
    </div>
  );
}