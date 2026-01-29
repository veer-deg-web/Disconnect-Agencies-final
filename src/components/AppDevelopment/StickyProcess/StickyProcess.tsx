"use client";

import "./StickyProcess.css";
import Cubes from "@/components/Cubes";

const steps = [
  {
    step: "Step 1",
    title: "Share your idea",
    description:
      "Tell us your app requirements and we’ll plan the best roadmap for your product.",
  },
  {
    step: "Step 2",
    title: "Design & strategy",
    description:
      "We design intuitive UI/UX and define the technical strategy for scale.",
  },
  {
    step: "Step 3",
    title: "Development",
    description:
      "Our engineers build fast, secure, and scalable applications.",
  },
  {
    step: "Step 4",
    title: "Launch & growth",
    description:
      "We launch, monitor, and continuously improve your product.",
  },
];

export default function StickyProcess() {
  return (
    <section className="sticky-process">
      <div className="sticky-process__inner">
        {/* LEFT – TEXT */}
        <div className="steps">
          {steps.map((item, index) => (
            <div key={index} className="step">
              <span className="step__label">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* RIGHT – STICKY CUBES */}
        <div className="visual">
          <div className="visual__sticky">
            <div style={{ height: "600px", position: "relative" }}>
              <Cubes
                gridSize={6}
                maxAngle={30}
                radius={3}
                borderStyle="2px dashed #B19EEF"
                faceColor="#1a1a2e"
                rippleColor="#ff6b6b"
                rippleSpeed={1.5}
                autoAnimate
                rippleOnClick
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
