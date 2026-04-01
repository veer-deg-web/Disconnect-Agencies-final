"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/Shared/SpotlightCard/SpotlightCard";
import {
  SiLightning,
  SiClockify,
  SiGoogleanalytics,
} from "react-icons/si";
import { RiCustomerService2Line } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";
import { BsGraphUp } from "react-icons/bs";
import "./BenefitsSection.css";

const benefits = [
  {
    icon: SiLightning,
    title: "Increased Productivity",
    desc: "AI-Driven Automation Reduces Manual Effort and Accelerates Decision-Making.",
  },
  {
    icon: RiCustomerService2Line,
    title: "Better Customer Experience",
    desc: "Personalized AI Interactions Improve Response Times and Satisfaction.",
  },
  {
    icon: SiClockify,
    title: "24/7 Availability",
    desc: "AI Systems Operate Round-The-Clock Without Downtime.",
  },
  {
    icon: GiReceiveMoney,
    title: "Cost Reduction",
    desc: "Automate Repetitive Work and Optimize Operational Costs.",
  },
  {
    icon: SiGoogleanalytics,
    title: "Data-Driven Insights",
    desc: "Leverage Analytics to Make Smarter, Faster Business Decisions.",
  },
  {
    icon: BsGraphUp,
    title: "Scalability & Growth",
    desc: "AI Adapts to Your Business Needs Without Increasing Overhead.",
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
        Discover How AI Automation Enhances Efficiency, Reduces Costs,
        and Drives Smarter, Faster Business Processes.
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