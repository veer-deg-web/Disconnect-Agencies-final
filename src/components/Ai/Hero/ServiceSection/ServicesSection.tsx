"use client";

import { motion, Variants } from "framer-motion";
import "./ServicesSection.css";

const services = [
  {
    tag: "Workflow Automation",
    title: "Automate repetitive tasks",
    description:
      "We help you streamline internal operations by automating manual workflows like data entry, reporting, and approval chains.",
    video: "/service1.mov",
  },
  {
    tag: "AI Assistants",
    title: "Delegate daily tasks",
    description:
      "Free your team from routine work by delegating daily tasks to intelligent AI agents.",
    video: "/service2.mov",
  },
  {
    tag: "Sales Automation",
    title: "Accelerate sales growth",
    description:
      "Automate lead qualification, follow-ups, and CRM updates to increase conversions.",
    video: "/service3.mov",
  },
  {
    tag: "Custom AI Systems",
    title: "Build smarter systems",
    description:
      "We design scalable AI systems tailored to your workflows.",
    video: "/service4.mov",
  },
];

const easeSmooth = [0.22, 1, 0.36, 1] as const;

// Video swipe-up animation (INSIDE div)
const videoSwipeVariant: Variants = {
  hidden: {
    y: "70%", // ⬅ starts lower inside container
  },
  show: {
    y: "0%",
    transition: {
      duration: 2.4, // ⬅ slow & premium
      ease: easeSmooth,
    },
  },
};

// Text card rise
const textVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeSmooth },
  },
};

export default function ServicesSection() {
  return (
    <section className="services">
      <div className="services-container">
        <div className="services-list">
          {services.map((service, index) => {
            const reverse = index % 2 !== 0;

            return (
              <div
                key={index}
                className={`service-row ${reverse ? "reverse" : ""}`}
              >
                {/* VIDEO CARD (MASK) */}
                <div className="services-card services-video">
                  <motion.video
                    src={service.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    variants={videoSwipeVariant}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                  />
                </div>

                {/* TEXT CARD */}
                <motion.div
                  className="services-card services-text"
                  variants={textVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="services-tag">{service.tag}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}