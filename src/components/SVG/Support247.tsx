"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"

type Props = {
  text?: string
  pillText?: string
  themeColor?: string
  backgroundColor?: string
  windowGlow?: string
  bounceDuration?: number
}

export default function Support247Window({
  text = "24/7",
  pillText = "Support",
  themeColor = "#D9FF3F",
  backgroundColor = "#05070b",
  windowGlow = "rgba(255,255,255,0.08)",
  bounceDuration = 2,
}: Props) {
  const textRef = useRef<SVGTextElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [pillWidth, setPillWidth] = useState(260)
  const [fontSize, setFontSize] = useState(420)

  /* ================= RESPONSIVE CALC ================= */

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return

      const width = containerRef.current.offsetWidth

      // Scale font based on container width
      const newFont = Math.max(180, width * 1.2)
      setFontSize(newFont)

      // Scale pill width proportionally
      setPillWidth(width * 0.55)
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 40px)",
        background: backgroundColor,
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "28px",
          position: "relative",
          background: "rgba(10,15,20,0.75)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 0 80px ${windowGlow}`,
          overflow: "hidden",
        }}
      >
        {/* MAC BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "16px 20px",
          }}
        >
          <span style={macDot("#ff5f57")} />
          <span style={macDot("#febc2e")} />
          <span style={macDot("#28c840")} />
        </div>

        {/* CONTENT AREA */}
        <div
          style={{
            position: "relative",
            minHeight: "clamp(280px, 45vw, 420px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(20px, 5vw, 40px)",
          }}
        >
          {/* BACKGROUND SVG */}
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <defs>
              <linearGradient id="glassText" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="fadeMask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="65%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>

              <mask id="textMask">
                <rect width="100%" height="100%" fill="url(#fadeMask)" />
              </mask>
            </defs>

            <text
              ref={textRef}
              x="50%"
              y="65%"
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight="900"
              fontFamily="sans-serif"
              fill="url(#glassText)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="3"
              mask="url(#textMask)"
            >
              {text}
            </text>
          </svg>

          {/* SUPPORT PILL */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{
              repeat: Infinity,
              duration: bounceDuration,
              ease: "easeInOut",
            }}
            style={{
              position: "relative",
              width: pillWidth,
              maxWidth: "90%",
              background: themeColor,
              color: "#000",
              padding: "clamp(14px, 3vw, 22px) 0",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontWeight: 600,
              fontSize: "clamp(16px, 3vw, 22px)",
              boxShadow: `0 0 80px ${themeColor}66`,
            }}
          >
            <RobotIcon color="#000" size={28} />
            {pillText}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* Mac dots */
const macDot = (color: string) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  background: color,
})

/* Robot */
const RobotIcon = ({
  color,
  size = 26,
}: {
  color: string
  size?: number
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect x="12" y="18" width="40" height="30" rx="10" fill={color} />
    <circle cx="26" cy="34" r="4" fill="#fff" />
    <circle cx="38" cy="34" r="4" fill="#fff" />
    <line
      x1="32"
      y1="8"
      x2="32"
      y2="18"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="32" cy="6" r="4" fill={color} />
  </svg>
)