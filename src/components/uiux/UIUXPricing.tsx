"use client";

import { motion, px, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BookCallButton from "@/components/BookCallButton";
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
      setCycleKey((k) => k + 1);
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
    setFramerOn((prev) => !prev);
  };

  const handleSubscribe = () => {
    console.log("Subscribe clicked");
  };

  const handleBookCall = () => {
    console.log("Book a call clicked");
  };

  return (
    <section
      ref={ref}
      style={{
        padding: "140px 24px",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <div
        key={cycleKey}
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* ---------- PILL ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={pillStyle}
        >
          <span style={dotStyle} />
          Pricing
        </motion.div>

        {/* ---------- HEADING ---------- */}
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          style={headingStyle}
        >
          Pricing that's so{" "}
          <span style={{ opacity: 0.55, fontStyle: "italic", fontFamily: "instrument-serif" }}>
            simple.
          </span>
        </motion.h2>

        {/* ---------- SUB ---------- */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          style={subStyle}
        >
          We like to keep things simple with one, limitless plan.
        </motion.p>

        {/* ---------- CARD + SPHERE ---------- */}
        <div style={layoutWrap}>
          {/* SPHERE ON LEFT */}


          {/* CARD ON RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={cardWrap}
          >
            {/* glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={sphereWrap}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={sphereVideo}
              >
                <source src="/Sphere.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <div style={cardGlow} />

            <div style={cardStyle}>
              <div style={spotsPill}>
                <span style={greenDot} /> 3 spots left
              </div>

              <div style={priceContainer}>
                <div style={priceStyle}>
                  ${price.toLocaleString()}
                  {framerOn && <span style={addonText}> + $500</span>}
                </div>
                {isAnimating && <div style={priceChangeIndicator}>...</div>}
              </div>

              <p style={cardSub}>
                One request at a time. Pause or cancel anytime.
              </p>

              {/* BUTTONS */}
              <div style={buttonRow}>
                <button

                  onClick={handleSubscribe}
                  style={primaryBtnStyle}
                >
                  Subscribe
                </button>
                <BookCallButton />
              </div>

              {/* TOGGLE (BELOW BUTTONS) */}
              <div style={toggleContainer}>
                <div style={toggleLabel}>Add-ons</div>
                <div style={togglePill}>
                  <div style={toggleLabelContainer}>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
                      Framer Development
                    </span>
                    <span style={addonPill}>+ $500</span>
                  </div>
                  <button
                    onClick={handleToggle}
                    style={{
                      ...toggleTrack,
                      background: framerOn ? "rgba(34, 197, 94, 0.2)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <motion.span
                      animate={{ x: framerOn ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      style={{
                        ...toggleThumb,
                        background: framerOn ? "#22c55e" : "#ffffff",
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* FEATURES LIST */}
              <div style={featuresList}>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>Unlimited design requests</span>
                </div>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>One request at a time</span>
                </div>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>Average 48 hours delivery</span>
                </div>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>Unlimited revisions</span>
                </div>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>Unlimited brands</span>
                </div>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>Invite unlimited users</span>
                </div>
                <div style={featureItem}>
                  <span style={checkIcon}>✓</span>
                  <span>Pause or cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---------- KEYFRAMES ---------- */}
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

        @keyframes priceChange {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @media (max-width: 900px) {
          .sphere {
            display: none;
          }
        }
      `}</style>
    </section>
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
  fontSize: "clamp(2.6rem, 5vw, 4rem)",
  fontWeight: 500,
  color: "#fff",
  lineHeight: 1.1,
  marginBottom: 16,
};

const subStyle = {
  maxWidth: 640,
  margin: "0 auto 72px",
  color: "#9ca3af",
  fontSize: 16,
};

const layoutWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 80,
  flexWrap: "wrap" as const,
  flexDirection: "row-reverse" as const,
};

/* CARD */

const cardWrap = {
  width: "100%",
  maxWidth: "400px",
  position: "relative" as const,
  overflow: "hidden",
};

const cardGlow = {
  position: "absolute" as const,

  background:
    "radial-gradient(circle at top right, rgba(124,58,237,0.35), transparent 60%)",
  zIndex: 0,
};

const cardStyle = {
  position: "relative" as const,
  overflow: "hidden",
  zIndex: 1,
  padding: "40px 32px 48px",
  maxWidth: "100%",
  borderRadius: 32,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
  textAlign: "left" as const,
};

const spotsPill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 14px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.12)",
  color: "#d1fae5",
  fontSize: 13,
  marginBottom: 18,
};

const greenDot = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "#22c55e",
};

const priceContainer = {
  marginBottom: 6,
};

const priceStyle = {
  fontSize: 56,
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#fff",
  display: "flex",
  alignItems: "baseline",
  gap: 8,
  minHeight: 68,
};

const addonText = {
  fontSize: 20,
  fontWeight: 400,
  color: "#9ca3af",
  opacity: 0.8,
};

const priceChangeIndicator = {
  fontSize: 14,
  color: "#9ca3af",
  height: 20,
  animation: "priceChange 0.5s infinite",
};

const cardSub = {
  color: "#9ca3af",
  fontSize: 15,
  marginBottom: 28,
};

/* BUTTONS */
const buttonRow = {
  display: "flex",
  gap: 12,
  marginBottom: 32,
};

const primaryBtnStyle = {
  flex: 1,
  padding: "16px 20px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 500,
};

const secondaryBtnStyle = {
  flex: 1,
  padding: "16px 20px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 500,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
};

/* TOGGLE */
const toggleContainer = {
  marginBottom: 28,
};

const toggleLabel = {
  color: "#9ca3af",
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 12,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const togglePill = {
  padding: "16px 20px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
};

const toggleLabelContainer = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flex: 1,
};

const addonPill = {
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,
  color: "#fff",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const toggleTrack = {
  width: 52,
  height: 28,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.25)",
  padding: 3,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "background 0.3s, box-shadow 0.3s",
};

const toggleThumb = {
  width: 22,
  height: 22,
  borderRadius: "50%",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

/* FEATURES LIST */
const featuresList = {
  marginBottom: 0,
  padding: "20px 0 0",
  borderTop: "1px solid rgba(255,255,255,0.08)",
};

const featureItem = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: "#fff",
  fontSize: 14,
  padding: "10px 0",
};

const checkIcon = {
  color: "#22c55e",
  fontSize: 16,
  fontWeight: "bold",
};

/* SPHERE */

const sphereWrap = {
  width: 380,
  height: 400,
  overflow: "hidden",
  borderRadius: "50%",
  marginRight: -40,
  position: "absolute" as const,
  transform: "translateY(-50%)",
  top: "50%",
  right: "-40%"
};

const sphereVideo = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.2)",
};