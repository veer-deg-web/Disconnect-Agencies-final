"use client";

import { useState } from "react";

import CategoryStep from "./CategoryStep";
import CalendarStep from "./CalendarStep";
import TimeStep from "./TimeStep";
import DetailsStep from "./DetailsStep";
import { CategoryType } from "@/components/data/serviceData";

import BackgroundEllipses from "@/components/BackgroundElipse";
import "./BookingSteps.css";

interface BookingStepsProps {
  initialCategory: CategoryType;
}

export default function BookingSteps({ initialCategory }: BookingStepsProps) {
  const [step, setStep] = useState<
    "category" | "calendar" | "time" | "details"
  >("category");
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  return (
    <main className="booking-steps">
      {/* ⭐ Background Ellipses */}
      <BackgroundEllipses />

      <div className="booking-steps__container">
        {step === "category" && (
          <CategoryStep
            category={category}
            setCategory={setCategory}
            next={() => setStep("calendar")}
          />
        )}

        {step === "calendar" && (
          <CalendarStep
            category={category}
            date={date}
            setDate={setDate}
            next={() => setStep("time")}
            back={() => setStep("category")}
          />
        )}

        {step === "time" && date && (
          <TimeStep
            category={category}
            date={date}
            time={time}
            setTime={setTime}
            next={() => setStep("details")}
            back={() => setStep("calendar")}
          />
        )}

        {step === "details" && date && (
          <DetailsStep
            category={category}
            date={date}
            time={time}
            back={() => setStep("time")}
          />
        )}
      </div>
    </main>
  );
}