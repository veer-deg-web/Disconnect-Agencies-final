"use client";

import { motion } from "framer-motion";
import ShinyText from "@/components/ShinyText";
import "./HeroSection.css";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  return (
    <section className="hero">
      {/* BACKGROUND VIDEO */}
      <motion.video
        className="hero-bg-video"
        src="/Hero-Ai.mov"
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="hero-grid" />

      <div className="hero-content">
        {/* ✅ NEW → PILL MORPH */}
        <motion.div
          className="hero-pill"
          initial={{
            maxWidth: 64,
            opacity: 0,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            maxWidth: 340,
          }}
          transition={{
            opacity: { duration: 0.4 },
            filter: { duration: 0.4 },
            maxWidth: {
              duration: 1.2,
              delay: 0.8,
              ease: easeOut,
            },
          }}
        >
          <span className="pill-badge">New</span>

          <motion.span
            className="pill-text"
            initial={{ opacity: 0, x: -6, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.4,
              delay: 0.65,
              ease: easeOut,
            }}
          >
            Automated Lead Generation
          </motion.span>
        </motion.div>

        {/* HEADING */}
        <motion.h1
          className="hero-heading"
          initial={{ opacity: 0, x: -80, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1.2, ease: easeOut }}
        >
          <ShinyText
            text={
              <>
                Intelligent Automation for
                <br />
                Modern Businesses.
              </>
            }
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={140}
            direction="left"
          />
        </motion.h1>

        {/* SUBTEXT + BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 2.1, ease: easeOut }}
        >
          <p className="hero-subtext">
            Xtract brings AI automation to your fingertips &amp; streamlines tasks.
          </p>

          <div className="hero-actions">
            <a className="btn-primary">Get in touch →</a>
            <a className="btn-secondary">View services</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}