"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    if (token && storedName) {
      setUserName(storedName);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`${pathname}#${id}`);
  };

  const scrollToAny = (ids: string[]) => {
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    router.push(`${pathname}#${ids[0]}`);
  };

  const handleFooterNav = (item: string) => {
    if (item === "Home") {
      router.push("/");
      return;
    }
    if (item === "Feature") {
      scrollToAny(["feature", "features", "services"]);
      return;
    }
    if (item === "Benefits") {
      scrollToAny(["benefits", "benefit"]);
      return;
    }
    if (item === "Pricing") {
      scrollToSection("pricing");
      return;
    }
    if (item === "Testimonials") {
      scrollToAny(["testimonials", "testimonial", "reviews"]);
      return;
    }
    if (item === "FAQ") {
      scrollToAny(["faq"]);
      return;
    }
    if (item === "About Us") {
      router.push("/about");
      return;
    }
    if (item === "Careers") {
      router.push("/careers");
      return;
    }
  };

  return (
    <>
      {/* MOBILE OVERRIDES — 344px SAFE */}
      <style>
        {`
          @media (max-width: 768px) {
            .footer {
              padding: 32px 16px !important;
            }

            .footer-nav {
              gap: 16px !important;
              row-gap: 12px !important;
              font-size: 13px !important;
            }

            .footer-copy {
              font-size: 12px !important;
              text-align: center !important;
              line-height: 1.6 !important;
            }
          }
        `}
      </style>

      <footer
        className="footer"
        style={{
          backgroundColor: "#0b0b0b",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {/* NAV LINKS */}
          <nav
            className="footer-nav"
            style={{
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
              justifyContent: "center",
              fontSize: "14px",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {[
              "Home",
              "Feature",
              "Benefits",
              "Pricing",
              "Testimonials",
              "FAQ",
              "About Us",
              "Careers",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleFooterNav(item)}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "6px 4px", // better tap area
                  background: "transparent",
                  border: "none",
                  font: "inherit",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* FEEDBACK SECTION FOR LOGGED IN USERS */}
          {userName && (
            <div style={{ width: "100%", maxWidth: "500px", marginTop: "16px", marginBottom: "16px", textAlign: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 500, color: "#fff" }}>Enjoying Disconnect?</h4>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  Have thoughts or suggestions? We'd love to hear from you. Your feedback might be featured directly on our page!
                </p>
                <button
                  onClick={() => router.push("/feedback")}
                  style={{
                    padding: "10px 24px",
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Write Feedback
                </button>
              </div>
            </div>
          )}

          {/* COPYRIGHT */}
          <p
            className="footer-copy"
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            2025 Copyright © Aset. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
