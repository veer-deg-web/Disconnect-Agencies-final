"use client";

import Navbar from "@/components/HeroNavbar";
import { motion, Variants } from "framer-motion";
import './Hero.css';
import ShinyText from "../../ShinyText";
import UIUXShowcaseLogos from "../../uiux/UIUXShowcaseLogos";

/* =========================
   FRAMER MOTION VARIANTS
========================= */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // ✅ cubic-bezier (premium feel)
    },
  },
};

/* =========================
   COMPONENT
========================= */

export default function Hero() {
  return (
    <section className="hero-webdev">
      {/* Background Video */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        {/* Replace with your actual video */}
        <source src="/earth-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="hero-overlay" />

      <Navbar />

      <motion.div
        className="hero-webdev__content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div className="hero-badge" variants={item}>
          <span className="blink-dot" />
          <span><ShinyText
  text="We Deliver Stunning Websites Like Never BeforeDisconnect Agencies"
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#c7ff1a"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/></span>
        </motion.div>

        {/* Title */}
        <motion.h1 className="hero-webdev__title" variants={item}>
          Turn your big idea into a <br /> stunning website
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="hero-webdev__subtitle" variants={item}>
          Tool that turn bold ideas into interactive, visually striking
          websites that capture attention and keep people coming back.
        </motion.p>

        {/* Buttons */}
        <motion.div className="hero-actions" variants={item}>
          <button className="btn-primary">
            → Get Started Now
          </button>
          <button className="btn-secondary">
            See Pricing
          </button>
        </motion.div>
      </motion.div>
      <div className="logos-below-phone">
              <UIUXShowcaseLogos
                title="partnering with world leading enterprises:"
                logos={[
                  "DO",
                  "Logoipsum",
                  "IPSUM",
                  "∞∞",
                  "logoipsum",
                  "Logoips",
                ]}
              />
            </div>
    </section>
  );
}