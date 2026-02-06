"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";
import {
  SiLightning,
  SiHappycow,
  SiClockify,
  SiCashapp,
  SiGoogleanalytics,
  SiKubernetes,
} from "react-icons/si";
import "./BenefitsSection.css";

const benefits = [
  {
    icon: SiLightning,
    title: "Increased Productivity",
    desc: "AI-driven automation reduces manual effort and accelerates decision-making.",
  },
  {
    icon: SiHappycow,
    title: "Better Customer Experience",
    desc: "Personalized AI interactions improve response times and satisfaction.",
  },
  {
    icon: SiClockify,
    title: "24/7 Availability",
    desc: "AI systems operate round-the-clock without downtime.",
  },
  {
    icon: SiCashapp,
    title: "Cost Reduction",
    desc: "Automate repetitive work and optimize operational costs.",
  },
  {
    icon: SiGoogleanalytics,
    title: "Data-Driven Insights",
    desc: "Leverage analytics to make smarter, faster business decisions.",
  },
  {
    icon: SiKubernetes,
    title: "Scalability & Growth",
    desc: "AI adapts to your business needs without increasing overhead.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section">
      {/* LABEL */}
      <motion.span
        className="benefits-label"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Benefits
      </motion.span>

      {/* HEADING */}
      <motion.h2
        className="benefits-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        The Key Benefits of AI for <br /> Your Business Growth
      </motion.h2>

      {/* SUBTEXT */}
      <motion.p
        className="benefits-subtext"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Discover how AI automation enhances efficiency, reduces costs,
        and drives smarter, faster business processes.
      </motion.p>

      {/* GRID */}
      <div className="benefits-grid">
        {benefits.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
            >
              <SpotlightCard
                className="benefits-card"
                spotlightColor="rgba(124, 58, 237, 0.25)"
              >
                <div className="benefits-card-content">
                  <Icon className="benefits-icon" />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}