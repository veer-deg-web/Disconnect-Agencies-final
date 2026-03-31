"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a12",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "rgba(255, 92, 0, 0.1)",
          border: "1px solid rgba(255, 92, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 28,
        }}
      >
        ⚠️
      </div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          maxWidth: 480,
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        An unexpected error occurred. Please try again or contact support if the
        issue persists.
      </p>
      <button
        onClick={reset}
        style={{
          background: "linear-gradient(135deg, #FF5C00, #FF0031)",
          border: "none",
          borderRadius: 12,
          padding: "12px 32px",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.target as HTMLButtonElement).style.boxShadow =
            "0 10px 20px rgba(255, 92, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = "translateY(0)";
          (e.target as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        Try Again
      </button>
    </div>
  );
}
