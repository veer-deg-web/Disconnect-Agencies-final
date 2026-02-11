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
  iconGap?: number;
  logoSize?: number;   // ✅ NEW PROP
};

export default function UIUXShowcaseLogos({
  title = "Our designs are featured on",
  logos,
  iconGap = 64,
  logoSize = 44, // default size
}: UIUXShowcaseLogosProps) {
  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* HARD OVERRIDE */}
      <style>{`
        .logo-loop-fix,
        .logo-loop-fix * {
          mask-image: none !important;
          -webkit-mask-image: none !important;
        }
        .logo-loop-fix::before,
        .logo-loop-fix::after {
          display: none !important;
          content: none !important;
        }
      `}</style>

      {title && (
        <h3
          style={{
            textAlign: "center",
            marginBottom: 24,
            opacity: 0.7,
            fontWeight: 500,
            color: "#fff",
            fontSize: "18px",
          }}
        >
          {title}
        </h3>
      )}

      <div className="logo-loop-fix">
        <LogoLoop
          logos={[...logos, ...logos, ...logos]}
          speed={80}
          direction="left"
          logoHeight={logoSize}   // ✅ dynamic
          gap={iconGap}           // spacing
          hoverSpeed={0}
          scaleOnHover
          fadeOut={false}
          ariaLabel="Technology partners"
        />
      </div>
    </section>
  );
}