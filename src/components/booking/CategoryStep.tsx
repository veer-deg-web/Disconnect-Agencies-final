"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepWrapper from "./StepWrapper";
import ServiceInfoCard from "./ServiceInfoCard";
import { serviceData, CategoryType } from "@/components/data/serviceData";
import "./CategoryStep.css";

interface CategoryStepProps {
  category: CategoryType;
  setCategory: (c: CategoryType) => void;
  next: () => void;
}

export default function CategoryStep({
  category,
  setCategory,
  next,
}: CategoryStepProps) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!selectRef.current) return;
      if (!selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <StepWrapper>
      <div className="category-layout">

        {/* LEFT */}
        <ServiceInfoCard category={category} />

        {/* RIGHT */}
        <div className="category-panel">
          <h1 className="category-title">Choose Category</h1>

          {/* Custom Dropdown */}
          <div className="custom-select" ref={selectRef}>
            <button
              type="button"
              className="select-trigger"
              onClick={() => setOpen((prev) => !prev)}
            >
              {serviceData[category].title}
              <span className={`arrow ${open ? "rotate" : ""}`}>▾</span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="select-dropdown"
                >
                  {Object.keys(serviceData).map((key) => {
                    const typedKey = key as CategoryType;
                    return (
                      <div
                        key={typedKey}
                        className={`select-option ${
                          category === typedKey ? "active" : ""
                        }`}
                        onClick={() => {
                          setCategory(typedKey);
                          setOpen(false);
                        }}
                      >
                        {serviceData[typedKey].title}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="button" onClick={next} className="category-btn">
            Continue →
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
