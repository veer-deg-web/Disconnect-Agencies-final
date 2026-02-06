"use client";

import {
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import GradientText from "./GradientText";

/* =======================
   TYPES
======================= */

type Plan = {
  title: string;
  monthly: number;
  yearly: number;
  features: string[];
  highlight?: boolean;
};

interface PricingSectionProps {
  headingTitle?: string;
  headingGradient?: string[];
  accentColor?: string;
  plansOverride?: Plan[];
}

/* =======================
   DEFAULT DATA
======================= */

const defaultPlans: Plan[] = [
  {
    title: "Starter Plan",
    monthly: 999,
    yearly: 799,
    features: [
      "0.4% management fee",
      "AI rebalancing",
      "Market insights",
      "Advisor support",
    ],
  },
  {
    title: "Core Plan",
    monthly: 1999,
    yearly: 1599,
    features: [
      "0.35% management fee",
      "Advanced AI models",
      "Priority insights",
      "Dedicated advisor",
    ],
  },
  {
    title: "Vision Plan",
    monthly: 4999,
    yearly: 3999,
    highlight: true,
    features: [
      "0.2%–0.4% management fee",
      "Advanced AI strategies",
      "2.75% cash interest",
      "Investment team access",
      "Priority support & onboarding",
    ],
  },
];

/* =======================
   ANIMATION CONFIG
======================= */

const easeSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

const timeline = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeSmooth },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeSmooth },
  },
};

/* =======================
   COMPONENT
======================= */

export default function PricingSection({
  headingTitle = "Pricing Options",
  headingGradient = ["#5227FF", "#FF9FFC", "#B19EEF"],
  accentColor = "#ff5a00",
  plansOverride,
}: PricingSectionProps) {
  const plans = plansOverride ?? defaultPlans;

  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [billing, setBilling] =
    useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <section ref={ref} style={sectionStyle}>
      <motion.div variants={timeline} initial="hidden" animate={controls}>
        {/* HEADING */}
        <motion.h2 variants={fadeUp} style={headingStyle}>
          <GradientText
            colors={headingGradient}
            animationSpeed={8}
            showBorder={false}
          >
            {headingTitle}
          </GradientText>
        </motion.h2>

        {/* SUBTITLE */}
        <motion.p variants={fadeUp} style={subtitleStyle}>
          Choose the subscription plan that suits your needs
        </motion.p>

        {/* TOGGLE */}
        <motion.div variants={fadeUp} style={toggleWrap}>
          <div style={toggle}>
            <motion.div
              animate={{ left: billing === "monthly" ? "0%" : "50%" }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              style={toggleThumb}
            />

            <button
              onClick={() => setBilling("monthly")}
              style={{
                ...toggleBtn,
                color: billing === "monthly" ? "#000" : "#aaa",
              }}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              style={{
                ...toggleBtn,
                color: billing === "yearly" ? "#000" : "#aaa",
              }}
            >
              Yearly
            </button>
          </div>
        </motion.div>

        {/* CARDS */}
        <div className="pricing-grid" style={grid}>
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              variants={cardVariant}
              style={{
                ...card,
                ...(plan.highlight
                  ? {
                      background: `linear-gradient(180deg, ${accentColor}55, #1a1a1a)`,
                      border: `2px solid ${accentColor}`,
                    }
                  : {}),
              }}
            >
              <div>
                <div style={cardHeader}>
                  <h3>{plan.title}</h3>
                  {plan.highlight && (
                    <span
                      style={{
                        ...badge,
                        color: accentColor,
                      }}
                    >
                      Best Value
                    </span>
                  )}
                </div>

                <div style={priceWrap}>
                  {billing === "yearly" && (
                    <span style={strike}>
                      ${plan.monthly.toLocaleString()}
                    </span>
                  )}

                  <motion.span
                    key={billing}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: easeSmooth }}
                    style={price}
                  >
                    $
                    {(billing === "monthly"
                      ? plan.monthly
                      : plan.yearly
                    ).toLocaleString()}
                  </motion.span>
                </div>

                <p style={billingText}>
                  {billing === "monthly"
                    ? "Billed monthly"
                    : "Save 20% with annual billing"}
                </p>

                <ul style={list}>
                  {plan.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "auto" }}>
                
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MOBILE OVERRIDES */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =======================
   STYLES (UNCHANGED)
======================= */

const sectionStyle: React.CSSProperties = {
  padding: "160px 24px",
  background: "radial-gradient(circle at top, #151515, #000)",
  color: "#fff",
  textAlign: "center",
};

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(42px, 5vw, 56px)",
  fontWeight: 700,
};

const subtitleStyle: React.CSSProperties = {
  opacity: 0.7,
  marginTop: 12,
};

const toggleWrap: React.CSSProperties = {
  marginTop: 40,
};

const toggle: React.CSSProperties = {
  position: "relative",
  width: 200,
  height: 44,
  background: "#1f1f1f",
  borderRadius: 999,
  display: "flex",
  overflow: "hidden",
  margin: "0 auto",
};

const toggleThumb: React.CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "50%",
  background: "#fff",
  borderRadius: 999,
};

const toggleBtn: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  zIndex: 1,
};

const grid: React.CSSProperties = {
  maxWidth: 1200,
  margin: "80px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "#1a1a1a",
  borderRadius: 18,
  padding: 28,
  textAlign: "left",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  flexDirection: "column",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badge: React.CSSProperties = {
  background: "#fff",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
};

const priceWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  marginTop: 16,
};

const price: React.CSSProperties = {
  fontSize: 44,
  fontWeight: 700,
};

const strike: React.CSSProperties = {
  textDecoration: "line-through",
  opacity: 0.5,
};

const billingText: React.CSSProperties = {
  opacity: 0.6,
  marginBottom: 20,
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  lineHeight: 2,
};