"use client";

type DotBackgroundProps = {
  color?: string;
};

export default function DotBackground({
  color = "rgba(219, 254, 73, 0.18)",
}: DotBackgroundProps) {
  return (
    <div
      className="dot-background"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
      }}
    />
  );
}