"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/HeroNavbar";
import ShinyText from "@/components/ShinyText";
import ReviewsMarquee from "./ReviewsMarquee";
import "./Hero.css";

export default function HeroSection() {
  return (
    <section className="seo-hero">
      <Navbar />

      <div className="seo-hero__content">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          

<ShinyText
  text={`Strategic Marketing
That Cuts Through
the Clutter`}
  speed={2}
  delay={0}
  color="#ffffff"
  shineColor="#7aa2ff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/>
        </motion.h1>

        <p>
          We help brands disconnect from digital chaos and reconnect with
          clarity, visibility, and real results.
        </p>

        <ReviewsMarquee />
      </div>
    </section>
  );
}