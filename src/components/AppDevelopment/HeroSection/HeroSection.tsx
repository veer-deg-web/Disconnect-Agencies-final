"use client";

import { useEffect, useState } from "react";
import "./HeroSection.css";

import Navbar from "@/components/HeroNavbar";
import BookCallButton from "@/components/BookCallButton";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import ShinyText from "@/components/ShinyText";
// import SplashCursor from "@/components/SplashCursor";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className={`hero ${loaded ? "hero--loaded" : ""}`}>
      {/* <SplashCursor /> */}

      <Navbar />

      {/* ================= TEXT ================= */}
      <div className="hero__content">
        <p className="hero__tag">NOVA SECURES PRE-SERIES A FUNDING →</p>

        <div className="hero__title">
          <ShinyText
            text="Concepts To Launch"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />

          <ShinyText
            text="We Deliver"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </div>

        <p className="hero__subtitle">
          We help you design, build, and scale modern mobile and web applications.
        </p>

        <div className="hero__cta">
          <BookCallButton />
        </div>
      </div>

      {/* ================= VISUAL ================= */}
      <div className="hero__visual">
        {/* BACKGROUND SHAPES */}
        <img
          src="/phone-shapes.png"
          alt=""
          className="hero-shapes"
        />

        {/* PHONE STACK */}
        <div className="phone-stack">
          <div className="phone-wrapper">
            <img
              src="/screen-bevel.png"
              alt="Phone frame"
              className="phone-frame"
            />

            <div className="phone-glass">
              <PhoneUI />
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOGOS (BELOW PHONE) ================= */}
      <div className="logos-below-phone">
        <UIUXShowcaseLogos
          title="Our designs are featured on:"
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

/* ---------------------------------- */
/* PHONE UI COMPONENT                  */
/* ---------------------------------- */

function PhoneUI() {
  return (
    <div className="phone-ui">
      <div className="phone-header">
        <span>Hello, Mary</span>
        <div className="icons">🔔 ✨</div>
      </div>

      <div className="balance">
        <p className="label">Boost Your Sales</p>
        <h2>$0.00</h2>
      </div>

      <div className="cards">
        <div className="card">
          <p>Income</p>
          <strong>$1,152.32</strong>
        </div>
        <div className="card">
          <p>Expense</p>
          <strong>$948.95</strong>
        </div>
      </div>

      <button className="ai-btn">
        Boost your savings with AI
      </button>

      <div className="goal">
        <p>Vacation to Bali</p>
        <strong>$2,203.60</strong>
      </div>
    </div>
    
  );
}