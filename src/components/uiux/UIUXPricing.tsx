"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import styles from "./UIUXPricing.module.css";

/* ---------------- PROPS ---------------- */

interface UIUXPricingProps {
  pillLabel?: string;
  heading?: React.ReactNode;
  subText?: string;
  basePrice?: number;
  addonLabel?: string;
  addonPrice?: number;
  spotText?: string;
  cardSub?: string;
  features?: string[];
  notIncluded?: string[];
  toggleLabel?: string;
  serviceSlug?: string;
}

/* ---------------- UTILS ---------------- */

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/* ---------------- COMPONENT ---------------- */

export default function UIUXPricing({
  pillLabel = "Pricing",
  heading = (
    <>
      Pricing that&apos;s so{" "}
      <span className={styles.simpleText}>simple.</span>
    </>
  ),
  subText = "One flat price. No surprises. Fully delivered and handed off.",
  basePrice = 2999,
  addonLabel = "Annual Maintenance",
  addonPrice = 1199,
  spotText = "3 spots left",
  cardSub = "One-time project fee. Design system delivered & handed off.",
  features = [
    "Product research & competitor analysis",
    "Wireframing (low → high fidelity)",
    "Design system (colors, typography, components)",
    "Full UI design (web/app)",
    "Responsive layouts",
    "Developer handoff (Figma/Docs)",
  ],
  notIncluded = ["Development", "Maintenance (unless add-on enabled)"],
  toggleLabel = "Add Maintenance",
  serviceSlug,
}: UIUXPricingProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });

  const [cycleKey, setCycleKey] = useState(0);
  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [price, setPrice] = useState(basePrice);
  const [isAnimating, setIsAnimating] = useState(false);

  /* 🔁 restart animation on every scroll */
  useEffect(() => {
    if (inView) {
      setCycleKey((k: number) => k + 1);
      setMaintenanceOn(false);
      setPrice(basePrice);
      setIsAnimating(false);
    }
  }, [inView, basePrice]);

  /* 💸 price scribble animation */
  useEffect(() => {
    if (!maintenanceOn) {
      setPrice(basePrice);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    let ticks = 0;
    const targetPrice = basePrice + addonPrice;

    const interval = setInterval(() => {
      ticks++;
      setPrice(randomBetween(basePrice, targetPrice));

      if (ticks > 12) {
        clearInterval(interval);
        setPrice(targetPrice);
        setIsAnimating(false);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [maintenanceOn, basePrice, addonPrice]);

  const handleToggle = () => {
    setMaintenanceOn((prev: boolean) => !prev);
  };

  return (
    <section ref={ref} className={styles.section}>
      <div key={cycleKey} className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={styles.pill}
        >
          <span className={styles.dot} />
          {pillLabel}
        </motion.div>

        {/* ---------- HEADING ---------- */}
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className={styles.heading}
        >
          {heading}
        </motion.h2>

        {/* ---------- SUB ---------- */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className={styles.subText}
        >
          {subText}
        </motion.p>

        {/* ---------- CARD + SPHERE ---------- */}
        <div className={styles.layoutWrap}>
          {/* CARD ON RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className={styles.cardWrap}
          >
            {/* sphere/video overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={styles.sphereWrap}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className={styles.sphereVideo}
              >
                <source src="/assets/Uiux/UIUXPricing/video/Sphere.mp4" type="video/mp4" />
              </video>
            </motion.div>

            {/* glow */}
            <div className={styles.cardGlow} />

            <div className={styles.card}>
              <div className={styles.spotsPill}>
                <span className={styles.greenDot} /> {spotText}
              </div>

              <div className={styles.priceContainer}>
                <div className={styles.priceDisplay}>
                  ${price.toLocaleString()}
                  {maintenanceOn && <span className={styles.addonText}> /yr maintenance</span>}
                </div>
                {isAnimating && <div className={styles.priceChangeIndicator}>...</div>}
              </div>

              <p className={styles.cardSub}>
                {cardSub}
              </p>

              {/* BUTTONS */}
              <div className={styles.buttonRow}>
                <BookCallButton />
              </div>

              {/* Know more pill — single centered pill below buttons */}
              {serviceSlug && (
                <div style={{ textAlign: "center", marginTop: "16px", display: "flex", justifyContent: "center" }}>
                  <Link
                    href={`/${serviceSlug}/pricing`}
                    className={styles.knowMorePill}
                    style={{
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Know more →
                  </Link>
                </div>
              )}

              {/* TOGGLE (BELOW BUTTONS) */}
              <div className={styles.toggleContainer}>
                <div className={styles.toggleLabel}>{toggleLabel}</div>
                <div className={styles.togglePill}>
                  <div className={styles.toggleLabelContainer}>
                    <span className={styles.framerText}>
                      {addonLabel}
                    </span>
                    <span className={styles.addonValuePill}>+ ${addonPrice.toLocaleString()}/yr</span>
                  </div>
                  <button
                    onClick={handleToggle}
                    className={`${styles.toggleTrack} ${maintenanceOn ? styles.active : ""}`}
                  >
                    <motion.span
                      animate={{ x: maintenanceOn ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      className={`${styles.toggleThumb} ${maintenanceOn ? styles.active : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* FEATURES LIST */}
              <div className={styles.featuresList}>
                {features.map((item, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
                {notIncluded.map((item, i) => (
                  <div key={i} className={styles.featureItem} style={{ opacity: 0.45 }}>
                    <span className={styles.checkIcon} style={{ color: "#888" }}>✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}