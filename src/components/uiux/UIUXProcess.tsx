"use client";

import { motion } from "framer-motion";
import BookCallButton from "@/components/BookCallButton";
import UIUXProcessShowcase from "./UIUXProcessShowcase";
import {
  UnderstandIcon,
  LayoutIcon,
  FinalizeIcon,
} from "./ProcessIcons";

export default function UIUXProcess() {
  return (
    <>
      {/* MOBILE-ONLY RULES (344px SAFE) */}
      <style>
        {`
          @media (max-width: 768px) {
            .process-wrapper {
              padding: 64px 20px !important;
            }

            .process-heading {
              font-size: 2.2rem !important;
            }

            .process-steps {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            .process-sub {
              margin-bottom: 48px !important;
            }
          }
        `}
      </style>

      <section
        style={{
          padding: "140px 24px",
          backgroundColor: "#000",
        }}
      >
        <motion.div
          className="process-wrapper"
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
          {/* PROCESS PILL */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
            Process
          </motion.div>

          {/* HEADING */}
          <motion.h2
            className="process-heading"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontSize: "clamp(2.6rem, 5vw, 3.6rem)",
              fontWeight: 500,
              color: "#fff",
              marginBottom: 12,
              lineHeight: 1.1,
            }}
          >
            Your designs,
            <br />
            <span
              style={{
                opacity: 0.55,
                fontStyle: "italic",
                fontFamily: "instrument-serif",
              }}
            >
              effortlessly.
            </span>
          </motion.h2>

          {/* SUB HEADING */}
          <motion.p
            className="process-sub"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.75,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              maxWidth: 560,
              margin: "0 auto 64px",
              color: "#9ca3af",
              fontSize: 16,
            }}
          >
            Begin your design journey in three effortless steps.
          </motion.p>

          {/* STEPS */}
          <div
            className="process-steps"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 48,
              marginBottom: 72,
            }}
          >
            {[
              {
                icon: <UnderstandIcon />,
                title: "Understand",
                desc: "We discuss your needs and build the understanding.",
              },
              {
                icon: <LayoutIcon />,
                title: "Layout",
                desc: "We deliver your design fast & effectively.",
              },
              {
                icon: <FinalizeIcon />,
                title: "Finalize",
                desc: "We revise until you’re 100% satisfied.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.45 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.25,
                    filter:
                      "drop-shadow(0 0 24px rgba(255,255,255,0.85))",
                  }}
                >
                  {step.icon}
                </motion.div>

                <h4 style={{ marginTop: 16, color: "#fff" }}>
                  {step.title}
                </h4>
                <p style={{ color: "#9ca3af", fontSize: 14 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BookCallButton />
          </div>

          {/* SHOWCASE */}
          <motion.div style={{ marginTop: 96 }}>
            <UIUXProcessShowcase />
          </motion.div>
        </motion.div>
      </section>

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
    </>
  );
}
