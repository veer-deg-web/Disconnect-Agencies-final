"use client";

import React from "react";

export default function Footer() {
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
            ].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "6px 4px", // better tap area
                }}
              >
                {item}
              </a>
            ))}
          </nav>

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
