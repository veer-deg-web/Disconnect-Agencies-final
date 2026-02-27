"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

type PremiumWindowProps = {
  themeColor?: string
  glowColor?: string
  backgroundColor?: string
  gridColor?: string
  minimal?: boolean
  parallax?: boolean
  intensity?: number
  isActive?: boolean
  fitContainer?: boolean
}

export default function PremiumWindow({
  themeColor = "#D9FF3F",
  glowColor,
  backgroundColor = "#0b0b12",
  gridColor,
  minimal = false,
  parallax = true,
  intensity = 12,
  isActive = true,
  fitContainer = false,
}: PremiumWindowProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isTablet, setIsTablet] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  const finalGlow = glowColor || themeColor
  const finalGrid = gridColor || themeColor

  /* ===============================
     PARALLAX
  =============================== */
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setIsTablet(w <= 1024)
      setIsCompact(w <= 420)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!parallax || isTablet || isCompact) return

    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * intensity
      const y = (e.clientY / innerHeight - 0.5) * intensity
      setRotate({ x: -y, y: x })
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [parallax, intensity, isTablet, isCompact])

  return (
    <div
      style={{
        width: "100%",
        maxWidth: fitContainer ? "none" : "1200px",
        height: fitContainer ? "100%" : undefined,
        margin: "0 auto",
        perspective: isTablet ? "1000px" : "1400px",
      }}
    >
      <motion.svg
        viewBox="0 0 900 600"
        style={{
          width: "100%",
          height: fitContainer ? "100%" : "auto",
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isActive ? 1 : 0.92,
          scale: isActive ? 1 : 0.98,
          rotateX: isTablet || isCompact ? 0 : rotate.x,
          rotateY: isTablet || isCompact ? 0 : rotate.y,
        }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <defs>
          {/* GRID PATTERN */}
          <pattern
            id="gridPattern"
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.3" fill={finalGrid} opacity="0.35" />
          </pattern>

          {/* GLASS EDGE */}
          <linearGradient id="glassEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* =============================
            WINDOW OUTLINE FORMING
        ============================== */}
        <motion.rect
          x="20"
          y="20"
          width="860"
          height="560"
          rx="28"
          fill={backgroundColor}
          stroke="url(#glassEdge)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        {/* GLOW EDGE */}
        <motion.rect
          x="20"
          y="20"
          width="860"
          height="560"
          rx="28"
          fill="none"
          stroke={finalGlow}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: isActive ? 1 : 0,
            strokeOpacity: isActive ? [0.2, 0.6, 0.2] : 0.2,
          }}
          transition={{
            duration: 2,
            strokeOpacity: { repeat: isActive ? Infinity : 0, duration: 4 },
          }}
        />

        {/* GRID CONTINUOUS DRIFT */}
        <motion.rect
          x="20"
          y="20"
          width="860"
          height="560"
          rx="28"
          fill="url(#gridPattern)"
          animate={{ x: isActive ? [0, -50] : 0 }}
          transition={{ duration: 20, repeat: isActive ? Infinity : 0, ease: "linear" }}
          opacity="0.25"
        />

        {/* =============================
            MAC BUTTONS FORM + BREATH
        ============================== */}
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <motion.circle
            key={i}
            cx={70 + i * 35}
            cy="60"
            r="10"
            fill={c}
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? [1, 1.12, 1] : 1 }}
            transition={{
              delay: 0.6 + i * 0.1,
              duration: 4,
              repeat: isActive ? Infinity : 0,
            }}
          />
        ))}

        {/* =============================
            PANELS FORMING
        ============================== */}
        {[
          { x: 70, y: 120, w: 260, h: 340 },
          { x: 360, y: 120, w: 460, h: 240 },
          { x: 360, y: 380, w: 220, h: 140 },
          { x: 600, y: 380, w: 220, h: 140 },
        ].map((p, i) => (
          <motion.rect
            key={i}
            layout
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            rx="22"
            fill={minimal ? "none" : "#141418"}
            stroke={finalGlow}
            strokeOpacity="0.3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.4 + i * 0.15,
              duration: 0.9,
              ease: [0.23, 1, 0.32, 1],
            }}
          />
        ))}

        {/* =============================
            FLOATING CONTINUOUS
        ============================== */}
        <motion.circle
          cx="590"
          cy="240"
          r="70"
          fill={themeColor}
          opacity="0.15"
          initial={{ scale: 0 }}
          animate={{
            scale: isActive ? 1 : 0.92,
            y: isActive ? [0, -18, 0] : 0,
          }}
          transition={{
            scale: { duration: 1.2 },
            y: { duration: 6, repeat: isActive ? Infinity : 0 },
          }}
        />
      </motion.svg>
    </div>
  )
}
