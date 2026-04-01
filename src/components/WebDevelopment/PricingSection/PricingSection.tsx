"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const PLANS = {
  build: [
    {
      id: "starter",
      name: "Starter",
      price: "$4,999",
      suffix: "one-time",
      desc: "Perfect for small businesses and startups looking to establish their digital presence.",
      features: [
        "Business website / landing page",
        "Responsive UI",
        "Basic integrations",
        "SEO-ready structure",
        "Deployment",
        "2+ months maintenance included",
      ],
      highlight: false,
    },
    {
      id: "advanced",
      name: "Advanced",
      price: "$8,999",
      suffix: "one-time",
      desc: "For businesses ready to scale with dynamic features and robust architecture.",
      features: [
        "Everything in Starter",
        "Dashboard / dynamic features",
        "API integrations",
        "Authentication systems",
        "Scalable architecture",
        "2+ months maintenance included",
      ],
      highlight: true,
    },
  ],
  maintenance: [
    {
      id: "starter-m",
      name: "Starter",
      price: "$4,999",
      suffix: "+ $1,999/year",
      desc: "Keep your starter site running smoothly with ongoing upkeep.",
      features: [
        "Full system maintenance",
        "Bug fixes & monitoring",
        "Performance upkeep",
        "Security updates",
        "No new feature development",
        "Email support",
      ],
      highlight: false,
    },
    {
      id: "advanced-m",
      name: "Advanced",
      price: "$8,999",
      suffix: "+ $3,599/year",
      desc: "Priority maintenance for advanced systems — always secure and optimised.",
      features: [
        "Everything in Starter Maintenance",
        "Priority monitoring",
        "Faster issue resolution",
        "System health optimization",
        "No feature additions",
        "Priority support",
      ],
      highlight: true,
    },
  ],
};

export default function PricingSection() {
  const [tab, setTab] = useState<"build" | "maintenance">("build");

  const activePlans = PLANS[tab];

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
          Simple, transparent pricing — choose to build once or pair it with
          ongoing maintenance.
        </p>

        {/* TOGGLE */}
        <div style={toggleWrap}>
          <div style={toggleTrack}>
            <motion.div
              style={toggleThumb}
              animate={{ left: tab === "build" ? "4px" : "calc(50% + 4px)" }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
            <button
              type="button"
              onClick={() => setTab("build")}
              style={{
                ...toggleBtn,
                color: tab === "build" ? "#000" : "#aaa",
                position: "relative",
                zIndex: 1,
              }}
            >
              Without Maintenance
            </button>
            <button
              type="button"
              onClick={() => setTab("maintenance")}
              style={{
                ...toggleBtn,
                color: tab === "maintenance" ? "#000" : "#aaa",
                position: "relative",
                zIndex: 1,
              }}
            >
              With Maintenance
            </button>
          </div>
        </div>

        {tab === "maintenance" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "13px", color: "#888", marginTop: "12px" }}
          >
            Maintenance includes upkeep, security &amp; performance. No new
            features are added.
          </motion.p>
        )}
      </motion.div>

      {/* CARDS — stable grid, only content animates */}
      <div style={cardsGrid}>
        {activePlans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            style={plan.highlight ? enterpriseCard : starterCard}
          >
            {plan.highlight && (
              <span style={badge}>Most Popular</span>
            )}

            <h3 style={{ ...cardTitle, color: plan.highlight ? "#000" : "#fff" }}>
              {plan.name}
            </h3>
            <p style={{ ...cardDesc, color: plan.highlight ? "#333" : "rgba(255,255,255,0.6)" }}>
              {plan.desc}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${tab}-${plan.id}-price`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{ ...price, color: plan.highlight ? "#000" : "#fff" }}
              >
                {plan.price}
                <span
                  style={{
                    ...priceSuffix,
                    color: plan.highlight ? "#333" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {" "}
                  {plan.suffix}
                </span>
              </motion.div>
            </AnimatePresence>

            <ul
              style={{
                ...list,
                color: plan.highlight ? "#222" : "rgba(255,255,255,0.75)",
              }}
            >
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ── Know more pill — single centered pill below grid ── */}
      <div style={{ ...knowMoreRow, justifyContent: 'center', display: 'flex' }}>
        <div style={knowMoreCell}>
          <Link
            href="/WebDevelopment/pricing"
            style={{
              ...knowMorePill,
              borderColor: "#FF7B00",
              color: "#FF7B00",
            }}
          >
            Know more →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Styles ── */
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
  justifyContent: "center",
};

const toggleTrack: React.CSSProperties = {
  position: "relative",
  display: "flex",
  width: 340,
  height: 46,
  background: "#1f1f1f",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.08)",
  overflow: "hidden",
};

const toggleThumb: React.CSSProperties = {
  position: "absolute",
  top: "4px",
  bottom: "4px",
  width: "calc(50% - 8px)",
  background: "#fff",
  borderRadius: 999,
};

const toggleBtn: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const cardsGrid: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 32,
};

const starterCard: React.CSSProperties = {
  padding: 40,
  borderRadius: 24,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.08)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const enterpriseCard: React.CSSProperties = {
  padding: 40,
  borderRadius: 24,
  background: "#D6FF2A",
  position: "relative",
  display: "flex",
  flexDirection: "column",
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
  fontWeight: 700,
};

const cardTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  marginBottom: 12,
};

const cardDesc: React.CSSProperties = {
  fontSize: 14,
  marginBottom: 24,
  lineHeight: 1.6,
};

const price: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  marginBottom: 24,
  display: "flex",
  alignItems: "baseline",
  gap: 8,
  flexWrap: "wrap",
};

const priceSuffix: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 400,
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "0 0 32px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  fontSize: 14,
  flex: 1,
};


const knowMoreRow: React.CSSProperties = {
  maxWidth: 860,
  margin: "16px auto 0",
  padding: "0 24px",
};

const knowMoreCell: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const knowMorePill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 20px",
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.15)",
  background: "transparent",
  color: "rgba(255, 255, 255, 0.45)",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: "0.01em",
  textDecoration: "none",
  cursor: "pointer",
  transition: "border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s",
};
