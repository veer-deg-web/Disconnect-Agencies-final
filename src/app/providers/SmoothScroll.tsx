"use client";

import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function SmoothScroll() {
  const locoRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const scrollContainer = document.querySelector(
      "[data-scroll-container]"
    ) as HTMLElement | null;

    if (!scrollContainer) {
      console.warn("LocomotiveScroll: No scroll container found");
      return;
    }

    // 🔧 TS FIX: cast options to any
    const loco = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true },
      lerp: 0.08,
    } as any);

    locoRef.current = loco;

    return () => {
      loco.destroy();
      locoRef.current = null;
    };
  }, []);

  return null;
}