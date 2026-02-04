"use client";

import LogoLoop from "@/components/LogoLoop";
import React from "react";

export type LogoItem = {
  node: React.ReactNode;
  title: string;
  href?: string;
};

type UIUXShowcaseLogosProps = {
  title?: string;
  logos: LogoItem[];
};

export default function UIUXShowcaseLogos({
  title = "Our designs are featured on",
  logos,
}: UIUXShowcaseLogosProps) {
  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
      aria-label="UIUX Logo Showcase"
    >
      {title && (
        <h3
          style={{
            textAlign: "center",
            marginBottom: "24px",
            opacity: 0.7,
            fontWeight: 500,
          }}
        >
          {title}
        </h3>
      )}

      {/* 🔁 Smooth, continuous marquee */}
      <LogoLoop
        logos={[...logos, ...logos, ...logos]} // 🔥 ensures linear continuity
        speed={80}
        direction="left"
        logoHeight={44}
        gap={64}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        ariaLabel="Technology partners"
      />
    </section>
  );
}