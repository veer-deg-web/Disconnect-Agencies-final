"use client";

import { ShimmerLine } from "./ShimmerLine";

export default function ShimmerField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* LEFT SIDE SHIMMERS */}
      <ShimmerLine left="6%" delay={0} />
      <ShimmerLine left="10%" delay={1.2} duration={4.5} />
      <ShimmerLine left="14%" delay={2.4} />

      {/* RIGHT SIDE SHIMMERS */}
      <ShimmerLine left="88%" delay={0.6} />
      <ShimmerLine left="92%" delay={1.8} duration={5} />
      <ShimmerLine left="96%" delay={3} />
    </div>
  );
}
