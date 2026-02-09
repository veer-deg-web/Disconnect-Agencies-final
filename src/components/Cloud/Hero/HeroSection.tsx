"use client";

import { motion } from "framer-motion";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="cloud-hero">
      {/* VIDEO BACKGROUND */}
     <motion.video
  className="cloud-video"
  src="/CloudHero.mov"
  autoPlay
  muted
  loop
  playsInline
  initial={{
    opacity: 0,
    y: 70,
    filter: "blur(14px)",
  }}
  animate={{
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  }}
  transition={{
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1],
  }}
/>

      {/* CONTENT */}
      <div className="cloud-inner">
        {/* LEFT */}
        <motion.h1
          className="cloud-left"
          initial={{ opacity: 0, filter: "blur(14px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1],delay: 1.25 }}
        >
          Cloud<span>.</span>
        </motion.h1>

        {/* RIGHT */}
        <motion.div
          className="cloud-right"
          initial={{ opacity: 0, filter: "blur(14px)", y: 24 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.1, delay: 1.45 }}
        >
          <span className="services">Services</span>
          <span className="ready">Ready</span>
        </motion.div>

        {/* META */}
        <motion.div
          className="cloud-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.45}}
        >
          © 2025
          <br />
          Agenz is a simple team uses aesthetic
          <br />
          and minimal
        </motion.div>

        
      </div>
    </section>
  );
}