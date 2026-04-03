"use client"

import { useEffect, useRef } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: any = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [222 / 255, 94 / 255, 3 / 255],
  glowColor: [1, 1, 1],
  opacity: 0.9,
  scale: 1.05,
  markers: [
    { location: [37.7749, -122.4194], size: 0.05 }, // USA (SF)
    { location: [28.6139, 77.2090], size: 0.08 },  // India (Delhi)
    { location: [51.5074, -0.1278], size: 0.05 },   // UK (London)
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const phiRef = useRef(0)
  const widthRef = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    let width = 0;
    
    const onResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        width = rect.width;
        widthRef.current = width;
      }
    }

    const resizeObserver = new ResizeObserver(onResize)
    if (canvasRef.current) resizeObserver.observe(canvasRef.current)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state: Record<string, any>) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.005;
        }
        state.phi = phiRef.current + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    } as any);

    setTimeout(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 0)

    return () => {
      globe.destroy()
      resizeObserver.disconnect()
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[600px] flex items-center justify-center",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
