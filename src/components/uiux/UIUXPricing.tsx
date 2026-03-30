"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import styles from "./UIUXPricing.module.css";

/* ---------------- UTILS ---------------- */

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/* ---------------- COMPONENT ---------------- */

export default function UIUXPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });

  const [cycleKey, setCycleKey] = useState(0);
  const [framerOn, setFramerOn] = useState(false);
  const [price, setPrice] = useState(10000); // Base price: $10,000
  const [isAnimating, setIsAnimating] = useState(false);

  /* 🔁 restart animation on every scroll */
  useEffect(() => {
    if (inView) {
      setCycleKey((k: number) => k + 1);
      setFramerOn(false);
      setPrice(10000);
      setIsAnimating(false);
    }
  }, [inView]);

  /* 💸 price scribble animation */
  useEffect(() => {
    if (!framerOn) {
      // When toggle is OFF, reset to base price immediately
      setPrice(10000);
      setIsAnimating(false);
      return;
    }

    // When toggle is ON, start the scribble animation
    setIsAnimating(true);
    let ticks = 0;
    const basePrice = 10000;
    const addonPrice = 500;
    const targetPrice = basePrice + addonPrice; // $10,500

    const interval = setInterval(() => {
      ticks++;
      // Animate between base price and target price
      setPrice(randomBetween(basePrice, targetPrice));

      if (ticks > 12) {
        clearInterval(interval);
        setPrice(targetPrice); // Settle at $10,500
        setIsAnimating(false);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [framerOn]);

  const handleToggle = () => {
    setFramerOn((prev: boolean) => !prev);
  };

  return (
    <section ref={ref} className={styles.section}>
      <div key={cycleKey} className={styles.container}>
        {/* ---------- PILL ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={styles.pill}
        >
          <span className={styles.dot} />
          Pricing
        </motion.div>

        {/* ---------- HEADING ---------- */}
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className={styles.heading}
        >
          Pricing that&apos;s so{" "}
          <span className={styles.simpleText}>
            simple.
          </span>
        </motion.h2>

        {/* ---------- SUB ---------- */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className={styles.subText}
        >
          We like to keep things simple with one, limitless plan.
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
                <span className={styles.greenDot} /> 3 spots left
              </div>

              <div className={styles.priceContainer}>
                <div className={styles.priceDisplay}>
                  ${price.toLocaleString()}
                  {framerOn && <span className={styles.addonText}> + $500</span>}
                </div>
                {isAnimating && <div className={styles.priceChangeIndicator}>...</div>}
              </div>

              <p className={styles.cardSub}>
                One request at a time. Pause or cancel anytime.
              </p>

              {/* BUTTONS */}
              <div className={styles.buttonRow}>
                <BookCallButton />
              </div>

              {/* TOGGLE (BELOW BUTTONS) */}
              <div className={styles.toggleContainer}>
                <div className={styles.toggleLabel}>Add-ons</div>
                <div className={styles.togglePill}>
                  <div className={styles.toggleLabelContainer}>
                    <span className={styles.framerText}>
                      Framer Development
                    </span>
                    <span className={styles.addonValuePill}>+ $500</span>
                  </div>
                  <button
                    onClick={handleToggle}
                    className={`${styles.toggleTrack} ${framerOn ? styles.active : ""}`}
                  >
                    <motion.span
                      animate={{ x: framerOn ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      className={`${styles.toggleThumb} ${framerOn ? styles.active : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* FEATURES LIST */}
              <div className={styles.featuresList}>
                {[
                  "Unlimited design requests",
                  "One request at a time",
                  "Average 48 hours delivery",
                  "Unlimited revisions",
                  "Unlimited brands",
                  "Invite unlimited users",
                  "Pause or cancel anytime",
                ].map((item, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
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