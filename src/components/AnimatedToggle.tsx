"use client";

import { motion } from "framer-motion";
import BookCallButton from "./BookCallButton";

export default function ProperToggle() {
  return (
    <div className="toggle-wrap">
      {/* AMBIENT GLOW */}
      <div className="glow-bg" />

      <div className="capsule">
        {/* MOVING WHITE BACKGROUND */}
        <motion.div
          className="white-bg"
          animate={{ x: [10, 300, 10] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              borderRadius: "999px",
              width: "64px",
              height: "64px",
              backgroundColor: "white",
            }}
          />
        </motion.div>

        {/* LEFT ICON */}
        <div className="icon left">✦</div>

        {/* RIGHT ICON */}
        <div className="icon right">🌐</div>
      </div>

      {/* MOBILE CTA */}
      <div className="mobile-cta">
        <BookCallButton />
      </div>

      <style jsx>{`
        /* ================= DESKTOP (UNCHANGED) ================= */

        .toggle-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 80px 0;
        }

        .glow-bg {
          position: absolute;
          width: 480px;
          height: 240px;
          background: radial-gradient(
            circle,
            rgba(255, 122, 24, 0.4),
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
        }

        .capsule {
          position: relative;
          width: 360px;
          height: 72px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            rgba(255, 122, 24, 0.55),
            rgba(255, 122, 24, 0.2)
          );
          border: 2px solid rgba(255, 122, 24, 0.9);
          overflow: hidden;
        }

        .white-bg {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 140px;
          height: 60px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow:
            0 0 25px rgba(255, 255, 255, 0.9),
            0 0 60px rgba(255, 122, 24, 0.7);
          z-index: 1;
        }

        .icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #ff7a18;
          z-index: 2;
          pointer-events: none;
        }

        .icon.left {
          left: 6px;
        }

        .icon.right {
          right: 6px;
        }

        .mobile-cta {
          display: none;
        }

        /* ================= MOBILE ONLY ================= */

        @media (max-width: 480px) {
          .capsule {
            width: 300px;
            height: 64px;
          }

          .white-bg {
            width: 120px;
            height: 52px;
          }

          .icon {
            width: 52px;
            height: 52px;
            font-size: 18px;
          }

          .glow-bg {
            width: 300px;
            height: 160px;
            filter: blur(48px);
          }

          .mobile-cta {
            display: flex;
            justify-content: center;
            margin-top: 32px;
          }
        }
      `}</style>
    </div>
  );
}
