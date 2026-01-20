'use client'
import React, { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import BookCallButton from "./BookCallButton";

const panDown = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 1.05,
  },
  hero: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};
const pillPan = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 1.05,
  },
  pill: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const textContainer = {
  hidden: {},
  text: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const textWord = {
  hidden: { opacity: 0 },
  text: {
    opacity: 1,
    transition: { duration: 0.50 },
  },
};

const buttonGroup = {
  hidden: {},
  buttons: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const riseUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  buttons: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const trusted = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  trusted: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};



export default function HeroContent() {
  const controls = useAnimationControls();

  useEffect(() => {
    async function runSequence() {
      // 1. Heading + Pill together
      setTimeout(() => controls.start("hero"), 0)
      setTimeout(() => controls.start("pill"), 250)
      setTimeout(() => controls.start("text"), 500)
      setTimeout(() => controls.start("buttons"), 1500)
      setTimeout(() => controls.start("trusted"), 2500)
    }

    runSequence();
  }, [controls]);

  return (
    <>
    <ShootingStars />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingLeft: "240px",
        paddingRight: "240px",
      }}
    >
      {/* Pill */}
      <motion.div
        variants={pillPan}
        initial="hidden"
        animate={controls}
      >
        <GlowingPill />
      </motion.div>


      {/* Heading */}
      <motion.h1
        variants={panDown}
        initial="hidden"
        animate={controls}
        style={{
          fontSize: "75px",
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        Disconnect agency
      </motion.h1>

      {/* Paragraph – word by word */}
      <motion.p
        variants={textContainer}
        initial="hidden"
        animate={controls}
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "18px",
        }}
      >
        {`Ideate, refine, and build your vision into a fully functional product with seamless design, smart strategy, and impactful user-focused execution.`
          .split(" ")
          .map((word, i) => (
            <motion.span
              key={i}
              variants={textWord}
              style={{
                marginRight: "6px",
                display: "inline-block",
              }}
            >
              {word}
            </motion.span>
          ))}
      </motion.p>

      {/* Buttons */}
      <motion.div
        variants={buttonGroup}
        initial="hidden"
        animate={controls}
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <motion.div variants={riseUp}>
          <BookCallButton />
        </motion.div>

        <motion.div variants={riseUp}>
          <MorphingLoginButton />
        </motion.div>
      </motion.div>

      {/* Trusted By */}
      <motion.div
        variants={trusted}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.2 }}
      >
        <TrustedBy />
      </motion.div>
    </div>
    </>
  );
}



export function MorphingLoginButton() {
  const [hover, setHover] = useState(false);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "40px",
        width: hover ? "120px" : "73px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "999px",
        border: hover
          ? "1px solid #fff"
          : "1px solid rgba(255,255,255,0.35)",
        background: hover
          ? "#ffffff"
          : "rgba(255,255,255,0.25)",
        backdropFilter: hover ? "none" : "blur(12px)",
        WebkitBackdropFilter: hover ? "none" : "blur(12px)",
        color: hover ? "rgba(255,170,90)" : "#fff",
        fontSize: "14px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        transition: `
          width 0.35s ease,
          background 0.35s ease,
          color 0.3s ease,
          border 0.35s ease
        `,
      }}
    >
      {hover ? "Book a Call" : "Login"}
    </button>
  );
}

export function GlowingPill() {
  return (
    <div
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
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,170,90,0.45)",
        boxShadow: `
          0 0 0 1px rgba(255,160,80,0.25),
          0 0 18px rgba(255,140,64,0.45),
          inset 0 0 12px rgba(255,160,80,0.35)
        `,
        fontSize: "14px",
        color: "#fff",
      }}
    >
      <span>{"</>"}</span>
      <span>We deliver your needs with perfection</span>
    </div>
  );
}

export function TrustedBy() {
  const images = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  ];

  const size = 28;
  const cutRadius = 10;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ display: "flex" }}>
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              marginRight: i === images.length - 1 ? 0 : -6,
              borderRadius: "50%",
              overflow: "hidden",
              WebkitMaskImage:
                i === images.length - 1
                  ? "none"
                  : `radial-gradient(circle ${cutRadius}px at 100% 50%, transparent 98%, black 100%)`,
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

export function ShootingStar({
  left,
  delay,
}: {
  left: string;
  delay: number;
}) {
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
        opacity: 1,
      }}
      animate={{
        y: ["0%", "-340%"],
        opacity: [0, 1, 1, 0],
      }}
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

export function ShootingStars() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Left star 1 */}
      <ShootingStar left="18%" delay={0} />

      {/* Left star 2 */}
      <ShootingStar left="26%" delay={1} />

      {/* Right star */}
      <ShootingStar left="82%" delay={2} />
    </div>
  );
}