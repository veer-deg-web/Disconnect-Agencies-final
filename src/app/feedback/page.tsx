"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard } from "@/components/ui/keyboard";
import "./Feedback.css";

const CATEGORIES = [
  "Home",
  "AI Models & Automation",
  "App Development",
  "Web Development",
  "SEO & Growth",
  "UI/UX Design",
  "Cloud Infrastructure",
];

export default function FeedbackPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Home");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        setRating(5);
        setCategory("Home");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to submit feedback.");
      }
    } catch {
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
      <div className="fb-content">
        <div className="fb-card">
          <h1 className="fb-title">Submit Detailed Feedback</h1>
          <p className="fb-subtitle">Help us improve. Your feedback might be featured as a testimonial!</p>

          {status === "success" && <div className="fb-message success">{message}</div>}
          {status === "error" && <div className="fb-message error">{message}</div>}

          <div className="fb-desktop-layout">
            <form className="fb-form" onSubmit={handleSubmit}>
              {/* Category */}
              <div className="fb-field">
                <label>Category</label>
                <div className="fb-select-wrapper" ref={dropdownRef}>
                  <div 
                    className={`fb-select-trigger ${isOpen ? 'open' : ''}`} 
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span>{category}</span>
                    <svg className="fb-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fb-options-list"
                      >
                        {CATEGORIES.map((c) => (
                          <div 
                            key={c} 
                            className={`fb-option ${category === c ? 'selected' : ''}`}
                            onClick={() => {
                              setCategory(c);
                              setIsOpen(false);
                            }}
                          >
                            {c}
                            {category === c && (
                              <svg className="fb-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Rating */}
              <div className="fb-field">
                <label>Rating - <strong>{rating} Stars</strong></label>
                <div style={{ display: 'flex', gap: '8px', fontSize: '24px', cursor: 'pointer', margin: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        color: (hoverRating || rating) >= star ? "#fbbf24" : "rgba(255,255,255,0.2)",
                        transition: "color 0.2s"
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
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
                  rows={5}
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

            <div className="fb-keyboard-inline">
              <Keyboard enableSound showPreview className="fb-keyboard" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
