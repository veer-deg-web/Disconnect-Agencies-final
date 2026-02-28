"use client";

import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import StepWrapper from "./StepWrapper";
import ServiceInfoCard from "./ServiceInfoCard";
import { CategoryType, serviceData } from "@/components/data/serviceData";
import "./DetailsStep.css";

interface DetailsStepProps {
  category: CategoryType;
  date: Date;
  time: string | null;
  back: () => void;
}

export default function DetailsStep({ category, date, time, back }: DetailsStepProps) {
  const selectedDate = new Date(date);

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // FORM STATE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // ERROR STATE
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateName = (value: string) => {
    if (!value.trim()) return "Name is required.";
    if (!/^[A-Za-z ]+$/.test(value)) return "Name must contain only letters.";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Enter a valid email address.";
    return "";
  };

  const isFormValid =
    nameError === "" &&
    emailError === "" &&
    !!name.trim() &&
    !!email.trim() &&
    !!time &&
    !isSubmitting;

  const handleSchedule = async () => {
    if (!time || !isFormValid) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await fetch("/api/bookings/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          date: selectedDate.toISOString(),
          time,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to schedule call");
      }

      setSubmitSuccess("Call scheduled. Confirmation email has been sent.");
      setName("");
      setEmail("");
      setNotes("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Failed to schedule call");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepWrapper>
      <div className="details-layout">
        <ServiceInfoCard category={category} />

        <div className="details-panel">
          <h1 className="details-title">Enter Details</h1>

          {/* NAME */}
          <input
            placeholder="Name*"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(validateName(e.target.value));
            }}
            className="details-input"
          />
          {nameError && <p className="details-error">{nameError}</p>}

          {/* EMAIL */}
          <input
            placeholder="Email*"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            className="details-input"
          />
          {emailError && <p className="details-error">{emailError}</p>}

          {/* TEXTAREA */}
          <textarea
            placeholder="Any special assistance you need? (Optional)"
            className="details-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* SUMMARY */}
          <p className="details-summary">
            You selected: {serviceData[category].title} • {formattedDate} • {time}
          </p>
          {submitError && <p className="details-error">{submitError}</p>}
          {submitSuccess && <p className="details-success">{submitSuccess}</p>}

          {/* ACTIONS */}
          <div className="details-actions">
            <button
              type="button"
              onClick={back}
              className="booking-icon-btn"
              aria-label="Go to previous step"
            >
              <IoChevronBack />
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              className={`details-submit-btn ${isFormValid ? "active" : "disabled"}`}
              aria-label="Schedule call"
              onClick={handleSchedule}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Call"}
            </button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
