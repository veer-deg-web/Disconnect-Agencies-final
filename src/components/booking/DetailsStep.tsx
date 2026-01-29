"use client";

import { useState } from "react";
import StepWrapper from "./StepWrapper";
import ServiceInfoCard from "./ServiceInfoCard";
import "./DetailsStep.css";

export default function DetailsStep({ category, date, time, back }: any) {
  const selectedDate = new Date(date);

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // FORM STATE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  const isFormValid = nameError === "" && emailError === "" && name && email;

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
          />

          {/* SUBMIT */}
          <button
            disabled={!isFormValid}
            className={`details-submit ${
              isFormValid ? "submit-active" : "submit-disabled"
            }`}
          >
            Schedule Call
          </button>

          {/* SUMMARY */}
          <p className="details-summary">
            You selected: {category} • {formattedDate} • {time}
          </p>

          {/* BACK */}
          <button onClick={back} className="details-back">
            ← Back
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}