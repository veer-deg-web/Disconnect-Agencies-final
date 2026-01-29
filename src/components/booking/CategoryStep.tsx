"use client";

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
  return (
    <StepWrapper>
      <div className="category-layout">
        {/* LEFT SIDE */}
        <ServiceInfoCard category={category} />

        {/* RIGHT SIDE */}
        <div className="category-panel">
          <h1 className="category-title">Choose Category</h1>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="category-select"
          >
            {Object.keys(serviceData).map((key) => {
              const typedKey = key as CategoryType;
              return (
                <option
                  key={typedKey}
                  value={typedKey}
                  className="category-option"
                >
                  {serviceData[typedKey].title}
                </option>
              );
            })}
          </select>

          <button onClick={next} className="category-btn">
            Continue →
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}