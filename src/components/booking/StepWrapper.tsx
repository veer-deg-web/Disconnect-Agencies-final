"use client";

import "./StepWrapper.css";

export default function StepWrapper({ children }: any) {
  return (
    <div className="step-wrapper">
      {children}
    </div>
  );
}