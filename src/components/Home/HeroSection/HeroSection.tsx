"use client";

import HeroContent from "./HeroContent";
import HeroBackground from "./HeroBackground";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Recreated Background in Code */}
      <HeroBackground />

      {/* CONTENT */}
      <div className="hero-content-container">
        <div className="hero-inner">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}