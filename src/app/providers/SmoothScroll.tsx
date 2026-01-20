"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ❌ HARD EXIT — never init Lenis on touch devices
    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
  ...( {
    smoothTouch: false,
  } as unknown as Record<string, never>),
});


    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    // 🛑 Emergency kill switch if touch is detected later
    const killOnTouch = () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };

    window.addEventListener("touchstart", killOnTouch, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) lenisRef.current.destroy();

      window.removeEventListener("touchstart", killOnTouch);
    };
  }, []);

  return null;
}
