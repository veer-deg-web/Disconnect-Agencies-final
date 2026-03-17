"use client";

import { useEffect, useRef } from "react";

export default function SmoothScroll() {
  const locoRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let loco: unknown;

    const initScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      const scrollContainer = document.querySelector(
        "[data-scroll-container]"
      ) as HTMLElement | null;

      if (!scrollContainer) return;

      const isMobile = window.innerWidth < 768;

      const LocomotiveScrollClass = LocomotiveScroll as unknown as { new (opt: unknown): unknown };
      loco = new LocomotiveScrollClass({
        el: scrollContainer,
        smooth: !isMobile, // ❗ disable smooth on mobile
        lerp: 0.08,
        multiplier: 1,
        smartphone: {
          smooth: false,
        },
        tablet: {
          smooth: false,
        },
      });

      locoRef.current = loco;
    };

    initScroll();

    return () => {
      if (locoRef.current) {
        (locoRef.current as { destroy: () => void }).destroy();
        locoRef.current = null;
      }
    };
  }, []);

  return null;
}