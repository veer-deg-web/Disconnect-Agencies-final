"use client";

import {
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import GradientText from "@/components/Shared/GradientText/GradientText";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";


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

const easeSmooth = EASE_SMOOTH;

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
======================= */import styles from "./PricingSection.module.css";

export default function PricingSection({
  headingTitle = "Pricing Options",
  headingGradient = ["#FF512F", "#FF7B00", "#FFB347"],
  accentColor = "#FF7B00",
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
    <section ref={ref} className={styles.section}>
      <motion.div variants={timeline} initial="hidden" animate={controls}>
        {/* HEADING */}
        <motion.h2 variants={fadeUp} className={styles.heading}>
          <GradientText
            colors={headingGradient}
            animationSpeed={8}
            showBorder={false}
          >
            {headingTitle}
          </GradientText>
        </motion.h2>

        {/* SUBTITLE */}
        <motion.p variants={fadeUp} className={styles.subtitle}>
          Choose the subscription plan that suits your needs
        </motion.p>

        {/* TOGGLE */}
        <motion.div variants={fadeUp} className={styles.toggleWrap}>
          <div className={styles.toggle}>
            <motion.div
              animate={{ left: billing === "monthly" ? "0%" : "50%" }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={styles.toggleThumb}
            />

            <button
              onClick={() => setBilling("monthly")}
              className={styles.toggleBtn}
              style={{
                color: billing === "monthly" ? "#000" : "#aaa",
              }}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={styles.toggleBtn}
              style={{
                color: billing === "yearly" ? "#000" : "#aaa",
              }}
            >
              Yearly
            </button>
          </div>
        </motion.div>

        {/* CARDS */}
        <div className={`pricing-grid ${styles.grid}`}>
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              variants={cardVariant}
              className={`${styles.card} ${plan.highlight ? styles.cardHighlighted : ""}`}
              style={{
                ...WILL_CHANGE_TRANSFORM,
                ...(plan.highlight
                  ? ({
                      "--accent-color": accentColor,
                      "--accent-glow": `${accentColor}55`,
                    } as React.CSSProperties)
                  : {}),
              }}
            >
              <div>
                <div className={styles.cardHeader}>
                  <h3>{plan.title}</h3>
                  {plan.highlight && (
                    <span
                      className={styles.badge}
                      style={{
                        color: accentColor,
                      }}
                    >
                      Best Value
                    </span>
                  )}
                </div>

                <div className={styles.priceWrap}>
                  {billing === "yearly" && (
                    <span className={styles.strike}>
                      ${plan.monthly.toLocaleString()}
                    </span>
                  )}

                  <motion.span
                    key={billing}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: easeSmooth }}
                    className={styles.price}
                  >
                    $
                    {(billing === "monthly"
                      ? plan.monthly
                      : plan.yearly
                    ).toLocaleString()}
                  </motion.span>
                </div>

                <p className={styles.billingText}>
                  {billing === "monthly"
                    ? "Billed monthly"
                    : "Save 20% with annual billing"}
                </p>

                <ul className={styles.list}>
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
    </section>
  );
}
