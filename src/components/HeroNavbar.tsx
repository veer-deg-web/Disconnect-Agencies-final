"use client";

import Image from "next/image";
import { useState } from "react";
import { MorphingLoginButton } from "./HeroContent";

export default function HeroNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE RULES — BUILT FOR 344px */}
      <style>
        {`
          @media (max-width: 768px) {
            .nav {
              max-width: 100% !important;
              padding: 0 16px !important;
            }

            .nav-links,
            .login-btn {
              display: none !important;
            }

            .hamburger {
              display: flex !important;
            }
          }
        `}
      </style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* NAV BAR */}
        <nav
          className="nav"
          style={{
            maxWidth: "1320px",
            height: "70px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <div style={{ flexShrink: 0 }}>
            <Image
              src="/logo.png"
              alt="Disconnect"
              width={116}
              height={36}
              priority
            />
          </div>

          {/* DESKTOP LINKS */}
          <ul
            className="nav-links"
            style={{
              display: "flex",
              gap: "40px",
              listStyle: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
              (item) => (
                <li
                  key={item}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      "rgba(255,255,255,0.7)")
                  }
                >
                  {item}
                </li>
              )
            )}
          </ul>

          {/* DESKTOP CTA */}
          <div className="login-btn">
            <MorphingLoginButton />
          </div>

          {/* HAMBURGER — MOBILE */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="hamburger"
            style={{
              display: "none",
              width: "44px",
              height: "44px",
              padding: "10px",
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexDirection: "column",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                transition: "0.25s",
                transform: open
                  ? "rotate(45deg) translateY(8px)"
                  : "none",
              }}
            />
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                opacity: open ? 0 : 1,
                transition: "0.25s",
              }}
            />
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                transition: "0.25s",
                transform: open
                  ? "rotate(-45deg) translateY(-8px)"
                  : "none",
              }}
            />
          </button>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div
            style={{
              background: "#000",
              padding: "20px 16px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
              (item) => (
                <div
                  key={item}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "14px 0",
                    fontSize: "16px",
                    color: "#fff",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        )}
      </header>
    </>
  );
}
