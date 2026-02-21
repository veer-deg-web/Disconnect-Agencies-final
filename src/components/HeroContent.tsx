"use client";

import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import BookCallButton from "./BookCallButton";
import ShinyText from "./ShinyText";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";

/* ================= ANIMATIONS ================= */

const panDown = {
  hidden: { opacity: 0, y: 12, scale: 1.02 },
  hero: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_SMOOTH },
  },
};

const pillPan = {
  hidden: { opacity: 0, y: 12, scale: 1.02 },
  pill: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_SMOOTH },
  },
};

const textContainer = {
  hidden: {},
  text: { transition: { staggerChildren: 0.025 } },
};

const textWord = {
  hidden: { opacity: 0 },
  text: { opacity: 1, transition: { duration: 0.4 } },
};

const buttonGroup = {
  hidden: {},
  buttons: { transition: { staggerChildren: 0.3 } },
};

const riseUp = {
  hidden: { opacity: 0, y: 12 },
  buttons: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_SMOOTH },
  },
};

const trustedVariant = {
  hidden: { opacity: 0, y: 12 },
  trusted: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_SMOOTH },
  },
};

/* ================= COMPONENT ================= */

export default function HeroContent() {
  const controls = useAnimationControls();

  useEffect(() => {
    const sequence = () => {
      controls.start("hero");
      controls.start("pill");
      setTimeout(() => controls.start("text"), 150);
      setTimeout(() => controls.start("buttons"), 300);
      setTimeout(() => controls.start("trusted"), 500);
    };
    sequence();
  }, [controls]);

  return (
    <>
      <ShootingStars />

      <div
        className="hero-wrap"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingLeft: "240px",
          paddingRight: "240px",
          ...WILL_CHANGE_TRANSFORM,
        }}
      >
        {/* Pill */}
        <motion.div variants={pillPan} initial="hidden" animate={controls}>
          <GlowingPill />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="hero-heading"
          variants={panDown}
          initial="hidden"
          animate={controls}
          style={{ fontSize: "75px", fontWeight: 600, lineHeight: 1.2 }}
        >
          <ShinyText
            text="Disconnect Agencies"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#FF5C00"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          className="hero-para"
          variants={textContainer}
          initial="hidden"
          animate={controls}
          style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}
        >
          {`Ideate, refine, and build your vision into a fully functional product with seamless design, smart strategy, and impactful user-focused execution.`
            .split(" ")
            .map((word, i) => (
              <motion.span
                key={i}
                variants={textWord}
                style={{ marginRight: "6px", display: "inline-block" }}
              >
                {word}
              </motion.span>
            ))}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="hero-buttons"
          variants={buttonGroup}
          initial="hidden"
          animate={controls}
          style={{ display: "flex", gap: "16px", marginBottom: "40px" }}
        >
          <motion.div variants={riseUp}>
            <BookCallButton />
          </motion.div>

          <motion.div variants={riseUp}>
            <MorphingLoginButton />
          </motion.div>
        </motion.div>

        {/* Trusted */}
        <motion.div
          variants={trustedVariant}
          initial="hidden"
          animate={controls}
        >
          <TrustedBy />
        </motion.div>
      </div>
    </>
  );
}

/* ================= SUB COMPONENTS ================= */

export function MorphingLoginButton() {
  const [hover, setHover] = React.useState(false);

  return (
    <motion.button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={{
        width: hover ? "120px" : "73px",
        backgroundColor: hover ? "#fff" : "rgba(255,255,255,0.25)",
        color: hover ? "rgb(255,170,90)" : "#fff",
        borderColor: hover ? "#fff" : "rgba(255,255,255,0.35)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        height: "40px",
        borderRadius: "999px",
        border: "1px solid",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}
    >
      {hover ? "Book a Call" : "Login"}
    </motion.button>
  );
}

export function GlowingPill() {
  return (
    <div
      className="glow-pill"
      style={{
        width: "347px",
        height: "27px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        background:
          "linear-gradient(135deg, rgba(255,140,64,0.25), rgba(120,40,0,0.35))",
        border: "1px solid rgba(255,170,90,0.45)",
        color: "#fff",
        fontSize: "14px",
      }}
    >
      <span>{"</>"}</span>
      <span>We deliver your needs with perfection</span>
    </div>
  );
}

/* ================= SHOOTING STARS ================= */

function ShootingStar({ left, delay }: { left: string; delay: number }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left,
        top: "40%",
        width: "2px",
        height: "120px",
        background:
          "linear-gradient(to top, rgba(255,160,80,0), rgba(255,160,80,0.9))",
        filter: "blur(0.5px)",
      }}
      animate={{ y: ["0%", "-340%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 4,
        delay,
      }}
    />
  );
}

function ShootingStars() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <ShootingStar left="18%" delay={0} />
      <ShootingStar left="26%" delay={1} />
      <ShootingStar left="82%" delay={2} />
    </div>
  );
}

/* ================= TRUSTED ================= */

function TrustedBy() {
  const images = [
    { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=64&h=64&fit=crop", alt: "User 1" },
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop", alt: "User 2" },
    { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop", alt: "User 3" },
    { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop", alt: "User 4" },
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop", alt: "User 5" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ display: "flex" }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 28,
              marginRight: i === images.length - 1 ? 0 : -6,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #000",
              position: "relative"
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="28px"
            />
          </div>
        ))}
      </div>
      <span style={{ fontSize: "14px", color: "#fff", fontWeight: 300 }}>
        Trusted already by 1.2k+
      </span>
    </div>
  );
}
