"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* =======================
   DATA
======================= */

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const leftColumn: Testimonial[] = [
  {
    name: "Ethan Carter",
    role: "Wealth Advisor",
    quote:
      "I use it daily to fine-tune portfolio strategies—it saves hours and adds accuracy.",
  },
  {
    name: "Sofia Miller",
    role: "Freelance Designer",
    quote:
      "As someone new to finance, I felt empowered by how intuitive and intelligent this tool is.",
  },
  {
    name: "Daniel Brooks",
    role: "Private Investor",
    quote:
      "Accurate, automated, and surprisingly insightful—exactly what I needed.",
  },
];

const rightColumn: Testimonial[] = [
  {
    name: "Isabelle Turner",
    role: "Operations Director",
    quote:
      "Real-time tracking and transparency made our internal reporting far easier.",
  },
  {
    name: "Noah Hayes",
    role: "AI Engineer",
    quote:
      "The algorithms feel human—finally tech that understands market behavior.",
  },
  {
    name: "Jenna Wallace",
    role: "Startup Founder",
    quote:
      "Our team relies on this daily to make confident strategic decisions.",
  },
];

/* =======================
   ANIMATION CONFIG
======================= */

const ease = [0.22, 1, 0.36, 1] as const;

const textVariant = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease,
    },
  },
};

const columnsVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease,
      delay: 0.4,
    },
  },
};

/* =======================
   COMPONENT
======================= */

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [startScroll, setStartScroll] = useState(false);

  return (
    <section ref={ref} style={sectionStyle}>
      <div className="testimonial-container" style={container}>
        {/* LEFT TEXT */}
        <motion.div
          variants={textVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={leftContent}
          className="testimonial-text"
        >
          <h2 className="testimonial-heading" style={heading}>
            Trusted by Forward-
            <br />
            Thinking Investors
          </h2>

          <p className="testimonial-subtitle" style={subtitle}>
            Real stories from users who've transformed their investment
            experience with AI-driven insights.
          </p>
        </motion.div>

        {/* RIGHT COLUMNS */}
        <motion.div
          variants={columnsVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={rightContent}
          className="testimonial-columns"
          onAnimationComplete={() => setStartScroll(true)}
        >
          {/* COLUMN 1 (always visible) */}
          <motion.div
            className="testimonial-column"
            style={column}
            animate={startScroll ? { y: ["0%", "-50%"] } : { y: 0 }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...leftColumn, ...leftColumn].map((item, i) => (
              <TestimonialCard key={`left-${i}`} {...item} />
            ))}
          </motion.div>

          {/* COLUMN 2 (hidden on mobile) */}
          <motion.div
            className="testimonial-column hide-mobile"
            style={column}
            animate={startScroll ? { y: ["-50%", "0%"] } : { y: 0 }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...rightColumn, ...rightColumn].map((item, i) => (
              <TestimonialCard key={`right-${i}`} {...item} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ===============================
         MOBILE ONLY OVERRIDES
      =============================== */}
      <style>{`
        @media (max-width: 768px) {
          .testimonial-container {
            display: flex !important;
            flex-direction: column;
            gap: 48px;
          }

          .testimonial-heading {
            font-size: 28px !important;
            line-height: 1.2;
          }

          .testimonial-subtitle {
            font-size: 14px !important;
          }

          .testimonial-columns {
            grid-template-columns: 1fr !important;
            height: 420px;
          }

          .hide-mobile {
            display: none !important;
          }
        }

        @media (max-width: 360px) {
          .testimonial-heading {
            font-size: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =======================
   CARD
======================= */

function TestimonialCard({ name, role, quote }: Testimonial) {
  return (
    <div style={card}>
      <div style={cardHeader}>
        <div style={avatar} />
        <div>
          <div style={nameStyle}>{name}</div>
          <div style={roleStyle}>{role}</div>
        </div>
      </div>
      <p style={quoteStyle}>{quote}</p>
    </div>
  );
}

/* =======================
   STYLES
======================= */

const sectionStyle: React.CSSProperties = {
  padding: "160px 24px",
  background: "radial-gradient(circle at bottom left, #1a0f08, #000)",
  color: "#fff",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 1.2fr",
  gap: 80,
};

const leftContent: React.CSSProperties = {
  maxWidth: 480,
  willChange: "transform, opacity",
};

const heading: React.CSSProperties = {
  fontSize: "clamp(36px, 5vw, 52px)",
  fontWeight: 700,
  lineHeight: 1.1,
};

const subtitle: React.CSSProperties = {
  marginTop: 20,
  fontSize: 16,
  lineHeight: 1.6,
  opacity: 0.75,
};

const rightContent: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  height: 520,
  overflow: "hidden",
};

const column: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const card: React.CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: 20,
  backdropFilter: "blur(14px)",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
};

const avatar: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: "linear-gradient(145deg, #ff5a00, #ff2a00)",
};

const nameStyle: React.CSSProperties = {
  fontWeight: 600,
};

const roleStyle: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
};

const quoteStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.85,
};