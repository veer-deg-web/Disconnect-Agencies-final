import React from "react";
import "./StepWrapper.css";

export default function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="step-wrapper">
      {children}
    </div>
  );
}