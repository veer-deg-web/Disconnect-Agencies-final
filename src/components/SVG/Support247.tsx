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
  isActive?: boolean
  fitContainer?: boolean
}

export default function Support247Window({
  text = "24/7",
  pillText = "Support",
  themeColor = "#D9FF3F",
  backgroundColor = "#05070b",
  windowGlow = "rgba(255,255,255,0.08)",
  bounceDuration = 2,
  isActive = true,
  fitContainer = false,
}: Props) {
  const textRef = useRef<SVGTextElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [pillWidth, setPillWidth] = useState(260)
  const [fontSize, setFontSize] = useState(420)
  const [iconSize, setIconSize] = useState(28)
  const [isCompact, setIsCompact] = useState(false)

  /* ================= RESPONSIVE CALC ================= */

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return

      const width = containerRef.current.offsetWidth

      // Keep headline and pill readable on very narrow screens (e.g. ~280px cover displays).
      const newFont = Math.min(390, Math.max(110, width * 0.95))
      setFontSize(newFont)

      setPillWidth(Math.min(width * 0.8, 340))
      setIconSize(width <= 320 ? 20 : width <= 420 ? 24 : 28)
      setIsCompact(width <= 420)
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: fitContainer ? "100%" : undefined,
        display: "flex",
        justifyContent: "center",
        padding: fitContainer ? 0 : "clamp(8px, 2.8vw, 28px)",
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
          minHeight: fitContainer ? 0 : isCompact ? 220 : undefined,
          height: fitContainer ? "100%" : undefined,
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
              minHeight: fitContainer ? "100%" : "clamp(180px, 34vw, 340px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: fitContainer ? "10px" : "clamp(12px, 3vw, 24px)",
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
            animate={{ y: isActive ? [0, -14, 0] : 0 }}
            transition={{
              repeat: isActive ? Infinity : 0,
              duration: bounceDuration,
              ease: "easeInOut",
            }}
            style={{
              position: "relative",
              width: pillWidth,
              maxWidth: "90%",
              background: themeColor,
              color: "#000",
              padding: "clamp(10px, 2.6vw, 16px) 0",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontWeight: 600,
              fontSize: "clamp(13px, 2.4vw, 18px)",
              boxShadow: `0 0 80px ${themeColor}66`,
              whiteSpace: "nowrap",
            }}
          >
            <RobotIcon color="#000" size={iconSize} />
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
