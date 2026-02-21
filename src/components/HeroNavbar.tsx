"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MorphingLoginButton } from "./HeroContent";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_SMOOTH as any,
      delay: 0.1,
    },
  },
};

const navLinkVariants = {
  initial: { color: "rgba(255,255,255,0.7)" },
  hover: {
    color: "#fff",
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" } as any,
  },
  tap: { scale: 0.95 },
};

export default function HeroNavbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (item: string) => {
    setOpen(false);

    if (item === "Home") {
      router.push("/");
      return;
    }

    // ❌ removed old Pricing route
    // if (item === "Pricing") router.push("/pricing");

    if (item === "Benefit") router.push("/benefit");
    if (item === "Book A Call") router.push("/book-call");
  };

  return (
    <>
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

      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
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
          <motion.div
            style={{ flexShrink: 0, cursor: "pointer" }}
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.png"
              alt="Disconnect"
              width={116}
              height={36}
              priority
            />
          </motion.div>

          {/* DESKTOP LINKS */}
          <ul
            className="nav-links"
            style={{
              display: "flex",
              gap: "40px",
              listStyle: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
              (item) => (
                <motion.li
                  key={item}
                  variants={navLinkVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  style={{ cursor: "pointer" }}
                >
                  {/* ✅ SERVICES SCROLL */}
                  {item === "Services" ? (
                    <Link
                      href="/#services"
                      onClick={() => setOpen(false)}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      Services
                    </Link>
                  ) : item === "Pricing" ? (
                    /* ✅ PRICING SCROLL (CURRENT PAGE) */
                    <Link
                      href={`${pathname}#pricing`}
                      onClick={() => setOpen(false)}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      Pricing
                    </Link>
                  ) : (
                    <span onClick={() => handleNavigate(item)}>
                      {item}
                    </span>
                  )}
                </motion.li>
              )
            )}
          </ul>

          {/* DESKTOP CTA */}
          <div className="login-btn">
            <MorphingLoginButton />
          </div>

          {/* HAMBURGER */}
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
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                background: "#000",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden", // Ensures smooth height transition
              }}
            >
              <div style={{ padding: "20px 16px" }}>
                {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
                  (item) => (
                    <div
                      key={item}
                      style={{
                        padding: "14px 0",
                        fontSize: "16px",
                        color: "#fff",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                      }}
                    >
                      {item === "Services" ? (
                        <Link
                          href="/#services"
                          onClick={() => setOpen(false)}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          Services
                        </Link>
                      ) : item === "Pricing" ? (
                        <Link
                          href={`${pathname}#pricing`}
                          onClick={() => setOpen(false)}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          Pricing
                        </Link>
                      ) : (
                        <span onClick={() => handleNavigate(item)}>
                          {item}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}