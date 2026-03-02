"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./Feedback.css";

const CATEGORIES = ["Home", "AI", "Cloud", "SEO", "WebDev"];

export default function FeedbackPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Home");
  const [rating, setRating] = useState<number>(10);
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setHydrated(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          category,
          rating,
          position,
          company,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Thank you! Your full feedback has been submitted.");
        setContent("");
        setPosition("");
        setCompany("");
        setRating(10);
        setCategory("Home");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to submit feedback.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      if (status === "success") {
        setTimeout(() => setStatus("idle"), 4000);
      }
    }
  };

  if (!hydrated || !authorized) return null;

  return (
    <div className="fb-page-container">
      <div className="fb-card">
        <h2 className="fb-title">Submit Detailed Feedback</h2>
        <p className="fb-subtitle">Help us improve. Your feedback might be featured as a testimonial!</p>

        {status === "success" && <div className="fb-message success">{message}</div>}
        {status === "error" && <div className="fb-message error">{message}</div>}

        <form className="fb-form" onSubmit={handleSubmit}>
          {/* Category */}
          <div className="fb-field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Rating */}
          <div className="fb-field">
            <label>Rating (Out of 10) - <strong>{rating}</strong></label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value))} 
            />
          </div>

          {/* Position & Company Row */}
          <div className="fb-row">
            <div className="fb-field">
              <label>Your Position (e.g. CEO, Developer)</label>
              <input 
                type="text" 
                placeholder="CEO" 
                value={position} 
                onChange={(e) => setPosition(e.target.value)} 
                required 
              />
            </div>
            <div className="fb-field">
              <label>Company Name</label>
              <input 
                type="text" 
                placeholder="Tech Corp" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Content */}
          <div className="fb-field">
            <label>Your Feedback</label>
            <textarea 
              rows={4} 
              placeholder="What are your thoughts?" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="fb-submit-btn" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
