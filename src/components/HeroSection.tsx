"use client";

import Image from "next/image";
import HeroNavbar from "./HeroNavbar";
import HeroContent from "./HeroContent";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Optimized Background Image */}
      <Image
        src="/her0-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-bg"
      />

      {/* Optional subtle overlay for readability */}
      <div className="hero-overlay" />

      {/* NAVBAR */}
      <div className="hero-navbar">
        <HeroNavbar />
      </div>

      {/* CONTENT */}
      <div className="hero-content-container">
        <div className="hero-inner">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}