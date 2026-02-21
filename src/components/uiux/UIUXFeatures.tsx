"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BookCallButton from "@/components/BookCallButton";

export default function UIUXFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-120px" });
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    setCycleKey((k) => k + 1);
  }, [isInView]);

  return (
    <>
      {/* MOBILE OVERRIDES — 344px SAFE */}
      <style>
        {`
          @media (max-width: 768px) {
            .features-wrapper {
              padding: 56px 20px !important;
            }

            .features-heading {
              font-size: 2.2rem !important;
              line-height: 1.25 !important;
            }

            .features-sub {
              max-width: 320px !important;
              margin-bottom: 56px !important;
              line-height: 1.6 !important;
            }

            .features-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            .feature-card {
              text-align: center !important;
            }
          }
        `}
      </style>

      <section
        ref={sectionRef}
        style={{ padding: "140px 24px", background: "#000" }}
      >
        <div
          key={cycleKey}
          className="features-wrapper"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 48px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.06), transparent)",
            textAlign: "center",
          }}
        >
          {/* FEATURE PILL */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
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
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 12px rgba(34,197,94,0.9)",
                animation: "pulse 1.6s infinite",
              }}
            />
            Features
          </motion.div>

          {/* HEADING */}
          <motion.h2
            className="features-heading"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.8rem, 5vw, 3.8rem)",
              fontWeight: 500,
              color: "#fff",
              lineHeight: "1.15",
              marginBottom: 16,
            }}
          >
            Reasons you
            <br /> will
            <span
              style={{
                opacity: 0.55,
                fontStyle: "italic",
                fontFamily: "Instrument-serif",
              }}
            >
              {" "} love
            </span> us.
          </motion.h2>

          {/* SUBHEADING */}
          <motion.p
            className="features-sub"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              maxWidth: 640,
              margin: "0 auto 72px",
              color: "#9ca3af",
              fontSize: 16,
            }}
          >
            Once you try Limitless, you’ll never go anywhere else for design.
            Seriously.
          </motion.p>

          {/* FEATURES GRID */}
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 56,
            }}
          >
            {FEATURES.map((item, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.4 + i * 0.1,
                }}
              >
                {/* ICON */}
                <motion.div
                  whileHover={{
                    scale: 1.25,
                    filter:
                      "drop-shadow(0 0 22px rgba(255,255,255,0.85))",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                  }}
                  style={{
                    width: 52,
                    height: 52,
                    margin: "0 auto 18px",
                  }}
                >
                  {item.icon}
                </motion.div>

                <h4 style={{ color: "#fff", marginBottom: 8 }}>
                  {item.title}
                </h4>
                <p style={{ color: "#9ca3af", fontSize: 14 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            style={{
              marginTop: 80,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BookCallButton />
          </motion.div>
        </div>

        {/* PULSE */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 0.4;
              box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 14px rgba(34, 197, 94, 1);
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

/* ---------- DATA ---------- */

const FEATURES = [
  {
    title: "Design Board",
    desc: "Request unlimited designs on your own board.",
    icon: svgIcon("board"),
  },
  {
    title: "Lightning Fast Delivery",
    desc: "Receive your designs in just a few days.",
    icon: svgIcon("speed"),
  },
  {
    title: "Fixed Rate",
    desc: "Pay the same predictable price every month.",
    icon: svgIcon("price"),
  },
  {
    title: "Award-Winning Designs",
    desc: "Top-tier creative quality that stands out.",
    icon: svgIcon("award"),
  },
  {
    title: "Unlimited Revisions",
    desc: "We revise until you’re 100% satisfied.",
    icon: svgIcon("brush"),
  },
  {
    title: "Unique & All Yours",
    desc: "Every design is crafted exclusively for you.",
    icon: svgIcon("fingerprint"),
  },
];

/* ---------- SVG ICONS ---------- */

function svgIcon(type: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="52"
      height="52"
      style={{ opacity: 0.9 }}
    >
      {type === "board" && (
        <>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M7 8h6M7 12h10" />
        </>
      )}
      {type === "speed" && (
        <>
          <circle cx="12" cy="13" r="7" />
          <path d="M12 13l4-4" />
        </>
      )}
      {type === "price" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M12 8v8" />
        </>
      )}
      {type === "award" && (
        <>
          <path d="M7 4h10v4a5 5 0 01-10 0z" />
          <path d="M12 13v7" />
        </>
      )}
      {type === "brush" && (
        <>
          <path d="M14 4l6 6" />
          <path d="M4 20c4 0 6-2 6-6" />
        </>
      )}
      {type === "fingerprint" && (
        <>
          <path d="M12 2a6 6 0 016 6v4" />
          <path d="M12 6a2 2 0 012 2v6" />
        </>
      )}
    </svg>
  );
}
