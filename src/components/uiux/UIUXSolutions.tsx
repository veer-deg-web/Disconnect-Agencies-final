"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { IconType } from "react-icons";
import {
  SiFigma,
  SiFramer,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiNotion,
  SiJira,
  SiSlack,
  SiWebflow,
  SiGoogleanalytics,
  SiBehance,
} from "react-icons/si";

/* ---------------- DATA ---------------- */

type SolutionItem = {
  icon: IconType;
  title: string;
  subtitle: string;
};

const TOP_ROW: SolutionItem[] = [
  { icon: SiFigma, title: "Figma", subtitle: "Interface Design" },
  { icon: SiFramer, title: "Framer", subtitle: "Interactive Prototypes" },
  { icon: SiAdobephotoshop, title: "Photoshop", subtitle: "Visual Editing" },
  { icon: SiAdobeillustrator, title: "Illustrator", subtitle: "Brand Assets" },
  { icon: SiWebflow, title: "Webflow", subtitle: "No-code Build" },
];

const BOTTOM_ROW: SolutionItem[] = [
  { icon: SiNotion, title: "Notion", subtitle: "Design Docs" },
  { icon: SiJira, title: "Jira", subtitle: "Sprint Workflow" },
  { icon: SiSlack, title: "Slack", subtitle: "Team Collaboration" },
  { icon: SiGoogleanalytics, title: "Analytics", subtitle: "UX Insights" },
  { icon: SiBehance, title: "Behance", subtitle: "Portfolio System" },
];

/* ---------------- COMPONENT ---------------- */

export default function UIUXSolutions() {
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { margin: "-120px" });

  return (
    <>
      {/* MOBILE SIZE REDUCTION — 344px SAFE */}
      <style>
        {`
          @media (max-width: 768px) {
            .solutions-section {
              padding: 16px !important;
            }

            .solutions-heading {
              font-size: 2.2rem !important;
              line-height: 1.2 !important;
            }

            .solutions-sub {
              font-size: 14px !important;
              max-width: 320px !important;
            }

            .solutions-pill {
              font-size: 12px !important;
              padding: 6px 14px !important;
              margin-bottom: 22px !important;
            }

            .marquee-chip {
              padding: 10px 16px !important;
            }

            .marquee-row {
              min-height: 52px !important;
              padding: 8px 10px !important;
              gap: 10px !important;
            }
          }
        `}
      </style>

      <section
        ref={ref}
        className="solutions-section"
        style={{
          padding: "20px 24px",
          background: "#000",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* PILL */}
          <motion.div
            className="solutions-pill"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={pillStyle}
          >
            <span style={dotStyle} />
            Solution
          </motion.div>

          {/* HEADING */}
          <motion.h2
            className="solutions-heading"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            style={headingStyle}
          >
            All your{" "}
            <span
              style={{
                opacity: 0.55,
                fontStyle: "italic",
                fontFamily: '"Instrument Serif", serif',
              }}
            >
              design
            </span>{" "}
            needs.
          </motion.h2>

          {/* SUBTEXT */}
          <motion.p
            className="solutions-sub"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            style={subStyle}
          >
            Running a successful business means more than just a website.
            We cover all your design needs so you never have to go elsewhere.
          </motion.p>

          {/* MARQUEE */}
          <div style={{ marginTop: 56 }}>
            <SeamlessMarquee items={TOP_ROW} direction="right" />
            <SeamlessMarquee items={BOTTOM_ROW} direction="left" />
          </div>
        </div>

        {/* KEYFRAMES */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 0.4;
              box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 16px rgba(34, 197, 94, 1);
            }
            100% {
              opacity: 0.4;
              box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
          }
        `}</style>
      </section>
    </>
  );
}

/* ---------------- SEAMLESS MARQUEE ---------------- */

function SeamlessMarquee({
  items,
  direction,
}: {
  items: SolutionItem[];
  direction: "left" | "right";
}) {
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        marginBottom: 16,
      }}
    >
      <motion.div
        style={{
          display: "flex",
          gap: 12,
          width: "max-content",
        }}
        animate={{
          x: direction === "right" ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: 22,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items].map((item, i) => {
          const Icon = item.icon;
          return (
          <div key={i} className="marquee-chip" style={chipStyle}>
            <div
              className="marquee-row"
              style={{
                minHeight: 58,
                padding: "8px 14px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#e5e7eb",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  {item.title}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {item.subtitle}
                </div>
              </div>
            </div>
          </div>
        )})}
      </motion.div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 18px",
  borderRadius: 999,
  marginBottom: 28,
  fontSize: 13,
  color: "#d1fae5",
  backdropFilter: "blur(14px)",
  background:
    "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.05))",
  border: "1px solid rgba(16,185,129,0.35)",
};

const dotStyle = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#22c55e",
  animation: "pulse 1.6s infinite",
};

const headingStyle = {
  fontSize: "clamp(2.8rem, 5vw, 4rem)",
  fontWeight: 500,
  color: "#fff",
  lineHeight: 1.1,
  marginBottom: 16,
};

const subStyle = {
  maxWidth: 680,
  margin: "0 auto",
  color: "#9ca3af",
  fontSize: 16,
};

const chipStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 22px",
  borderRadius: 14,
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
};
