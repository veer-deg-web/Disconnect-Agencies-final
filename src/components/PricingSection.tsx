"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GradientText from "@/components/Shared/GradientText/GradientText";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";
import styles from "./PricingSection.module.css";

/* =======================
   TYPES
======================= */

type Plan = {
  title: string;
  price: string;
  subtitle: string;
  highlight: boolean;
  badge: string | null;
  note: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
};

type PricingPlans = {
  build: Plan[];
  maintenance: Plan[];
};

interface PricingSectionProps {
  headingTitle?: string;
  headingGradient?: string[];
  accentColor?: string;
  plansOverride?: PricingPlans;
  /** When set, every card CTA links to /[serviceSlug]/pricing */
  serviceSlug?: string;
}

/* =======================
   DEFAULT DATA  (Home page — general plans)
======================= */

const defaultPlans: PricingPlans = {
  build: [
    {
      title: "Starter Plan",
      price: "$4,999",
      subtitle: "One-time project",
      highlight: false,
      badge: null,
      note: "2+ months maintenance included",
      features: [
        "UI/UX Design + Development",
        "7-day strategy & planning session",
        "Core system delivery",
        "Deployment support",
        "2+ months maintenance included",
        "Post-delivery handover",
      ],
      cta: "Start Project",
    },
    {
      title: "Core Plan",
      price: "$8,999",
      subtitle: "One-time project",
      highlight: false,
      badge: null,
      note: "2+ months maintenance included",
      features: [
        "Everything in Starter",
        "Advanced system architecture",
        "Scalable & optimized build",
        "Priority execution",
        "2+ months maintenance included",
        "Extended support & handover",
      ],
      cta: "Start Project",
    },
    {
      title: "Vision Plan",
      price: "$15,999",
      subtitle: "End-to-end execution",
      highlight: true,
      badge: "Best Value",
      note: "2+ months maintenance included",
      features: [
        "Everything in Core",
        "Complete ownership: Design → Development → Deployment",
        "Advanced systems & automation",
        "High-performance infrastructure",
        "On-site strategy session",
        "2+ months premium maintenance included",
      ],
      cta: "Start Project",
    },
  ],
  maintenance: [
    {
      title: "Starter Plan",
      price: "$4,999",
      subtitle: "+ $1,999/year",
      highlight: false,
      badge: null,
      note: "40% of project cost yearly",
      features: [
        "Full system maintenance",
        "Bug fixes & monitoring",
        "Performance upkeep",
        "Security updates",
        "No new feature development",
        "Email support",
      ],
      cta: "Continue Maintenance",
    },
    {
      title: "Core Plan",
      price: "$8,999",
      subtitle: "+ $3,599/year",
      highlight: false,
      badge: null,
      note: "40% of project cost yearly",
      features: [
        "Everything in Starter Maintenance",
        "Priority monitoring",
        "Faster issue resolution",
        "System health optimization",
        "No feature additions",
        "Priority support",
      ],
      cta: "Continue Maintenance",
    },
    {
      title: "Vision Plan",
      price: "$15,999",
      subtitle: "+ $6,399/year",
      highlight: true,
      badge: "Recommended",
      note: "40% of project cost yearly",
      features: [
        "Everything in Core Maintenance",
        "Dedicated team oversight",
        "Advanced monitoring & scaling",
        "Critical priority support",
        "Long-term system stability",
        "No feature additions (maintenance only)",
      ],
      cta: "Full Partnership",
    },
  ],
};

/* =======================
   ANIMATION CONFIG
======================= */

const easeSmooth = EASE_SMOOTH;

const timeline = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.15, staggerChildren: 0.18 },
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
  headingGradient = ["#FF512F", "#FF7B00", "#FFB347"],
  accentColor = "#FF7B00",
  plansOverride,
  serviceSlug,
}: PricingSectionProps) {
  const plans = plansOverride ?? defaultPlans;

  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [tab, setTab] = useState<"build" | "maintenance">("build");

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const activePlans = plans[tab];

  return (
    <section ref={ref} className={styles.section}>
      <motion.div variants={timeline} initial="hidden" animate={controls}>
        {/* HEADING */}
        <motion.h2 variants={fadeUp} className={styles.heading}>
          <GradientText colors={headingGradient} animationSpeed={8} showBorder={false}>
            {headingTitle}
          </GradientText>
        </motion.h2>

        {/* TAGLINE */}
        <motion.p variants={fadeUp} className={styles.tagline} style={{ color: accentColor }}>
          &ldquo;We don&apos;t sell features. We build systems — and maintain them.&rdquo;
        </motion.p>

        {/* SUBTITLE */}
        <motion.p variants={fadeUp} className={styles.subtitle}>
          Choose how you want to work with us
        </motion.p>

        {/* MAINTENANCE TOGGLE */}
        <motion.div variants={fadeUp} className={styles.toggleWrap}>
          <div className={styles.toggle}>
            <motion.div
              animate={{ left: tab === "build" ? "0%" : "50%" }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={styles.toggleThumb}
            />
            <button
              onClick={() => setTab("build")}
              className={styles.toggleBtn}
              style={{ color: tab === "build" ? "#000" : "#aaa" }}
            >
              Without Maintenance
            </button>
            <button
              onClick={() => setTab("maintenance")}
              className={styles.toggleBtn}
              style={{ color: tab === "maintenance" ? "#000" : "#aaa" }}
            >
              With Maintenance
            </button>
          </div>

          {tab === "maintenance" && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={styles.maintenanceNote}
            >
              Maintenance includes upkeep, security &amp; performance. No new features are added.
            </motion.p>
          )}
        </motion.div>

        {/* CARDS */}
        <div
          className={`pricing-grid ${styles.grid}`}
          style={
            activePlans.length === 1
              ? { gridTemplateColumns: "minmax(0, 420px)" }
              : activePlans.length === 2
              ? { gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 860 }
              : undefined
          }
        >
          {activePlans.map((plan) => (
            <motion.div
              key={`${tab}-${plan.title}`}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
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
                {/* Header */}
                <div className={styles.cardHeader}>
                  <h3>{plan.title}</h3>
                  {plan.badge && (
                    <span
                      className={styles.badge}
                      style={{
                        color: accentColor,
                        background: `${accentColor}1a`,
                        borderColor: `${accentColor}55`,
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className={styles.priceWrap}>
                  <motion.span
                    key={`${tab}-${plan.title}-price`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: easeSmooth }}
                    className={styles.price}
                  >
                    {plan.price}
                  </motion.span>
                </div>

                <p className={styles.billingText}>{plan.subtitle}</p>
                <p className={styles.notePill}>{plan.note}</p>

                {/* Included */}
                <ul className={styles.list}>
                  {plan.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>

                {/* Not included */}
                {plan.notIncluded && plan.notIncluded.length > 0 && (
                  <ul className={`${styles.list} ${styles.listExcluded}`}>
                    {plan.notIncluded.map((f) => (
                      <li key={f}>✕ {f}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {/* ── Know more pill — single centered pill below grid ── */}
        {serviceSlug && (
          <div className={styles.knowMoreRow} style={{ justifyContent: 'center', display: 'flex' }}>
            <Link
              href={`/${serviceSlug}/pricing`}
              className={styles.knowMorePill}
              style={{
                borderColor: accentColor,
                color: accentColor,
              }}
            >
              Know more →
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
