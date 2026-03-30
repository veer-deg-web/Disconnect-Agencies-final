"use client";

import { motion } from "framer-motion";
import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import UIUXProcessShowcase from "./UIUXProcessShowcase";
import {
  UnderstandIcon,
  LayoutIcon,
  FinalizeIcon,
} from "./ProcessIcons";

import styles from "./UIUXProcess.module.css";

export default function UIUXProcess() {
  return (
    <section className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={styles.wrapper}
      >
        {/* PROCESS PILL */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={styles.pill}
        >
          <span className={styles.dot} />
          Process
        </motion.div>

        {/* HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.45,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={styles.heading}
        >
          Your designs,
          <br />
          <span className={styles.effortlesslyText}>
            effortlessly.
          </span>
        </motion.h2>

        {/* SUB HEADING */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.75,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={styles.subText}
        >
          Begin your design journey in three effortless steps.
        </motion.p>

        {/* STEPS */}
        <div className={styles.stepsGrid}>
          {[
            {
              icon: <UnderstandIcon />,
              title: "Understand",
              desc: "We discuss your needs and build the understanding.",
            },
            {
              icon: <LayoutIcon />,
              title: "Layout",
              desc: "We deliver your design fast & effectively.",
            },
            {
              icon: <FinalizeIcon />,
              title: "Finalize",
              desc: "We revise until you’re 100% satisfied.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.45 }}
              className={styles.step}
            >
              <motion.div
                className={styles.stepIcon}
                whileHover={{
                  scale: 1.25,
                  filter:
                    "drop-shadow(0 0 24px rgba(255,255,255,0.85))",
                }}
              >
                {step.icon}
              </motion.div>

              <h4 className={styles.stepTitle}>
                {step.title}
              </h4>
              <p className={styles.stepDesc}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaContainer}>
          <BookCallButton />
        </div>

        {/* SHOWCASE */}
        <motion.div className={styles.showcaseWrapper}>
          <UIUXProcessShowcase />
        </motion.div>
      </motion.div>
    </section>
  );
}
