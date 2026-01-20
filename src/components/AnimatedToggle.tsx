"use client";

import { motion } from "framer-motion";

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
            height:"100%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"center"
          }}
        > <div style={{
            
            borderRadius:"999px",
            width:"64px",
            height:"64px",
            backgroundColor:"white"
            
        }}>

        </div>
        </motion.div>

        {/* LEFT ICON */}
        <div className="icon left">✦</div>

        {/* RIGHT ICON */}
        <div className="icon right">🌐</div>
      </div>

      <style jsx>{`
        .toggle-wrap {
          position: relative;
          display: flex;
          justify-content: center;
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

        /* WHITE MOVING PLATE */
        .white-bg {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 140px; /* 🔥 BIG ENOUGH TO SEE */
          height: 60px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow:
            0 0 25px rgba(255, 255, 255, 0.9),
            0 0 60px rgba(255, 122, 24, 0.7);
          z-index: 50;
        }

        /* ICONS */
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
          z-index: 2; /* ABOVE white bg */
        }

        .icon.left {
          left: 6px;
        }

        .icon.right {
          right: 6px;
        }
      `}</style>
    </div>
  );
}
