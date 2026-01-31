"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section style={section}>
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        style={headingWrap}
      >
        <h2 style={heading}>Flexible pricing for every stage</h2>
        <p style={subheading}>
          Fintech is its potential to promote financial inclusion. In many parts
          of the world, millions of people lack access to traditional banking
          services.
        </p>

        {/* TOGGLE */}
        <div style={toggleWrap}>
          <span style={{ ...toggleLabel, opacity: billing === "monthly" ? 1 : 0.5 }}>
            Monthly
          </span>

          <button
            type="button"
            aria-label="Toggle billing"
            onClick={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
            style={toggle}
          >
            <motion.span
              animate={{ left: billing === "yearly" ? 28 : 4 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              style={toggleDot}
            />
          </button>

          <span style={{ ...toggleLabel, opacity: billing === "yearly" ? 1 : 0.5 }}>
            Yearly
          </span>
        </div>
      </motion.div>

      {/* CARDS */}
      <div style={cardsGrid}>
        {/* STARTER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={starterCard}
        >
          <h3 style={cardTitle}>Starter Plan</h3>
          <p style={cardDesc}>
            Perfect for small businesses and startups looking to establish their
            digital presence.
          </p>

          <div style={price}>
            ${billing === "monthly" ? "299" : "2999"}
            <span style={priceSuffix}>
              / {billing === "monthly" ? "month" : "year"}
            </span>
          </div>

          <ul style={list}>
            <li>Basic strategy consultation</li>
            <li>Social media setup</li>
            <li>Monthly performance reports</li>
            <li>Dedicated Support Team</li>
          </ul>

          <button style={outlineBtn}>Get Started Now</button>
        </motion.div>

        {/* ENTERPRISE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          style={enterpriseCard}
        >
          <span style={badge}>Most Popular</span>

          <h3 style={{ ...cardTitle, color: "#000" }}>Enterprise Plan</h3>
          <p style={{ ...cardDesc, color: "#000" }}>
            Perfect for businesses with complex needs and scale requirements.
          </p>

          <div style={{ ...price, color: "#000" }}>
            ${billing === "monthly" ? "799" : "7999"}
            <span style={priceSuffix}>
              / {billing === "monthly" ? "month" : "year"}
            </span>
          </div>

          <ul style={{ ...list, color: "#000" }}>
            <li>Advanced analytics & reporting</li>
            <li>Full-service strategy execution</li>
            <li>Custom integrations</li>
            <li>Dedicated Support Team</li>
          </ul>

          <button style={solidBtn}>Get Started Now</button>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================
   STYLES
======================= */

const section: React.CSSProperties = {
  padding: "140px 24px",
  background: "radial-gradient(circle at top, #141414, #000)",
  color: "#fff",
};

const headingWrap: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto 80px",
  textAlign: "center",
};

const heading: React.CSSProperties = {
  fontSize: "clamp(34px, 5vw, 52px)",
  fontWeight: 700,
  marginBottom: 16,
};

const subheading: React.CSSProperties = {
  fontSize: 15,
  opacity: 0.7,
  maxWidth: 720,
  margin: "0 auto 32px",
};

const toggleWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
};

const toggleLabel: React.CSSProperties = {
  fontSize: 14,
};

const toggle: React.CSSProperties = {
  width: 52,
  height: 28,
  borderRadius: 999,
  background: "#222",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
  position: "relative",
};

const toggleDot: React.CSSProperties = {
  width: 20,
  height: 20,
  background: "#fff",
  borderRadius: "50%",
  position: "absolute",
  top: 4,
  left: 4,
};

const cardsGrid: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 32,
};

const starterCard: React.CSSProperties = {
  padding: 40,
  borderRadius: 24,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const enterpriseCard: React.CSSProperties = {
  padding: 40,
  borderRadius: 24,
  background: "#D6FF2A",
  position: "relative",
};

const badge: React.CSSProperties = {
  position: "absolute",
  top: 20,
  right: 20,
  background: "#fff",
  color: "#000",
  fontSize: 12,
  padding: "6px 12px",
  borderRadius: 999,
};

const cardTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  marginBottom: 12,
};

const cardDesc: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.75,
  marginBottom: 24,
};

const price: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  marginBottom: 24,
};

const priceSuffix: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
  marginLeft: 6,
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "0 0 32px",
  display: "grid",
  gap: 10,
  fontSize: 14,
};

const outlineBtn: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: 999,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "#fff",
  cursor: "pointer",
};

const solidBtn: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: 999,
  background: "#fff",
  border: "none",
  color: "#000",
  cursor: "pointer",
};