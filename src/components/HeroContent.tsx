"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import BookCallButton from "./BookCallButton";
import ShinyText from "./ShinyText";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";

/* ================= ANIMATIONS ================= */

const panDown = {
  hidden: { opacity: 0, y: 28, scale: 1.05 },
  hero: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE_SMOOTH },
  },
};

const pillPan = {
  hidden: { opacity: 0, y: 28, scale: 1.05 },
  pill: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE_SMOOTH },
  },
};

const textContainer = {
  hidden: {},
  text: { transition: { staggerChildren: 0.035 } },
};

const textWord = {
  hidden: { opacity: 0 },
  text: { opacity: 1, transition: { duration: 0.5 } },
};

const buttonGroup = {
  hidden: {},
  buttons: { transition: { staggerChildren: 0.4 } },
};

const riseUp = {
  hidden: { opacity: 0, y: 24 },
  buttons: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_SMOOTH },
  },
};

const trustedVariant = {
  hidden: { opacity: 0, y: 24 },
  trusted: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_SMOOTH },
  },
};

/* ================= COMPONENT ================= */

export default function HeroContent() {
  const controls = useAnimationControls();

  useEffect(() => {
    setTimeout(() => controls.start("hero"), 0);
    setTimeout(() => controls.start("pill"), 250);
    setTimeout(() => controls.start("text"), 500);
    setTimeout(() => controls.start("buttons"), 1500);
    setTimeout(() => controls.start("trusted"), 2500);
  }, [controls]);

  return (
    <>
      {/* MOBILE OVERRIDES ONLY */}
      <style>
        {`
          @media (max-width: 768px) {
            .hero-wrap {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }

            .hero-heading {
              font-size: clamp(36px, 9vw, 48px) !important;
              line-height: 1.15 !important;
            }

            .hero-para {
              font-size: 15px !important;
            }

            .hero-buttons {
              flex-direction: column;
              gap: 14px;
              width: 100%;
            }

            .hero-buttons > div {
              width: 100%;
              display: flex;
              justify-content: center;
            }

            .glow-pill {
              width: 100% !important;
              max-width: 320px;
              font-size: 13px !important;
            }
          }
        `}
      </style>

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
  const [hover,     setHover]     = useState(false);
  const [cardOpen,  setCardOpen]  = useState(false);
  const [userName,  setUserName]  = useState<string | null>(null);
  const [userRole,  setUserRole]  = useState<string>("user");
  const router = useRouter();

  /* sync auth state from localStorage */
  useEffect(() => {
    const sync = () => {
      setUserName(localStorage.getItem("userName"));
      setUserRole(localStorage.getItem("userRole") ?? "user");
    };
    sync();
    const id = setInterval(sync, 600);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    ["token", "user", "userName", "userRole"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setUserName(null);
    setUserRole("user");
    setCardOpen(false);
    router.push("/");
  };

  /* ── LOGGED OUT: morphing Login button ── */
  if (!userName) {
    return (
      <button
        onClick={() => router.push("/auth")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: "40px",
          width: hover ? "120px" : "73px",
          borderRadius: "999px",
          border: hover ? "1px solid #fff" : "1px solid rgba(255,255,255,0.35)",
          background: hover ? "#fff" : "rgba(255,255,255,0.25)",
          color: hover ? "rgba(255,170,90)" : "#fff",
          fontSize: "14px",
          fontWeight: 500,
          transition: "all 0.35s ease",
          cursor: "pointer",
        }}
      >
        {hover ? "Sign Up" : "Login"}
      </button>
    );
  }

  /* ── LOGGED IN: avatar with hover dropdown ── */
  const initials = userName
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setCardOpen(true)}
      onMouseLeave={() => setCardOpen(false)}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF7A18, #AF002D)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
          border: cardOpen ? "2px solid #fff" : "2px solid rgba(255,255,255,0.35)",
          transition: "border 0.25s ease, box-shadow 0.25s ease",
          boxShadow: cardOpen ? "0 0 0 3px rgba(255,122,24,0.35)" : "none",
          userSelect: "none",
        }}
      >
        {initials}
      </div>

      {/* Hover dropdown card */}
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.96 }}
        animate={cardOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          minWidth: 200,
          background: "rgba(18,18,18,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: "16px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          pointerEvents: cardOpen ? "auto" : "none",
          zIndex: 100,
        }}
      >
        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF7A18, #AF002D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
              {userName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: userRole === "admin" ? "#b6ff2e" : "rgba(255,255,255,0.45)",
                marginTop: 3,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {userRole}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 12 }} />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: 8,
            background: "rgba(255,60,60,0.08)",
            border: "1px solid rgba(255,60,60,0.2)",
            color: "rgba(255,120,120,0.9)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,60,60,0.18)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,60,60,0.08)")}
        >
          ↩ Logout
        </button>
      </motion.div>
    </div>
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
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ display: "flex" }}>
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 28,
              marginRight: i === images.length - 1 ? 0 : -6,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src={src}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
