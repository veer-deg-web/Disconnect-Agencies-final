"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiFramer,
} from "react-icons/si"

type Props = {
  themeColor?: string
  backgroundColor?: string
  orbitColor?: string
  outerSpeed?: number
  middleSpeed?: number
  innerSpeed?: number
}

export default function OrbitalWindow({
  themeColor = "#D9FF3F",
  backgroundColor = "#05070b",
  orbitColor = "rgba(255,255,255,0.08)",
  outerSpeed = 40,
  middleSpeed = 25,
  innerSpeed = 15,
}: Props) {
  const [isTablet, setIsTablet] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const viewBoxWidth = 900
  const viewBoxHeight = 600
  const centerX = 450
  const centerY = 300

  /* ================= MOBILE DETECT ================= */
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setIsTablet(w <= 1024)
      setIsMobile(w <= 720)
      setIsCompact(w <= 320)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  /* ================= MOUSE TRACK ================= */
  useEffect(() => {
    if (isTablet) return

    const handle = (e: MouseEvent) => {
      const rect = document
        .getElementById("orbital-svg")
        ?.getBoundingClientRect()

      if (!rect) return

      const x = ((e.clientX - rect.left) / rect.width) * viewBoxWidth
      const y = ((e.clientY - rect.top) / rect.height) * viewBoxHeight

      setMouse({ x, y })
    }

    window.addEventListener("mousemove", handle)
    return () => window.removeEventListener("mousemove", handle)
  }, [isTablet])

  /* ================= RADII ================= */
  const outerRadius = isCompact ? 132 : isMobile ? 170 : isTablet ? 205 : 240
  const middleRadius = isCompact ? 98 : isMobile ? 128 : isTablet ? 155 : 180
  const innerRadius = isCompact ? 66 : isMobile ? 88 : isTablet ? 104 : 120

  /* ================= PARTICLES ================= */
  const particles = useMemo(
    () =>
      Array.from({ length: isCompact ? 12 : isMobile ? 20 : isTablet ? 34 : 60 }).map(
        (_, i) => ({
          id: i,
          x: Math.random() * viewBoxWidth,
          y: Math.random() * viewBoxHeight,
          size: Math.random() * 2 + 1,
          duration: Math.random() * 10 + 10,
        })
      ),
    [isCompact, isMobile, isTablet]
  )

  /* ================= MAGNETIC OFFSET ================= */
  const magneticOffset = (x: number, y: number) => {
    const dx = mouse.x - x
    const dy = mouse.y - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const strength = 40

    if (dist < 120) {
      return {
        x: x + (dx / dist) * strength * (1 - dist / 120),
        y: y + (dy / dist) * strength * (1 - dist / 120),
      }
    }

    return { x, y }
  }

  /* ================= DINOSAUR ICON ================= */
 const DinoIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 64" width="100%" height="100%" shapeRendering="crispEdges">
    <g fill={color}>
      {/* Head */}
      <rect x="36" y="8" width="14" height="10" />
      <rect x="50" y="10" width="4" height="6" />

      {/* Mouth gap */}
      <rect x="46" y="16" width="6" height="2" fill="white" />

      {/* Neck */}
      <rect x="32" y="14" width="6" height="8" />

      {/* Body */}
      <rect x="24" y="20" width="20" height="12" />
      <rect x="20" y="24" width="6" height="8" />

      {/* Arm */}
      <rect x="40" y="24" width="6" height="4" />
      <rect x="44" y="28" width="4" height="4" />

      {/* Tail */}
      <rect x="14" y="28" width="8" height="6" />
      <rect x="10" y="30" width="6" height="6" />

      {/* Legs */}
      <rect x="26" y="32" width="6" height="14" />
      <rect x="36" y="36" width="6" height="10" />
    </g>

    {/* Eye */}
    <rect x="46" y="12" width="2" height="2" fill="#ffffff" />

    {/* Ground line */}
    <rect x="6" y="50" width="52" height="2" fill={color} />
  </svg>
);

  /* ================= ORBIT RENDER ================= */
  const renderOrbit = (
    count: number,
    radius: number,
    speed: number,
    reverse = false,
    icons: any[]
  ) => {
    return (
      <motion.g
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        style={{
          originX: centerX / viewBoxWidth,
          originY: centerY / viewBoxHeight,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * 2 * Math.PI
          const baseX = centerX + radius * Math.cos(angle)
          const baseY = centerY + radius * Math.sin(angle)

          const { x, y } = isTablet ? { x: baseX, y: baseY } : magneticOffset(baseX, baseY)
          const Icon = icons[i % icons.length]

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isCompact ? 14 : isMobile ? 18 : 26}
                fill="#111"
              />
              <foreignObject
                x={x - (isCompact ? 8 : isMobile ? 10 : 14)}
                y={y - (isCompact ? 8 : isMobile ? 10 : 14)}
                width={isCompact ? 16 : isMobile ? 20 : 28}
                height={isCompact ? 16 : isMobile ? 20 : 28}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: themeColor,
                  }}
                >
                  <Icon size={isCompact ? 10 : isMobile ? 14 : 18} />
                </div>
              </foreignObject>
            </g>
          )
        })}
      </motion.g>
    )
  }

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <motion.svg
        id="orbital-svg"
        viewBox="0 0 900 600"
        style={{ width: "100%", height: "auto" }}
      >
        {/* WINDOW */}
        <rect
          x="20"
          y="20"
          width="860"
          height="560"
          rx="28"
          fill={backgroundColor}
          stroke="rgba(255,255,255,0.08)"
        />

        {/* PARTICLE DUST */}
        {particles.map((p) => (
          <motion.circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={themeColor}
            opacity="0.2"
            animate={{ y: [p.y, p.y - 30, p.y] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ORBIT RINGS */}
        {[outerRadius, middleRadius, innerRadius].map((r, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke={orbitColor}
          />
        ))}

        {/* CENTER CORE WITH DINOSAUR */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={isCompact ? 34 : isMobile ? 45 : 60}
            fill={themeColor}
          />
          <foreignObject
            x={centerX - (isCompact ? 16 : isMobile ? 20 : 30)}
            y={centerY - (isCompact ? 16 : isMobile ? 20 : 30)}
            width={isCompact ? 32 : isMobile ? 40 : 60}
            height={isCompact ? 32 : isMobile ? 40 : 60}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DinoIcon color="#000" />
            </div>
          </foreignObject>
        </g>

        {/* ORBITS */}
        {renderOrbit(
          6,
          outerRadius,
          outerSpeed,
          false,
          [SiReact, SiNextdotjs, SiTypescript]
        )}

        {renderOrbit(
          5,
          middleRadius,
          middleSpeed,
          true,
          [SiTailwindcss, SiNodedotjs]
        )}

        {renderOrbit(
          4,
          innerRadius,
          innerSpeed,
          false,
          [SiFramer]
        )}
      </motion.svg>
    </div>
  )
}
